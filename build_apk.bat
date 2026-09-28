@echo off
chcp 65001 > nul
echo ===================================================
echo     بدء استخراج ملف APK لتطبيق English Kids
echo ===================================================
echo.

echo [1/4] جاري جلب وتحديث حزم المشروع (flutter pub get)...
call flutter pub get
if %ERRORLEVEL% neq 0 (
    echo [خطأ] فشل في جلب الحزم. تأكد من أن Flutter مضاف إلى مسارات النظام PATH.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/4] جاري بناء وتوليد ملف APK بصيغة Release...
call flutter build apk --release
if %ERRORLEVEL% neq 0 (
    echo [خطأ] حدث خطأ أثناء بناء ملف APK.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [3/4] جاري نسخ ملف الـ APK مباشرة إلى المجلد الرئيسي...
copy /Y "build\app\outputs\flutter-apk\app-release.apk" "English_Kids.apk" > nul

echo.
echo [4/4] تم استخراج ملف APK بنجاح!
echo ---------------------------------------------------
echo 📍 مسار الـ APK في المجلد الرئيسي مباشرة:
echo %~dp0English_Kids.apk
echo.
echo 📍 المسار الفرعي داخل مجلد البناء:
echo %~dp0build\app\outputs\flutter-apk\app-release.apk
echo ---------------------------------------------------
echo.
echo فتح المجلد الرئيسي وتحديد ملف الـ APK...
explorer /select,"%~dp0English_Kids.apk"
pause
