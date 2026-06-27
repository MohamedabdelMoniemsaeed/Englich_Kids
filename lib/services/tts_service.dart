import 'package:flutter_tts/flutter_tts.dart';

class TtsService {
  static final FlutterTts _flutterTts = FlutterTts();

  static Future<void> initialize() async {
    await _flutterTts.setLanguage('en-US');
    await _flutterTts.setSpeechRate(0.35);
    await _flutterTts.setPitch(1.0);
  }

  static Future<void> speak(
    String text, {
    String language = 'en-US',
    double speechRate = 0.35,
  }) async {
    await _flutterTts.stop();
    await _flutterTts.setLanguage(language);
    await _flutterTts.setSpeechRate(speechRate);
    await _flutterTts.setPitch(1.0);
    await _flutterTts.speak(text);
  }

  static Future<void> speakSequence(
    List<String> texts, {
    String language = 'en-US',
    double speechRate = 0.3,
  }) async {
    await _flutterTts.stop();
    await _flutterTts.setLanguage(language);
    await _flutterTts.setSpeechRate(speechRate);
    await _flutterTts.setPitch(1.0);

    for (final text in texts) {
      await _flutterTts.speak(text);
      await Future.delayed(const Duration(milliseconds: 400));
    }
  }

  static Future<void> stop() async {
    await _flutterTts.stop();
  }
}
