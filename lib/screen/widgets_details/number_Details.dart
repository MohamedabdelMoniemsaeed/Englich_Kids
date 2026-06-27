import 'package:englich_kids/services/tts_service.dart';
import 'package:flutter/material.dart';

// ignore: must_be_immutable
class NumberDetails extends StatelessWidget {
  String passimage;
  String nameEnglish;
  String nameArbic;
  NumberDetails({
    super.key,
    required this.passimage,
    required this.nameEnglish,
    required this.nameArbic,
  });

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      body: SafeArea(
        child: Stack(
          children: [
            GestureDetector(
              onTap: () async {
                await TtsService.speak(nameEnglish);
              },
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
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
                            image: AssetImage(passimage),
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                    ],
                  ),
                  Container(
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
                  Container(
                    margin: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 5,
                    ),
                    child: Text(
                      textAlign: TextAlign.center,
                      nameEnglish,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 100,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Positioned(
              top: 8,
              right: 8,
              child: IconButton(
                onPressed: () async => TtsService.speak(nameEnglish),
                style: IconButton.styleFrom(
                  backgroundColor: Colors.black54,
                  padding: const EdgeInsets.all(10),
                ),
                icon: const Icon(Icons.volume_up, color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
