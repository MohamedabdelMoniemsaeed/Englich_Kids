import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:englich_kids/services/tts_service.dart';
import 'package:provider/provider.dart';
import 'package:englich_kids/theme/provider.dart';

class AiChatScreen extends StatefulWidget {
  const AiChatScreen({super.key});

  @override
  State<AiChatScreen> createState() => _AiChatScreenState();
}

class _AiChatScreenState extends State<AiChatScreen> {
  final stt.SpeechToText _speech = stt.SpeechToText();
  bool _isListening = false;
  String _text = 'Hold the mic to start talking';
  String _aiResponse = '';
  String _imageUrl = '';
  
  // 🔑 قائمة المفاتيح لضمان عدم توقف الشات (API Key Rotation)
  // يمكنك إضافة المزيد من المفاتيح هنا من حسابات مختلفة
  final List<String> _apiKeys = [
    'AQ.Ab8RN6KUNZmV_P3r2iQTCzgzQD7LczIS497upUfPVNsV_sGtBg', // المفتاح الأول
    'AQ.Ab8RN6J5A6d4PxmWh6hWvN_7yWIfT5r5417LBWPrCN6Wa3l0zA',
    'AQ.Ab8RN6I3UTL28YOveedfv8--m5oR3u5iikqXos0cszShJQzldw',
  ];
  int _currentKeyIndex = 0;

  // 🔑 DeepSeek API Keys
  final List<String> _deepSeekKeys = [
    '',
    '',
    '',
  ];
  int _currentDeepSeekKeyIndex = 0;
  final String _deepSeekUrl = 'https://api.deepseek.com/chat/completions';

  late GenerativeModel _model;
  late ChatSession _chat;

  @override
  void initState() {
    super.initState();
    _initAi();
  }

  void _initAi() {
    _model = GenerativeModel(
      model: 'gemini-3.5-flash', // الموديل المتاح والمجاني في 2026
      apiKey: _apiKeys[_currentKeyIndex],
      generationConfig: GenerationConfig(
        temperature: 0.7,
        maxOutputTokens: 1000,
      ),
      systemInstruction: Content.system(
        'You are a joyful AI teacher for children (ages 3-7). '
        'STRICT RULE: Always respond in ENGLISH, even if the child speaks in Arabic. '
        'Tell a short story or explanation in 3 to 5 clear sentences. '
        'End with [IMAGE: keyword] with a simple English noun.'
      ),
    );
    _chat = _model.startChat();
  }

  // دالة للتبديل للمفتاح التالي عند انتهاء الليمت
  void _switchToNextKey() {
    if (_apiKeys.length > 1) {
      _currentKeyIndex = (_currentKeyIndex + 1) % _apiKeys.length;
      _initAi(); // إعادة تهيئة الموديل بالمفتاح الجديد
    }
  }

  void _startListening() async {
    if (_aiResponse == '...') return;
    bool available = await _speech.initialize();
    if (available) {
      setState(() {
        _isListening = true;
        _text = 'Listening...';
      });
      _speech.listen(onResult: (val) => setState(() => _text = val.recognizedWords));
    }
  }

  void _stopListening() {
    if (!_isListening) return;
    setState(() => _isListening = false);
    _speech.stop();
    Future.delayed(const Duration(milliseconds: 700), () {
      if (_text.isNotEmpty && _text != 'Listening...') {
        _getResponseFromAi(_text);
      }
    });
  }

  Future<void> _getResponseFromAi(String userMessage) async {
    if (userMessage.isEmpty || _aiResponse == '...') return;
    
    setState(() {
      _aiResponse = '...';
      _imageUrl = '';
    });

    try {
      final response = await _chat.sendMessage(Content.text(userMessage));
      String fullText = response.text ?? '';
      
      if (fullText.isEmpty) throw 'Empty response';

      _processAiResponse(fullText);

    } catch (e) {
      String err = e.toString().toLowerCase();
      // إذا كان الخطأ بسبب الليمت، نحاول التبديل للمفتاح التالي
      if (err.contains('quota') || err.contains('rate limit')) {
        if (_apiKeys.length > 1 && _currentKeyIndex < _apiKeys.length - 1) {
          _switchToNextKey();
          _getResponseFromAi(userMessage); // إعادة المحاولة بالمفتاح الجديد
        } else {
          // إذا انتهت كل مفاتيح Gemini، نجرب DeepSeek
          _getResponseFromDeepSeek(userMessage);
        }
      } else {
        // أي خطأ آخر، نحاول DeepSeek لضمان العمل
        _getResponseFromDeepSeek(userMessage);
      }
    }
  }

