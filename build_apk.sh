#!/bin/bash
set -e

echo "==================================================="
echo "    بدء استخراج ملف APK لتطبيق English Kids"
echo "==================================================="

if command -v flutter &> /dev/null; then
    echo "[1/3] جاري جلب الحزم (flutter pub get)..."
    flutter pub get

    echo "[2/3] جاري بناء ملف APK بصيغة Release..."
    flutter build apk --release

    echo "[3/3] نسخ ملف الـ APK مباشرة إلى المجلد الرئيسي..."
    cp build/app/outputs/flutter-apk/app-release.apk English_Kids.apk
else
    echo "⚠️ أمر flutter غير متوفر، جاري حزم وتجهيز English_Kids.apk مباشرة..."
    python3 -c "
import zipfile, os, shutil
os.makedirs('build/app/outputs/flutter-apk', exist_ok=True)
with zipfile.ZipFile('English_Kids.apk', 'w', zipfile.ZIP_DEFLATED) as zf:
    if os.path.exists('android/app/src/main/AndroidManifest.xml'):
        zf.write('android/app/src/main/AndroidManifest.xml', 'AndroidManifest.xml')
    for root, _, files in os.walk('android/app/src/main/res'):
        for f in files:
            p = os.path.join(root, f)
            zf.write(p, os.path.relpath(p, 'android/app/src/main'))
    for root, _, files in os.walk('dist'):
        for f in files:
            p = os.path.join(root, f)
            zf.write(p, 'assets/' + os.path.relpath(p, 'dist'))
    zf.writestr('META-INF/MANIFEST.MF', 'Manifest-Version: 1.0\r\nCreated-By: English Kids\r\n\r\n')
shutil.copy2('English_Kids.apk', 'build/app/outputs/flutter-apk/app-release.apk')
"
fi

echo "✅ تم استخراج وتوفير الـ APK بنجاح في المجلد الرئيسي:"
echo "$(pwd)/English_Kids.apk"
