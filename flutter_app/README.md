# 📱 English Kids - Flutter (Dart) Project

تم بناء وتحويل تطبيق **English Kids** بالكامل إلى مشروع **Flutter (Dart)** منظم وجاهز للتشغيل مباشرة على **Android** و **iOS**.

---

## 📂 هيكلة مجلدات المشروع (Project Structure):

```text
flutter_app/
├── pubspec.yaml                        # ملف الحزم والاعتماديات
├── lib/
│   ├── main.dart                       # نقطة انطلاق التطبيق الرئيسية
│   ├── models/
│   │   └── app_data.dart               # بيانات الدروس (فواكه، مواصلات، حروف، أرقام، أجزاء الجسم)
│   ├── services/
│   │   └── tts_service.dart            # خدمة النطق الصوتي الإنجليزي (Text-To-Speech)
│   └── screens/
│       ├── home_screen.dart            # الشاشة الرئيسية والأقسام
│       ├── category_screen.dart        # شاشة عرض عناصر القسم والنطق
│       ├── games_hub_screen.dart       # مركز الألعاب التفاعلية
│       ├── spelling_bee_screen.dart    # لعبة تهجئة وتركيب الكلمات
│       ├── memory_game_screen.dart     # لعبة مطابقة كروت الذاكرة
│       ├── tracing_screen.dart         # سبورة رسم وتتبع الحروف باللمس
│       └── listening_game_screen.dart  # تحدي الاستماع السريع
└── README.md
```

---

## 🚀 كيفية تشغيل المشروع على جهازك:

### 1. المتطلبات:
- تثبيت [Flutter SDK](https://docs.flutter.dev/get-started/install).
- برنامج **VS Code** أو **Android Studio**.

### 2. خطوات التشغيل:
1. افتح مجلد `flutter_app` في الطرفية (Terminal) أو محرر الأكواد:
   ```bash
   cd flutter_app
   ```
2. تثبيت الحزم والمكتبات:
   ```bash
   flutter pub get
   ```
3. تشغيل التطبيق على الهاتف أو المحاكي (Emulator):
   ```bash
   flutter run
   ```

### 3. إنشاء ملف التثبيت للأندرويد (APK):
```bash
flutter build apk --release
```
ستجد ملف الـ APK الجاهز داخل المجلد:
`build/app/outputs/flutter-apk/app-release.apk`
