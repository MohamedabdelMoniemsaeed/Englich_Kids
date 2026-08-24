import 'package:flutter/material.dart';
import '../models/app_data.dart';
import 'category_screen.dart';
import 'games_hub_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        backgroundColor: const Color(0xFF4F46E5),
        elevation: 0,
        title: const Row(
          children: [
            Text('🌟 English Kids', style: TextStyle(fontWeight: FontWeight.w900, color: Colors.white)),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 14),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.amber,
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Row(
              children: [
                Icon(Icons.star, color: Colors.white, size: 18),
                SizedBox(width: 4),
                Text('35 Stars', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black87, fontSize: 13)),
              ],
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Games Card
            InkWell(
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const GamesHubScreen()));
              },
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF6366F1), Color(0xFFEC4899)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(color: const Color(0xFF6366F1).withOpacity(0.3), blurRadius: 12, offset: const Offset(0, 4)),
                  ],
                ),
                child: const Row(
                  children: [
                    Text('🎮', style: TextStyle(fontSize: 48)),
                    SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Kids Games Hub ⭐', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                          SizedBox(height: 4),
                          Text('ألعاب الذاكرة، التتبع، والتهجئة الممتعة', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        ],
                      ),
                    ),
                    Icon(Icons.arrow_forward_ios_rounded, color: Colors.white),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),
            const Text(
              'الأقسام التعليمية / Learning Topics',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
            ),
            const SizedBox(height: 14),

            // Categories Grid
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 14,
                mainAxisSpacing: 14,
                childAspectRatio: 1.1,
              ),
              itemCount: AppData.categories.length,
              itemBuilder: (context, index) {
                final cat = AppData.categories[index];

                return Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(color: cat.primaryColor.withOpacity(0.25), width: 2),
                    boxShadow: [
                      BoxShadow(color: cat.primaryColor.withOpacity(0.08), blurRadius: 6, offset: const Offset(0, 2)),
                    ],
                  ),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      borderRadius: BorderRadius.circular(22),
                      onTap: () {
                        Navigator.push(context, MaterialPageRoute(builder: (_) => CategoryScreen(category: cat)));
                      },
                      child: Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(cat.iconEmoji, style: const TextStyle(fontSize: 38)),
                            const SizedBox(height: 8),
                            Text(
                              cat.titleEn,
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: cat.primaryColor),
                            ),
                            Text(
                              cat.titleAr,
                              style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
