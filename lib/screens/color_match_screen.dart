import 'package:flutter/material.dart';
import '../services/tts_service.dart';

class ColorMatchScreen extends StatefulWidget {
  const ColorMatchScreen({super.key});

  @override
  State<ColorMatchScreen> createState() => _ColorMatchScreenState();
}

class _ColorMatchScreenState extends State<ColorMatchScreen> {
  final _rounds = const [
    {'name': 'Red', 'arabic': 'أحمر', 'color': 0xFFE53935},
    {'name': 'Blue', 'arabic': 'أزرق', 'color': 0xFF1E88E5},
    {'name': 'Yellow', 'arabic': 'أصفر', 'color': 0xFFFDD835},
    {'name': 'Green', 'arabic': 'أخضر', 'color': 0xFF43A047},
    {'name': 'Pink', 'arabic': 'وردي', 'color': 0xFFD81B60},
  ];
  int _index = 0;
  int _score = 0;
  late List<Map<String, Object>> _options;

  @override
  void initState() {
    super.initState();
    _makeOptions();
  }

  void _makeOptions() {
    _options = _rounds
        .map((round) => <String, Object>{
              'name': round['name']!,
              'arabic': round['arabic']!,
              'color': round['color']!,
            })
        .toList()
      ..shuffle();
  }

  void _choose(Map<String, Object> option) {
    final correct = option['name'] == _rounds[_index]['name'];
    TtsService.speak(correct ? 'Correct! ${option['name']}' : 'Try again');
    if (!correct) return;
    setState(() {
      _score += 10;
      _index = (_index + 1) % _rounds.length;
      _makeOptions();
    });
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final current = _rounds[_index];
    return Scaffold(
      appBar: AppBar(
        title: Text('Color Match 🎨 ($_score)'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Find this color / ابحث عن اللون',
                style: TextStyle(
                    color: colors.onSurface,
                    fontSize: 18,
                    fontWeight: FontWeight.bold)),
            const SizedBox(height: 18),
            CircleAvatar(
              radius: 62,
              backgroundColor: Color(current['color']! as int),
              child: const Icon(Icons.palette, color: Colors.white, size: 48),
            ),
            const SizedBox(height: 12),
            Text(current['arabic']! as String,
                style: TextStyle(
                    color: colors.primary,
                    fontSize: 22,
                    fontWeight: FontWeight.bold)),
            const SizedBox(height: 28),
            Wrap(
              spacing: 16,
              runSpacing: 16,
              alignment: WrapAlignment.center,
              children: _options.map((option) {
                return InkWell(
                  onTap: () => _choose(option),
                  borderRadius: BorderRadius.circular(20),
                  child: Container(
                    width: 120,
                    height: 90,
                    decoration: BoxDecoration(
                      color: Color(option['color']! as int),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                            color: colors.shadow.withValues(alpha: 0.2),
                            blurRadius: 8)
                      ],
                    ),
                    child: Center(
                      child: Text(option['name']! as String,
                          style: const TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold)),
                    ),
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }
}
