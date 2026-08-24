import 'package:flutter/material.dart';
import '../services/tts_service.dart';

class SpellingBeeScreen extends StatefulWidget {
  const SpellingBeeScreen({super.key});

  @override
  State<SpellingBeeScreen> createState() => _SpellingBeeScreenState();
}

class _SpellingBeeScreenState extends State<SpellingBeeScreen> {
  final List<Map<String, String>> words = [
    {'word': 'CAT', 'emoji': '🐱', 'ar': 'قطة', 'hint': 'Says Meow!'},
    {'word': 'DOG', 'emoji': '🐶', 'ar': 'كلب', 'hint': 'Says Woof!'},
    {'word': 'SUN', 'emoji': '☀️', 'ar': 'شمس / مشمس', 'hint': 'Bright and warm in summer'},
    {'word': 'RAIN', 'emoji': '🌧️', 'ar': 'مطر', 'hint': 'Water drops from clouds'},
    {'word': 'CORN', 'emoji': '🌽', 'ar': 'ذرة صفراء', 'hint': 'Sweet yellow vegetable'},
    {'word': 'CAR', 'emoji': '🚗', 'ar': 'سيارة', 'hint': 'Beep beep!'},
    {'word': 'COLD', 'emoji': '🥶', 'ar': 'بارد', 'hint': 'Winter weather'},
    {'word': 'STAR', 'emoji': '⭐', 'ar': 'نجمة', 'hint': 'Shines high'},
    {'word': 'FISH', 'emoji': '🐟', 'ar': 'سمكة', 'hint': 'Swims in water'},
  ];

  int currentIndex = 0;
  List<String> userLetters = [];
  List<String> scrambled = [];
  bool isCompleted = false;

  @override
  void initState() {
    super.initState();
    _loadWord();
  }

  void _loadWord() {
    setState(() {
      userLetters = [];
      isCompleted = false;
      String word = words[currentIndex]['word']!;
      scrambled = word.split('')..shuffle();
    });
    TtsService.speak("Spell ${words[currentIndex]['word']}");
  }

  void _addLetter(String letter) {
    if (isCompleted) return;
    TtsService.speak(letter);

    setState(() {
      userLetters.add(letter);
      String target = words[currentIndex]['word']!;
      if (userLetters.join('') == target) {
        isCompleted = true;
        TtsService.speak("Super! $target");
      } else if (userLetters.length == target.length) {
        Future.delayed(const Duration(milliseconds: 600), () {
          setState(() {
            userLetters.clear();
          });
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final current = words[currentIndex];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Spelling Bee 🔤', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF10B981),
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
              Text(current['emoji']!, style: const TextStyle(fontSize: 85)),
              const SizedBox(height: 6),
              Text(current['ar']!, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
              Text('💡 ${current['hint']!}', style: const TextStyle(fontSize: 13, color: Color(0xFFD97706), fontWeight: FontWeight.w600)),
              const SizedBox(height: 28),

              // Letter Slots
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(current['word']!.length, (index) {
                  String char = index < userLetters.length ? userLetters[index] : '';
                  return Container(
                    margin: const EdgeInsets.all(6),
                    width: 58,
                    height: 64,
                    decoration: BoxDecoration(
                      color: char.isNotEmpty ? const Color(0xFFD1FAE5) : Colors.white,
                      border: Border.all(
                        color: char.isNotEmpty ? const Color(0xFF10B981) : Colors.grey.shade300,
                        width: 2.5,
                      ),
                      borderRadius: BorderRadius.circular(18),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 4),
                      ],
                    ),
                    child: Center(
                      child: Text(
                        char,
                        style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w900, color: Color(0xFF065F46)),
                      ),
                    ),
                  );
                }),
              ),
              const SizedBox(height: 32),

              // Scrambled Letter Bubbles
              Wrap(
                spacing: 12,
                children: scrambled.map((char) {
                  return ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF10B981),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                      padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 14),
                      elevation: 4,
                    ),
                    onPressed: () => _addLetter(char),
                    child: Text(char, style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: Colors.white)),
                  );
                }).toList(),
              ),

              const SizedBox(height: 36),
              if (isCompleted)
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF059669),
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    elevation: 5,
                  ),
                  onPressed: () {
                    setState(() {
                      currentIndex = (currentIndex + 1) % words.length;
                      _loadWord();
                    });
                  },
                  icon: const Icon(Icons.arrow_forward_rounded, color: Colors.white),
                  label: const Text('Next Word / الكلمة التالية', style: TextStyle(fontSize: 16, color: Colors.white, fontWeight: FontWeight.bold)),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
