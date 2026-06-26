import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';

// ignore: must_be_immutable
class AnimalsDetails extends StatelessWidget {
  String passimage;
  String nameEnglish;
  String nameArbic;
  String sounds;
  AnimalsDetails({
    super.key,
    required this.passimage,
    required this.nameEnglish,
    required this.nameArbic,
    required this.sounds,
  });

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    var container = Column(
      // crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          margin: const EdgeInsets.all(8),
          width: size.width,
          height: size.height * .5,
          decoration: BoxDecoration(
            border: Border.all(color: Theme.of(context).hoverColor, width: 5),
            borderRadius: BorderRadiusDirectional.circular(50),
            image: DecorationImage(
              image: AssetImage(passimage),
              fit: BoxFit.cover,
            ),
          ),
        ),
        Container(
          // color: Colors.amber,
          // width: size.width * .5,
          margin: const EdgeInsets.symmetric(horizontal: 20),
          child: Text(
            textAlign: TextAlign.center,
            nameArbic,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 45,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        Container(
          // color: Colors.black,
          // width: size.width * .5,
          margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 5),
          child: Text(
            textAlign: TextAlign.center,
            // minFontSize: 16,
            // maxLines: 2,
            nameEnglish,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 80,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ],
    );
    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      body: SafeArea(
        child: GestureDetector(
          onTap: () {
            final player = AudioPlayer();
            player.play(AssetSource(sounds));
          },
          child: container,
        ),
      ),
    );
  }
}
