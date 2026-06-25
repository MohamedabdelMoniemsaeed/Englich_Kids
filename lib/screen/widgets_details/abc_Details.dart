// ignore: file_names
import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';

// ignore: must_be_immutable
class AbcDetails extends StatelessWidget {
  String imageAbc;
  String nameEnglish;
  String abc;
  String sound;
  AbcDetails({
    super.key,
    required this.imageAbc,
    required this.abc,
    required this.nameEnglish,
    required this.sound,
  });
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return GestureDetector(
      onTap: () {
        final player = AudioPlayer();
        player.play(AssetSource(sound));
      },
      child: Column(
        children: [
          Stack(
            alignment: Alignment.bottomCenter,
            children: [
              Container(
                margin: const EdgeInsets.all(8),
                width: size.width,
                height: size.height * .5,
                decoration: BoxDecoration(
                  border: Border.all(
                    color: Theme.of(context).hoverColor,
                    width: 5,
                  ),
                  borderRadius: BorderRadiusDirectional.circular(50),
                  image: DecorationImage(
                    image: AssetImage(imageAbc),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(bottom: 20, top: 20),
                child: Text(
                  nameEnglish,
                  style: const TextStyle(
                    fontSize: 60,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
              ),
            ],
          ),
          Text(
            abc,
            style: const TextStyle(fontSize: 200, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
