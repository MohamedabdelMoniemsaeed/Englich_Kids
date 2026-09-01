import 'dart:io' show Platform;
import 'package:flutter/foundation.dart';
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

      if (!kIsWeb && Platform.isIOS) {
        await _tts.setIosAudioCategory(
          IosTextToSpeechAudioCategory.playback,
          [
            IosTextToSpeechAudioCategoryOptions.defaultToSpeaker,
            IosTextToSpeechAudioCategoryOptions.allowBluetooth,
          ],
        );
      }

      await _tts.awaitSpeakCompletion(true);
      _isInitialized = true;
    } catch (e) {
      debugPrint("TTS init error: $e");
    }
  }

  static Future<void> speak(String text, {double? rate}) async {
    try {
      await init();
      await _tts.stop();

      final cleanText = text
          .replaceAll(RegExp(r'\[IMAGE:.*?\]'), '')
          .replaceAll(RegExp(r'[\u0600-\u06FF]'), '') // remove Arabic parts for clear English speech
          .trim();

      if (cleanText.isEmpty) return;

      if (rate != null) {
        await _tts.setSpeechRate(rate);
      }
      await _tts.speak(cleanText);
    } catch (e) {
      debugPrint("TTS speak error: $e");
    }
  }

  static Future<void> stop() async {
    try {
      await _tts.stop();
    } catch (_) {}
  }
}

