# دليل تشغيل وبناء تطبيق English Kids على أجهزة iPhone و iOS (Flutter)

تم إنشاء وتجهيز بنية ملفات **iOS / Xcode** بالكامل لتطبيق Flutter لدعم أجهزة iPhone و iPad.

---

## 📁 محتويات مجلد iOS:
- `ios/Podfile`: تم إعداده مع إعدادات CocoaPods و iOS Deployment Target (iOS 13.0+).
- `ios/Runner/Info.plist`: يحتوي على اسم التطبيق `English Kids` والأذونات المناسبة مثل الصوتيات والنطق `NSSpeechRecognitionUsageDescription`.
- `ios/Runner/AppDelegate.swift`: مُهيأ لتسجيل ملحقات Flutter تلقائياً (Plugins).
- `ios/Runner.xcodeproj`: مشروع Xcode جاهز للفتح في بيئة macOS.
- `ios/Runner.xcworkspace`: مساحة عمل Xcode المتكاملة مع Pods.

---

## 🛠️ خطوات استخراج التطبيق وتثبيته على iPhone:

### 1. المتطلبات:
- جهاز كمبيوتر يعمل بنظام **macOS** (MacBook أو Mac Mini أو iMac).
- برنامج **Xcode** (متاح مجاناً في App Store).
- كابل توصيل الـ iPhone أو حساب Apple Developer.

### 2. تثبيت الحزم والمكتبات:
من موجه الأوامر في مجلد المشروع الرئيسي:
```bash
flutter pub get
cd ios
pod install
cd ..
```

### 3. تشغيل التطبيق على محاكي iPhone (Simulator):
```bash
open -a Simulator
flutter run -d iPhone
```

### 4. استخراج وبناء ملف IPA أو التثبيت على جهاز iPhone حقيقي:
- **الطريقة الأولى (عبر السطر البرمجي):**
  ```bash
  flutter build ipa
  ```
  سيتم إنشاء حزمة التطبيق داخل: `build/ios/archive/Runner.xcarchive` أو `build/ios/ipa`

- **الطريقة الثانية (عبر Xcode مباشرة - أسهل للتجربة):**
  1. افتح المشروع في Xcode:
     ```bash
     open ios/Runner.xcworkspace
     ```
  2. اختر اسم فريقك (Signing Team) في تبويب `Signing & Capabilities`.
  3. قم بتوصيل هاتف الـ iPhone الخاص بك واختره من شريط الأجهزة العلوي.
  4. اضغط على زر **Play (Run)** وسيقوم Xcode بتثبيت التطبيق مباشرة على جهازك!
