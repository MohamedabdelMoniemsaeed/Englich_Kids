import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';

// ignore: must_be_immutable
class FamilyDetails extends StatelessWidget {
  String passimage;
  String nameEnglish;
  String nameArbic;
  String sounds;
  FamilyDetails({
    super.key,
    required this.passimage,
    required this.nameEnglish,
    required this.nameArbic,
    required this.sounds,
  });

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      body: SafeArea(
        child: GestureDetector(
          onTap: () {
            final player = AudioPlayer();
            player.play(AssetSource(sounds));
          },
          child: Container(
            margin: const EdgeInsets.all(8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Stack(
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
                          image: AssetImage(passimage),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  ],
                ),
                Container(
                  // color: Colors.amber,
                  // width: size.width * .5,
                  margin: const EdgeInsets.symmetric(horizontal: 20),
                  child: Text(
                    textAlign: TextAlign.right,
                    nameArbic,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 35,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Expanded(
                  child: Container(
                    alignment: Alignment.center,
                    // color: Colors.black,
                    // width: size.width * .5,
                    margin: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 5,
                    ),
                    child: Text(
                      textAlign: TextAlign.center,
                      // minFontSize: 16,
                      // maxLines: 2,
                      nameEnglish,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 50,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
