import 'package:flutter/material.dart';
import '../services/tts_service.dart';

class ListeningGameScreen extends StatefulWidget {
  const ListeningGameScreen({super.key});

  @override
  State<ListeningGameScreen> createState() => _ListeningGameScreenState();
}

class _ListeningGameScreenState extends State<ListeningGameScreen> {
  final List<Map<String, dynamic>> _pool = [
    {'word': 'Elephant', 'correct': '🐘', 'options': ['🐘', '🦁', '🦒', '🐵']},
    {'word': 'Banana', 'correct': '🍌', 'options': ['🍎', '🍌', '🍓', '🍇']},
    {'word': 'Carrot', 'correct': '🥕', 'options': ['🥦', '🥕', '🍅', '🌽']},
    {'word': 'Sunny', 'correct': '☀️', 'options': ['🌧️', '☀️', '❄️', '🌈']},
    {'word': 'Rainbow', 'correct': '🌈', 'options': ['☁️', '💨', '🌈', '☀️']},
    {'word': 'Winter', 'correct': '⛄', 'options': ['🌸', '🏖️', '🍂', '⛄']},
    {'word': 'Airplane', 'correct': '✈️', 'options': ['🚗', '✈️', '🚆', '🚢']},
    {'word': 'Doctor', 'correct': '👨‍⚕️', 'options': ['👨‍⚕️', '👩‍🏫', '👨‍🚒', '👮‍♂️']},
  ];

  int _index = 0;
  int _score = 0;
  String? _selected;

  @override
  void initState() {
    super.initState();
    _playAudio();
  }

  void _playAudio() {
    TtsService.speak(_pool[_index]['word']);
  }

  void _choose(String emoji) {
    if (_selected != null) return;
    setState(() {
      _selected = emoji;
      if (emoji == _pool[_index]['correct']) {
        _score += 10;
        TtsService.speak("Correct! ${_pool[_index]['word']}");
      } else {
        TtsService.speak("Try again! Find the ${_pool[_index]['word']}");
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final item = _pool[_index];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text('Listen & Tap 🎧 (Score: $_score)', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
        backgroundColor: const Color(0xFFF43F5E),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('اسمع الصوت واختر الصورة الصحيحة:', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
              const SizedBox(height: 20),

              // Audio speaker button
              GestureDetector(
                onTap: _playAudio,
                child: Container(
                  width: 90,
                  height: 90,
                  decoration: const BoxDecoration(
                    color: Color(0xFFF43F5E),
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(color: Colors.redAccent, blurRadius: 10, offset: Offset(0, 4)),
                    ],
                  ),
                  child: const Icon(Icons.volume_up_rounded, size: 50, color: Colors.white),
                ),
              ),
              const SizedBox(height: 36),

              // Options Grid
              GridView.count(
                shrinkWrap: true,
                crossAxisCount: 2,
                crossAxisSpacing: 14,
                mainAxisSpacing: 14,
                children: (item['options'] as List<String>).map((opt) {
                  bool isChosen = _selected == opt;
                  bool isCorrect = opt == item['correct'];

                  Color borderCol = Colors.grey.shade300;
                  if (_selected != null) {
                    if (isCorrect) borderCol = Colors.green;
                    else if (isChosen) borderCol = Colors.red;
                  }

                  return InkWell(
                    onTap: () => _choose(opt),
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(22),
                        border: Border.all(color: borderCol, width: 3),
                        boxShadow: [
                          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 6),
                        ],
                      ),
                      child: Center(
                        child: Text(opt, style: const TextStyle(fontSize: 55)),
                      ),
                    ),
                  );
                }).toList(),
              ),

              const SizedBox(height: 24),
              if (_selected != null)
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFF43F5E),
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  onPressed: () {
                    setState(() {
                      _index = (_index + 1) % _pool.length;
                      _selected = null;
                      _playAudio();
                    });
                  },
                  child: const Text('Next Challenge ➜', style: TextStyle(color: Colors.white, fontSize: 16)),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
