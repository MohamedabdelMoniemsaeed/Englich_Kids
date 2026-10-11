#!/usr/bin/env python3
import os
import sys
import subprocess
import shutil
import zipfile
import struct

def main():
    print("=== Building Official Google Play AAB & APK targeting API 36 ===")
    work_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(work_dir)
    
    dist_dir = os.path.join(work_dir, "dist")
    audio_dir = os.path.join(work_dir, "public", "audio")
    keystore = os.path.join(work_dir, "release.keystore")
    bundletool = os.path.join(work_dir, "bin", "bundletool.jar")
    aapt2 = os.path.join(work_dir, "bin", "aapt2")
    
    build_tmp = "/tmp/build_release_final"
    if os.path.exists(build_tmp):
        shutil.rmtree(build_tmp)
    os.makedirs(build_tmp, exist_ok=True)
    
    # 1. Build web production bundle first
    print("1. Building production web assets (Vite)...")
    subprocess.run(["npm", "run", "build"], cwd=work_dir, check=True)
    
    # 2. Prepare AndroidManifest.xml bytearray targeting API 36, minSdkVersion 24, versionCode 3
    print("2. Reading base AndroidManifest.xml and patching attributes...")
    src_apk = os.path.join(work_dir, "public", "English_Kids.apk")
    with zipfile.ZipFile(src_apk, "r") as zin:
        manifest_data = bytearray(zin.read("AndroidManifest.xml"))
    
    # Set versionCode to 3
    manifest_data[1684:1688] = struct.pack("<I", 3)
    # Set compileSdkVersion to 36
    manifest_data[1724:1728] = struct.pack("<I", 36)
    # Set platformBuildVersionCode to 36
    manifest_data[1784:1788] = struct.pack("<I", 36)
    # Set minSdkVersion to 24
    manifest_data[1860] = 24
    # Set targetSdkVersion to 36
    manifest_data[1880:1884] = struct.pack("<I", 36)
    
    print(f"  versionCode: {struct.unpack('<I', manifest_data[1684:1688])[0]}")
    print(f"  compileSdkVersion: {struct.unpack('<I', manifest_data[1724:1728])[0]}")
    print(f"  platformBuildVersionCode: {struct.unpack('<I', manifest_data[1784:1788])[0]}")
    print(f"  minSdkVersion: {manifest_data[1860]}")
    print(f"  targetSdkVersion: {struct.unpack('<I', manifest_data[1880:1884])[0]}")
    
    # 3. Extract core Android binary files (classes.dex, resources.arsc, res/)
    extract_dir = os.path.join(build_tmp, "extracted")
    os.makedirs(extract_dir, exist_ok=True)
    with zipfile.ZipFile(src_apk, "r") as zin:
        for item in zin.infolist():
            if item.filename.startswith("META-INF/"):
                continue
            if item.filename.startswith("assets/www/"):
                continue
            zin.extract(item, extract_dir)
            
    # Write patched AndroidManifest.xml
    with open(os.path.join(extract_dir, "AndroidManifest.xml"), "wb") as mf:
        mf.write(manifest_data)
        
    # Copy latest dist to assets/www
    print("3. Packaging full web app and offline audio into assets/www...")
    www_dir = os.path.join(extract_dir, "assets", "www")
    os.makedirs(www_dir, exist_ok=True)
    for root, dirs, files in os.walk(dist_dir):
        for f in files:
            if f.endswith(".apk") or f.endswith(".aab") or f.endswith(".zip") or f.endswith(".idsig"):
                continue
            src_f = os.path.join(root, f)
            rel_f = os.path.relpath(src_f, dist_dir)
            dst_f = os.path.join(www_dir, rel_f)
            os.makedirs(os.path.dirname(dst_f), exist_ok=True)
            shutil.copy2(src_f, dst_f)
            
    # Copy all offline audio files to assets/www/audio
    dst_audio = os.path.join(www_dir, "audio")
    os.makedirs(dst_audio, exist_ok=True)
    if os.path.exists(audio_dir):
        for f in os.listdir(audio_dir):
            if f.endswith(".mp3"):
                shutil.copy2(os.path.join(audio_dir, f), os.path.join(dst_audio, f))
                
    # 4. Create unsigned APK
    print("4. Creating unsigned aligned APK...")
    unsigned_apk = os.path.join(build_tmp, "unsigned.apk")
    with zipfile.ZipFile(unsigned_apk, "w") as zout:
        for root, dirs, files in os.walk(extract_dir):
            for f in sorted(files):
                abs_p = os.path.join(root, f)
                rel_p = os.path.relpath(abs_p, extract_dir).replace("\\", "/")
                is_stored = (rel_p == "resources.arsc" or rel_p.endswith(".png") or rel_p.endswith(".jpg"))
                comp = zipfile.ZIP_STORED if is_stored else zipfile.ZIP_DEFLATED
                zout.write(abs_p, rel_p, compress_type=comp)
                
    # 5. Zipalign
    aligned_apk = os.path.join(build_tmp, "aligned.apk")
    subprocess.run(["zipalign", "-p", "-f", "4", unsigned_apk, aligned_apk], check=True)
    
    # 6. Apksigner
    print("5. Signing APK with release.keystore (v1, v2, v3)...")
    signed_apk = os.path.join(build_tmp, "English_Kids.apk")
    subprocess.run([
        "apksigner", "sign",
        "--ks", keystore,
        "--ks-pass", "pass:englishkids123",
        "--key-pass", "pass:englishkids123",
        "--ks-key-alias", "englishkids",
        "--v1-signing-enabled", "true",
        "--v2-signing-enabled", "true",
        "--v3-signing-enabled", "true",
        "--out", signed_apk,
        aligned_apk
    ], check=True)
    
    # Verify APK
    subprocess.run(["apksigner", "verify", "--verbose", signed_apk], check=True)
    print("  APK verified successfully!")
    
    # 7. Convert to proto format using aapt2
    print("6. Converting resources and manifest to proto format via aapt2...")
    proto_apk = os.path.join(build_tmp, "proto_apk.zip")
    subprocess.run([aapt2, "convert", "--output-format", "proto", "-o", proto_apk, signed_apk], check=True)
    
    # 8. Create base.zip module for bundletool
    print("7. Assembling base module for Android App Bundle...")
    base_zip = os.path.join(build_tmp, "base.zip")
    with zipfile.ZipFile(proto_apk, "r") as zin, zipfile.ZipFile(base_zip, "w") as zout:
        for item in zin.infolist():
            fn = item.filename
            if fn.startswith("META-INF/"):
                continue
            data = zin.read(fn)
            if fn == "AndroidManifest.xml":
                zout.writestr("manifest/AndroidManifest.xml", data)
            elif fn.endswith(".dex"):
                zout.writestr("dex/" + fn, data)
            elif fn == "resources.pb":
                zout.writestr("resources.pb", data)
            elif fn.startswith("res/"):
                zout.writestr(fn, data)
            elif fn.startswith("assets/"):
                zout.writestr(fn, data)
            elif fn.startswith("lib/"):
                zout.writestr(fn, data)
            else:
                zout.writestr("root/" + fn, data)
                
    # 9. Build AAB using bundletool
    print("8. Building AAB bundle via bundletool...")
    out_aab = os.path.join(build_tmp, "English_Kids.aab")
    subprocess.run([
        "java", "-jar", bundletool,
        "build-bundle",
        "--modules=" + base_zip,
        "--output=" + out_aab,
        "--overwrite"
    ], check=True)
    
    # 10. Sign AAB using jarsigner with release.keystore
    print("9. Signing AAB with jarsigner and release.keystore...")
    subprocess.run([
        "jarsigner",
        "-sigalg", "SHA256withRSA",
        "-digestalg", "SHA-256",
        "-keystore", keystore,
        "-storepass", "englishkids123",
        "-keypass", "englishkids123",
        out_aab, "englishkids"
    ], check=True)
    
    # 11. Validate bundle
    print("10. Validating bundle integrity...")
    subprocess.run(["java", "-jar", bundletool, "validate", "--bundle=" + out_aab], check=True)
    
    # 12. Copy finalized files to root and public
    shutil.copy2(signed_apk, os.path.join(work_dir, "English_Kids.apk"))
    shutil.copy2(signed_apk, os.path.join(work_dir, "public", "English_Kids.apk"))
    if os.path.exists(dist_dir):
        shutil.copy2(signed_apk, os.path.join(dist_dir, "English_Kids.apk"))
        
    shutil.copy2(out_aab, os.path.join(work_dir, "English_Kids.aab"))
    shutil.copy2(out_aab, os.path.join(work_dir, "public", "English_Kids.aab"))
    if os.path.exists(dist_dir):
        shutil.copy2(out_aab, os.path.join(dist_dir, "English_Kids.aab"))
        
    print("=== SUCCESS: English_Kids.aab and English_Kids.apk built and signed successfully! ===")

if __name__ == "__main__":
    main()
