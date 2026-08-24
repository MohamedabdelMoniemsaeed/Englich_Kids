import 'package:flutter/material.dart';
import 'spelling_bee_screen.dart';
import 'memory_game_screen.dart';
import 'tracing_screen.dart';
import 'listening_game_screen.dart';

class GamesHubScreen extends StatelessWidget {
  const GamesHubScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF8B5CF6),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Column(
          children: [
            Text('🎮 Kids Games Hub', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 18)),
            Text('ألعاب وأنشطة تفاعلية مسلية', style: TextStyle(color: Colors.white70, fontSize: 11)),
          ],
        ),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: GridView.count(
          crossAxisCount: 2,
          crossAxisSpacing: 14,
          mainAxisSpacing: 14,
          children: [
            _buildGameCard(
              context,
              title: 'Spelling Bee',
              subtitle: 'لعبة تركيب الكلمات',
              emoji: '🔤',
              color: const Color(0xFF10B981),
              onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const SpellingBeeScreen())),
            ),
            _buildGameCard(
              context,
              title: 'Memory Match',
              subtitle: 'لعبة الذاكرة والبطاقات',
              emoji: '🧠',
              color: const Color(0xFF8B5CF6),
              onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const MemoryGameScreen())),
            ),
            _buildGameCard(
              context,
              title: 'Tracing Board',
              subtitle: 'سبورة تتبع الحروف',
              emoji: '✍️',
              color: const Color(0xFF3B82F6),
              onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const TracingScreen())),
            ),
            _buildGameCard(
              context,
              title: 'Listen & Tap',
              subtitle: 'تحدي الاستماع السريع',
              emoji: '🎧',
              color: const Color(0xFFF43F5E),
              onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ListeningGameScreen())),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGameCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required String emoji,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: color.withOpacity(0.3), width: 2),
        boxShadow: [
          BoxShadow(color: color.withOpacity(0.1), blurRadius: 8, offset: const Offset(0, 3)),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(22),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(14.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(emoji, style: const TextStyle(fontSize: 42)),
                const SizedBox(height: 8),
                Text(title, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: color)),
                const SizedBox(height: 2),
                Text(subtitle, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)), textAlign: TextAlign.center),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
