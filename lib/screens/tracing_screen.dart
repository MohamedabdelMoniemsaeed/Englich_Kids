import 'package:flutter/material.dart';
import '../services/tts_service.dart';

class TracingScreen extends StatefulWidget {
  const TracingScreen({super.key});

  @override
  State<TracingScreen> createState() => _TracingScreenState();
}

class _TracingScreenState extends State<TracingScreen> {
  final List<String> _chars = ['A', 'B', 'C', 'D', '1', '2', '3', '⭐', '❤️'];
  int _charIndex = 0;
  List<Offset?> _points = [];
  Color _currentColor = Colors.blue;

  @override
  Widget build(BuildContext context) {
    String currentChar = _chars[_charIndex];

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        title: const Text('Tracing Board ✍️', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF1E293B),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline_rounded, color: Color(0xFFF43F5E)),
            onPressed: () => setState(() => _points.clear()),
          ),
        ],
      ),
      body: Column(
        children: [
          // Letter Selector
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              children: List.generate(_chars.length, (i) {
                bool active = i == _charIndex;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(_chars[i], style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: active ? Colors.white : Colors.black)),
                    selected: active,
                    selectedColor: Colors.blue,
                    onSelected: (val) {
                      setState(() {
                        _charIndex = i;
                        _points.clear();
                      });
                      TtsService.speak(_chars[i]);
                    },
                  ),
                );
              }),
            ),
          ),

          // Canvas Area
          Expanded(
            child: Center(
              child: Container(
                margin: const EdgeInsets.all(16),
                width: 320,
                height: 320,
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.blue.withOpacity(0.5), width: 3),
                ),
                child: Stack(
                  children: [
                    // Stencil Background
                    Center(
                      child: Text(
                        currentChar,
                        style: TextStyle(
                          fontSize: 180,
                          fontWeight: FontWeight.w900,
                          color: Colors.white.withOpacity(0.12),
                        ),
                      ),
                    ),
                    // Drawing Gesture Area
                    GestureDetector(
                      onPanUpdate: (details) {
                        setState(() {
                          _points.add(details.localPosition);
                        });
                      },
                      onPanEnd: (details) => _points.add(null),
                      child: CustomPaint(
                        painter: DrawingPainter(points: _points, color: _currentColor),
                        size: Size.infinite,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Color Palette
          Padding(
            padding: const EdgeInsets.only(bottom: 24.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [Colors.blue, Colors.red, Colors.green, Colors.amber, Colors.purple].map((c) {
                return GestureDetector(
                  onTap: () => setState(() => _currentColor = c),
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 8),
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: c,
                      shape: BoxShape.circle,
                      border: Border.all(color: _currentColor == c ? Colors.white : Colors.transparent, width: 3),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}

class DrawingPainter extends CustomPainter {
  final List<Offset?> points;
  final Color color;

  DrawingPainter({required this.points, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    Paint paint = Paint()
      ..color = color
      ..strokeCap = StrokeCap.round
      ..strokeWidth = 14.0;

    for (int i = 0; i < points.length - 1; i++) {
      if (points[i] != null && points[i + 1] != null) {
        canvas.drawLine(points[i]!, points[i + 1]!, paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant DrawingPainter oldDelegate) => true;
}
