#!/usr/bin/env python3
import os
import sys
import subprocess
import tempfile
import shutil
import zipfile

def main():
    print("=== Official Android Build & Signing Pipeline ===")
    work_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    src_apk = os.path.join(work_dir, "English_Kids.apk")
    dist_dir = os.path.join(work_dir, "dist")
    keystore = os.path.join(work_dir, "release.keystore")

    # 1. Ensure production dist is built
    if not os.path.exists(os.path.join(dist_dir, "index.html")):
        print("Building dist first...")
        subprocess.run(["npm", "run", "build"], cwd=work_dir, check=True)

    with tempfile.TemporaryDirectory() as tmpdir:
        # 2. Extract core components (AndroidManifest.xml, classes.dex, resources.arsc, res/)
        extract_dir = os.path.join(tmpdir, "extracted")
        os.makedirs(extract_dir, exist_ok=True)

        print("1. Extracting APK binary assets...")
        with zipfile.ZipFile(src_apk, "r") as zin:
            for item in zin.infolist():
                if item.filename.startswith("META-INF/"):
                    continue
                if item.filename.startswith("assets/www/"):
                    continue
                zin.extract(item, extract_dir)

        # 3. Copy dist/ into assets/www/
        print("2. Copying latest dist web app to assets/www/...")
        www_dir = os.path.join(extract_dir, "assets", "www")
        os.makedirs(www_dir, exist_ok=True)

        for root, dirs, files in os.walk(dist_dir):
            for file in files:
                if file.endswith(".apk") or file.endswith(".zip") or file.endswith(".cjs") or file.endswith(".map"):
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, dist_dir)
                target_path = os.path.join(www_dir, rel_path)
                os.makedirs(os.path.dirname(target_path), exist_ok=True)
                shutil.copy2(full_path, target_path)

        # 4. Create unsigned APK zip archive
        print("3. Building unsigned ZIP archive...")
        unsigned_apk = os.path.join(tmpdir, "unsigned.apk")
        with zipfile.ZipFile(unsigned_apk, "w") as zout:
            for root, dirs, files in os.walk(extract_dir):
                for file in sorted(files):
                    abs_f = os.path.join(root, file)
                    rel_f = os.path.relpath(abs_f, extract_dir).replace("\\", "/")
                    is_stored = (rel_f == "resources.arsc" or rel_f.endswith(".png") or rel_f.endswith(".jpg"))
                    compress_type = zipfile.ZIP_STORED if is_stored else zipfile.ZIP_DEFLATED
                    zout.write(abs_f, rel_f, compress_type=compress_type)

        # 5. Run official zipalign
        print("4. Running official zipalign (4-byte alignment)...")
        aligned_apk = os.path.join(tmpdir, "aligned.apk")
        subprocess.run(["zipalign", "-f", "-p", "4", unsigned_apk, aligned_apk], check=True)

        # Verify zipalign
        subprocess.run(["zipalign", "-c", "4", aligned_apk], check=True)
        print("   -> zipalign verification passed!")

        # 6. Ensure keystore exists
        if not os.path.exists(keystore):
            print("5. Generating permanent release keystore...")
            subprocess.run([
                "keytool", "-genkeypair", "-v",
                "-keystore", keystore,
                "-alias", "englishkids",
                "-keyalg", "RSA",
                "-keysize", "2048",
                "-validity", "10000",
                "-storepass", "englishkids123",
                "-keypass", "englishkids123",
                "-dname", "CN=EnglishKids, OU=Education, O=Kids, L=Global, ST=Global, C=US"
            ], check=True)

        # 7. Run official apksigner
        print("6. Signing APK with official Google apksigner (v1, v2, v3)...")
        final_apk = os.path.join(work_dir, "English_Kids.apk")
        subprocess.run([
            "apksigner", "sign",
            "--ks", keystore,
            "--ks-pass", "pass:englishkids123",
            "--ks-key-alias", "englishkids",
            "--key-pass", "pass:englishkids123",
            "--out", final_apk,
            aligned_apk
        ], check=True)

        # 8. Verify with apksigner
        print("7. Verifying APK with official apksigner...")
        res = subprocess.run([
            "apksigner", "verify", "--verbose", final_apk
        ], capture_output=True, text=True, check=True)
        print(res.stdout)

        # 9. Sync to all target paths
        shutil.copy2(final_apk, os.path.join(work_dir, "app-release.apk"))
        shutil.copy2(final_apk, os.path.join(work_dir, "public", "English_Kids.apk"))
        shutil.copy2(final_apk, os.path.join(work_dir, "public", "app-release.apk"))
        shutil.copy2(final_apk, os.path.join(dist_dir, "English_Kids.apk"))
        shutil.copy2(final_apk, os.path.join(dist_dir, "app-release.apk"))

        size_mb = os.path.getsize(final_apk) / (1024 * 1024)
        print(f"🎉 SUCCESS! APK is 100% Verified and Signed by official Google tools: {size_mb:.2f} MB")

if __name__ == "__main__":
    main()
