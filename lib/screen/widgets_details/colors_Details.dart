import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/material.dart';

class ColorsDetails extends StatelessWidget {
  final Color color;
  final String sound;
  final String nameArbic;
  final String nameEnglish;
  const ColorsDetails({
    super.key,
    required this.color,
    required this.sound,
    required this.nameArbic,
    required this.nameEnglish,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: () {
          final player = AudioPlayer();
          player.play(AssetSource(sound));
        },
        child: Container(
          margin: const EdgeInsets.all(1),
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
                  style: const TextStyle(
                    color: Colors.white,
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
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
