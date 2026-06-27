// ignore: file_names
import 'package:englich_kids/services/tts_service.dart';
import 'package:flutter/material.dart';

// ignore: must_be_immutable
class AbcDetails extends StatelessWidget {
  String imageAbc;
  String nameEnglish;
  String abc;
  AbcDetails({
    super.key,
    required this.imageAbc,
    required this.abc,
    required this.nameEnglish,
  });
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return Stack(
      children: [
        GestureDetector(
          onTap: () async {
            await TtsService.speakSequence(
              [abc, nameEnglish],
              language: 'en-US',
              speechRate: 0.4,
            );
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
                style: const TextStyle(
                  fontSize: 200,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
        Positioned(
          top: 16,
          right: 16,
          child: IconButton(
            onPressed: () async => TtsService.speakSequence(
              [abc, nameEnglish],
              language: 'en-US',
              speechRate: 0.4,
            ),
            style: IconButton.styleFrom(
              backgroundColor: Colors.black54,
              padding: const EdgeInsets.all(10),
            ),
            icon: const Icon(Icons.volume_up, color: Colors.white),
          ),
        ),
      ],
    );
  }
}
