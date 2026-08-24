import 'package:flutter_tts/flutter_tts.dart';

class TtsService {
  static final FlutterTts _tts = FlutterTts();
  static bool _isInitialized = false;

  static Future<void> init() async {
    if (_isInitialized) return;
    try {
      await _tts.setLanguage("en-US");
      await _tts.setSpeechRate(0.42); // Slow, clear rate for kids
      await _tts.setPitch(1.1);       // Friendly kid tone
      await _tts.setVolume(1.0);
      _isInitialized = true;
    } catch (e) {
      // Fallback
    }
  }

  static Future<void> speak(String text, {double? rate}) async {
    await init();
    await _tts.stop();
    if (rate != null) {
      await _tts.setSpeechRate(rate);
    }
    await _tts.speak(text);
  }

  static Future<void> stop() async {
    await _tts.stop();
  }
}
