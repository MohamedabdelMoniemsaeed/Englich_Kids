import 'package:flutter/material.dart';
import '../services/tts_service.dart';

class MemoryGameScreen extends StatefulWidget {
  const MemoryGameScreen({super.key});

  @override
  State<MemoryGameScreen> createState() => _MemoryGameScreenState();
}

class _MemoryGameScreenState extends State<MemoryGameScreen> {
  final List<Map<String, String>> _deck = [
    {'name': 'Cat', 'emoji': '🐱'},
    {'name': 'Dog', 'emoji': '🐶'},
    {'name': 'Lion', 'emoji': '🦁'},
    {'name': 'Apple', 'emoji': '🍎'},
    {'name': 'Star', 'emoji': '⭐'},
    {'name': 'Car', 'emoji': '🚗'},
    {'name': 'Cat', 'emoji': '🐱'},
    {'name': 'Dog', 'emoji': '🐶'},
    {'name': 'Lion', 'emoji': '🦁'},
    {'name': 'Apple', 'emoji': '🍎'},
    {'name': 'Star', 'emoji': '⭐'},
    {'name': 'Car', 'emoji': '🚗'},
  ];

  late List<bool> _flipped;
  late List<bool> _matched;
  int? _firstIndex;
  bool _busy = false;
  int _moves = 0;

  @override
  void initState() {
    super.initState();
    _resetGame();
  }

  void _resetGame() {
    setState(() {
      _deck.shuffle();
      _flipped = List.generate(_deck.length, (_) => false);
      _matched = List.generate(_deck.length, (_) => false);
      _firstIndex = null;
      _busy = false;
      _moves = 0;
    });
  }

  void _cardTapped(int index) {
    if (_busy || _flipped[index] || _matched[index]) return;

    setState(() {
      _flipped[index] = true;
    });

    if (_firstIndex == null) {
      _firstIndex = index;
    } else {
      _moves++;
      _busy = true;
      if (_deck[_firstIndex!]['emoji'] == _deck[index]['emoji']) {
        // Matched!
        TtsService.speak(_deck[index]['name']!);
        setState(() {
          _matched[_firstIndex!] = true;
          _matched[index] = true;
          _firstIndex = null;
          _busy = false;
        });
      } else {
        // Not matched
        Future.delayed(const Duration(milliseconds: 700), () {
          setState(() {
            _flipped[_firstIndex!] = false;
            _flipped[index] = false;
            _firstIndex = null;
            _busy = false;
          });
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    bool allMatched = _matched.every((m) => m);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text('Memory Match 🧠 (Moves: $_moves)', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
        backgroundColor: const Color(0xFF8B5CF6),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(icon: const Icon(Icons.refresh_rounded, color: Colors.white), onPressed: _resetGame),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            if (allMatched)
              Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.amber.shade100,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.amber),
                ),
                child: const Text('🎉 مبروك! لقد قمت بمطابقة جميع البطاقات بنجاح! ⭐', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black87)),
              ),
            Expanded(
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                ),
                itemCount: _deck.length,
                itemBuilder: (context, index) {
                  bool show = _flipped[index] || _matched[index];

                  return GestureDetector(
                    onTap: () => _cardTapped(index),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      decoration: BoxDecoration(
                        color: show ? Colors.white : const Color(0xFF8B5CF6),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: _matched[index] ? const Color(0xFF10B981) : const Color(0xFF7C3AED),
                          width: _matched[index] ? 3 : 2,
                        ),
                        boxShadow: [
                          BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 6, offset: const Offset(0, 3)),
                        ],
                      ),
                      child: Center(
                        child: Text(
                          show ? _deck[index]['emoji']! : '❓',
                          style: const TextStyle(fontSize: 40),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