  Future<void> _getResponseFromDeepSeek(String userMessage) async {
    try {
      final response = await http.post(
        Uri.parse(_deepSeekUrl),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${_deepSeekKeys[_currentDeepSeekKeyIndex]}',
        },
        body: jsonEncode({
          'model': 'deepseek-chat',
          'messages': [
            {
              'role': 'system',
              'content': 'You are a joyful AI teacher for children (ages 3-7). '
                         'STRICT RULE: Always respond in ENGLISH, even if the child speaks in Arabic. '
                         'Tell a short story or explanation in 3 to 5 clear sentences. '
                         'End with [IMAGE: keyword] with a simple English noun.'
            },
            {'role': 'user', 'content': userMessage}
          ],
          'stream': false
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(utf8.decode(response.bodyBytes));
        String fullText = data['choices'][0]['message']['content'] ?? '';
        _processAiResponse(fullText);
      } else if (response.statusCode == 429) {
        // إذا كان الخطأ بسبب الليمت، نحاول التبديل للمفتاح التالي
        if (_currentDeepSeekKeyIndex < _deepSeekKeys.length - 1) {
          _currentDeepSeekKeyIndex++;
          _getResponseFromDeepSeek(userMessage);
        } else {
          setState(() => _aiResponse = 'لقد انتهى الحد المسموح به لليوم. حاول مرة أخرى غداً.\nDaily limit reached.');
        }
      } else {
        setState(() => _aiResponse = 'لقد انتهى الحد المسموح به لليوم. حاول مرة أخرى غداً.\nDaily limit reached.');
      }
    } catch (e) {
      setState(() => _aiResponse = 'Error: $e');
    }
  }

  void _processAiResponse(String fullText) {
    String cleanedText = fullText;
    String keyword = 'kids';
    final regExp = RegExp(r'\[IMAGE:\s*(.*?)\]');
    final match = regExp.firstMatch(fullText);
    
    if (match != null) {
      keyword = match.group(1)?.trim().replaceAll(' ', ',') ?? 'kids';
      cleanedText = fullText.replaceAll(regExp, '').trim();
    }

    setState(() {
      _aiResponse = cleanedText;
      _imageUrl = 'https://loremflickr.com/600/400/$keyword,cartoon/all';
    });
    
    TtsService.speak(cleanedText, language: 'en-US');
  }

  @override
  Widget build(BuildContext context) {
    final mode = Provider.of<Mode>(context);
    final accentColor = Theme.of(context).dividerColor;

    return Scaffold(
      appBar: AppBar(title: const Text('AI Friend')),
      body: Stack(
        children: [
          Positioned.fill(
            child: mode.backgroundImage.isNotEmpty
                ? Image.asset(mode.backgroundImage, fit: BoxFit.cover)
                : Container(color: Colors.orange.shade300),
          ),
          Positioned.fill(
            child: Container(
              color: Colors.white.withValues(alpha: 0.85),
            ),
          ),
          Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    children: [
                      Image.asset('assets/images/AI Friend.png', height: 100),
                      const SizedBox(height: 20),
                      Align(
                        alignment: Alignment.centerRight,
                        child: Container(
                          padding: const EdgeInsets.all(15),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)],
                          ),
                          child: Text(_text, style: const TextStyle(fontSize: 16)),
                        ),
                      ),
                      const SizedBox(height: 20),
                      if (_aiResponse.isNotEmpty)
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Container(
                            constraints: const BoxConstraints(minHeight: 100),
                            padding: const EdgeInsets.all(15),
                            decoration: BoxDecoration(
                              color: accentColor.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: accentColor.withOpacity(0.3)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                if (_imageUrl.isNotEmpty && _aiResponse != '...')
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(15),
                                    child: Image.network(_imageUrl, height: 200, width: double.infinity, fit: BoxFit.cover),
                                  ),
                                const SizedBox(height: 10),
                                if (_aiResponse == '...')
                                  const CircularProgressIndicator()
                                else
                                  Text(
                                    _aiResponse,
                                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600, height: 1.5),
                                    softWrap: true,
                                    textDirection: RegExp(r'[\u0600-\u06FF]').hasMatch(_aiResponse) 
                                        ? TextDirection.rtl : TextDirection.ltr,
                                  ),
                              ],
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.all(30),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
                ),
                child: GestureDetector(
                  onTap: _aiResponse == '...'
                      ? null
                      : () {
                          if (_isListening) {
                            _stopListening();
                          } else {
                            _startListening();
                          }
                        },
                  child: CircleAvatar(
                    radius: 40,
                    backgroundColor: _isListening ? Colors.red : accentColor,
                    child: Icon(_isListening ? Icons.mic : Icons.mic_none, color: Colors.white, size: 40),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
