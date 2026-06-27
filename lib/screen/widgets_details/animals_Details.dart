import 'package:englich_kids/services/tts_service.dart';
import 'package:flutter/material.dart';

// ignore: must_be_immutable
class AnimalsDetails extends StatefulWidget {
  final String passimage;
  final String nameEnglish;
  final String nameArbic;

  const AnimalsDetails({
    super.key,
    required this.passimage,
    required this.nameEnglish,
    required this.nameArbic,
  });

  @override
  State<AnimalsDetails> createState() => _AnimalsDetailsState();
}

class _AnimalsDetailsState extends State<AnimalsDetails> {
  late final AssetImage _image;

  @override
  void initState() {
    super.initState();
    _image = AssetImage(widget.passimage);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      precacheImage(_image, context);
    });
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    final imageContainer = Container(
      margin: const EdgeInsets.all(8),
      width: size.width,
      height: size.height * .5,
      decoration: BoxDecoration(
        border: Border.all(color: Theme.of(context).hoverColor, width: 5),
        borderRadius: BorderRadiusDirectional.circular(50),
      ),
      child: ClipRRect(
        borderRadius: BorderRadiusDirectional.circular(44),
        child: Image.asset(
          widget.passimage,
          fit: BoxFit.cover,
          gaplessPlayback: true,
          filterQuality: FilterQuality.high,
          errorBuilder: (context, error, stackTrace) => Container(
            color: Colors.grey.shade300,
            child: const Center(child: Icon(Icons.broken_image)),
          ),
        ),
      ),
    );

    final container = Column(
      children: [
        imageContainer,
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 20),
          child: Text(
            textAlign: TextAlign.center,
            widget.nameArbic,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 35,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 5),
          child: Text(
            textAlign: TextAlign.center,
            widget.nameEnglish,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 45,
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
          behavior: HitTestBehavior.opaque,
          onTap: () async {
            await TtsService.speak(widget.nameEnglish);
          },
          child: Stack(
            children: [
              container,
              Positioned(
                top: 8,
                right: 8,
                child: IconButton(
                  onPressed: () async => TtsService.speak(widget.nameEnglish),
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
      ),
    );
  }
}
