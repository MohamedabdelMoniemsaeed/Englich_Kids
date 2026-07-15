# Flutter Wrapper
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }

# Google Generative AI (Gemini)
-keep class com.google.ai.client.generativeai.** { *; }

# Speech to Text
-keep class com.csdcorp.speech_to_text.** { *; }

# Fix for Play Core missing classes
-dontwarn com.google.android.play.core.**
