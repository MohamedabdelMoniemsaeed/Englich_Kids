import 'package:englich_kids/services/tts_service.dart';
import 'package:flutter/material.dart';

class ColorsDetails extends StatelessWidget {
  final Color color;
  final String nameArbic;
  final String nameEnglish;
  const ColorsDetails({
    super.key,
    required this.color,
    required this.nameArbic,
    required this.nameEnglish,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      flex: 1,
      child: Padding(
        padding: const EdgeInsets.all(1),
        child: Stack(
          fit: StackFit.expand,
          children: [
            GestureDetector(
              onTap: () async {
                await TtsService.speak(nameEnglish);
              },
              child: Container(
                width: double.infinity,
                height: double.infinity,
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(left: 10),
                      child: Text(
                        nameEnglish,
                        style: TextStyle(
                          color: color == Colors.white
                              ? Colors.black
                              : Colors.white,
                          fontSize: 30,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const Spacer(),
                    Padding(
                      padding: const EdgeInsets.only(right: 10),
                      child: Text(
                        nameArbic,
                        style: TextStyle(
                          color: color == Colors.white
                              ? Colors.black
                              : Colors.white,
                          fontSize: 30,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Positioned(
              top: 8,
              right: 8,
              child: IconButton(
                onPressed: () async => TtsService.speak(nameEnglish),
                style: IconButton.styleFrom(
                  backgroundColor: Colors.black38,
                  padding: const EdgeInsets.all(8),
                ),
                icon: const Icon(
                  Icons.volume_up,
                  color: Colors.white,
                  size: 20,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
