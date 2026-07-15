import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:englich_kids/services/tts_service.dart';
import 'package:provider/provider.dart';
import 'package:englich_kids/theme/porvider.dart';

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
  
  // ⚠️ IMPORTANT: Get a key starting with "AIza" from https://aistudio.google.com/
  final String _apiKey = 'YOUR_GEMINI_API_KEY';
  late GenerativeModel _model;
  late ChatSession _chat;

  @override
  void initState() {
    super.initState();
    _initAi();
  }

  void _initAi() {
    _model = GenerativeModel(
      model: 'gemini-3.5-flash',
      apiKey: _apiKey,
      generationConfig: GenerationConfig(
        temperature: 0.8,
        maxOutputTokens: 1000,
      ),
      systemInstruction: Content.system(
        'You are a joyful and expert AI teacher for children (ages 3-7). '
        'Rules: '
        '1. Detect the child\'s language (Arabic or English) and respond in the EXACT same language. '
        '2. Your response MUST be a short paragraph of 3 to 5 sentences. '
        '3. Use very simple, clear language. Tell a mini-story or give a fun explanation. '
        '4. At the VERY END of your response, you MUST add a single English noun in this format: [IMAGE: keyword]. '
        '5. Choose a concrete noun (e.g., dog, tree, astronaut, cake). '
      ),
    );
    _chat = _model.startChat();
  }

  void _startListening() async {
    if (_aiResponse == '...') return; // Prevent listening while AI is thinking

    bool available = await _speech.initialize(
      onStatus: (status) {
        if ((status == 'done' || status == 'notListening') && _isListening) {
          _stopListening();
        }
      },
      onError: (e) => setState(() => _isListening = false),
    );
    if (available) {
      setState(() {
        _isListening = true;
        _text = 'Listening...';
      });
      _speech.listen(
        onResult: (val) => setState(() {
          _text = val.recognizedWords;
        }),
      );
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

  void _toggleListening() {
    if (_isListening) {
      _stopListening();
    } else {
      _startListening();
    }
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
      
      bool isArabic = RegExp(r'[\u0600-\u06FF]').hasMatch(cleanedText);
      await TtsService.speak(cleanedText, language: isArabic ? 'ar-SA' : 'en-US');

    } catch (e) {
      print('GEMINI DETAILED ERROR: $e');
      String errorMessage = 'Error: $e';
      
      // التحقق من انتهاء الليمت (Quota Exceeded)
      if (e.toString().toLowerCase().contains('quota') || 
          e.toString().toLowerCase().contains('rate limit')) {
        errorMessage = 'لقد انتهى الحد المسموح به لليوم. حاول مرة أخرى غداً.\n'
                       'Daily limit reached. Please try again tomorrow.';
      }

      setState(() {
        _aiResponse = errorMessage;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final mode = Provider.of<Mode>(context);
    final accentColor = Theme.of(context).dividerColor;

    return Scaffold(
      appBar: AppBar(title: const Text('AI Friend')),
      body: Stack(
        children: [
          Positioned.fill(child: Image.asset(mode.backgroundImage, fit: BoxFit.cover)),
          Positioned.fill(child: Container(color: Colors.white.withOpacity(0.85))),
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
                                    child: Image.network(
                                      _imageUrl,
                                      height: 200,
                                      width: double.infinity,
                                      fit: BoxFit.cover,
                                      loadingBuilder: (context, child, loadingProgress) {
                                        if (loadingProgress == null) return child;
                                        return Container(
                                          height: 200,
                                          color: Colors.grey[200],
                                          child: const Center(child: CircularProgressIndicator()),
                                        );
                                      },
                                      errorBuilder: (context, e, s) => const SizedBox.shrink(),
                                    ),
                                  ),
                                const SizedBox(height: 10),
                                if (_aiResponse == '...')
                                  const CircularProgressIndicator()
                                else
                                  Text(
                                    _aiResponse,
                                    style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w600,
                                      height: 1.5,
                                    ),
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
                  boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10)],
                ),
                child: GestureDetector(
                  onTap: _aiResponse == '...' ? null : _toggleListening,
                  child: Opacity(
                    opacity: _aiResponse == '...' ? 0.5 : 1.0,
                    child: CircleAvatar(
                      radius: 40,
                      backgroundColor: _isListening ? Colors.red : accentColor,
                      child: Icon(_isListening ? Icons.mic : Icons.mic_none, color: Colors.white, size: 40),
                    ),
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
