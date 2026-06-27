// ignore: file_names
import 'package:carousel_slider/carousel_slider.dart';
import 'package:englich_kids/models/animals/data_Animals.dart';
import 'package:englich_kids/models/animals/image_Animals.dart';
import 'package:englich_kids/screen/widgets_details/animals_Details.dart';

import 'package:flutter/material.dart';

class AnimalsScreen extends StatefulWidget {
  const AnimalsScreen({super.key});

  @override
  State<AnimalsScreen> createState() => _AnimalsScreenState();
}

class _AnimalsScreenState extends State<AnimalsScreen> {
  final List<String> _imagePaths = [
    ImageAnimals.rooster,
    ImageAnimals.penguin,
    ImageAnimals.peacock,
    ImageAnimals.horse,
    ImageAnimals.cow,
    ImageAnimals.chick,
    ImageAnimals.cat,
    ImageAnimals.canary,
    ImageAnimals.camel,
    ImageAnimals.tiger,
    ImageAnimals.elephant,
    ImageAnimals.bear,
    ImageAnimals.zebra,
    ImageAnimals.sheep,
    ImageAnimals.fox,
    ImageAnimals.donkey,
    ImageAnimals.dog,
    ImageAnimals.chicken,
    ImageAnimals.rhinoceros,
    ImageAnimals.rabbit,
    ImageAnimals.monkey,
    ImageAnimals.lion,
    ImageAnimals.hyena,
    ImageAnimals.gorilla,
    ImageAnimals.giraffe,
    ImageAnimals.gazelle,
  ];

  bool _imagesPrecached = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_imagesPrecached) return;
      for (final imagePath in _imagePaths) {
        precacheImage(AssetImage(imagePath), context);
      }
      _imagesPrecached = true;
    });
  }

  // ignore: recursive_getters
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    // ignore: unused_local_variable
    int indexs = 0;
    final List<AnimalsDetails> item = [
      AnimalsDetails(
        nameEnglish: DataAnimals.rooster,
        passimage: ImageAnimals.rooster,
        nameArbic: DataAnimals.roosterArabic,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.penguin,
        passimage: ImageAnimals.penguin,
        nameArbic: DataAnimals.penguinArabic,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.peacock,
        passimage: ImageAnimals.peacock,
        nameArbic: DataAnimals.peacockArabic,
        //  sounds: SoundAnimals.peacock,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.horse,
        passimage: ImageAnimals.horse,
        nameArbic: DataAnimals.horseArabic,
        //sounds: SoundAnimals.horse,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.cow,
        passimage: ImageAnimals.cow,
        nameArbic: DataAnimals.cowArabic,
        // sounds: SoundAnimals.cow,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.chick,
        passimage: ImageAnimals.chick,
        nameArbic: DataAnimals.chickArabic,
        // sounds: SoundAnimals.chick,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.cat,
        passimage: ImageAnimals.cat,
        nameArbic: DataAnimals.catArabic,
        // sounds: SoundAnimals.cat,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.canary,
        passimage: ImageAnimals.canary,
        nameArbic: DataAnimals.canaryArabic,
        //  sounds: SoundAnimals.canary,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.camel,
        passimage: ImageAnimals.camel,
        nameArbic: DataAnimals.camelArabic,
        //  sounds: SoundAnimals.camel,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.tiger,
        passimage: ImageAnimals.tiger,
        nameArbic: DataAnimals.tigerArabic,
        // sounds: SoundAnimals.tiger,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.elephant,
        passimage: ImageAnimals.elephant,
        nameArbic: DataAnimals.elephantArabic,
        // sounds: SoundAnimals.elephant,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.bear,
        passimage: ImageAnimals.bear,
        nameArbic: DataAnimals.bearArabic,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.zebra,
        passimage: ImageAnimals.zebra,
        nameArbic: DataAnimals.zebraArabic,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.sheep,
        passimage: ImageAnimals.sheep,
        nameArbic: DataAnimals.sheepArabic,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.fox,
        passimage: ImageAnimals.fox,
        nameArbic: DataAnimals.foxArabic,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.donkey,
        passimage: ImageAnimals.donkey,
        nameArbic: DataAnimals.donkeyArabic,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.dog,
        passimage: ImageAnimals.dog,
        nameArbic: DataAnimals.dogArabic,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.chicken,
        passimage: ImageAnimals.chicken,
        nameArbic: DataAnimals.chickenArabic,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.rhinoceros,
        passimage: ImageAnimals.rhinoceros,
        nameArbic: DataAnimals.rhinocerosArabic,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.rabbit,
        passimage: ImageAnimals.rabbit,
        nameArbic: DataAnimals.rabbitArabic,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.monkey,
        passimage: ImageAnimals.monkey,
        nameArbic: DataAnimals.monkeyArabic,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.lion,
        passimage: ImageAnimals.lion,
        nameArbic: DataAnimals.lionArabic,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.hyena,
        passimage: ImageAnimals.hyena,
        nameArbic: DataAnimals.hyenaArabic,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.gorilla,
        passimage: ImageAnimals.gorilla,
        nameArbic: DataAnimals.gorillaArabic,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.giraffe,
        passimage: ImageAnimals.giraffe,
        nameArbic: DataAnimals.giraffeArabic,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.gazelle,
        passimage: ImageAnimals.gazelle,
        nameArbic: DataAnimals.gazelleArabic,
      ),
    ];
    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      appBar: AppBar(
        centerTitle: true,
        // backgroundColor: Colors.pink[400],
        backgroundColor: Theme.of(context).dividerColor,
        title: const Text(
          'Animals',
          style: TextStyle(
            fontSize: 30,
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: CarouselSlider(
        options: CarouselOptions(
          viewportFraction: 1,
          enlargeCenterPage: true,
          enableInfiniteScroll: true,
          autoPlay: false,
          enlargeFactor: 0.15,
          pageSnapping: true,
          animateToClosest: true,
          onPageChanged: (index, reason) => setState(() => indexs = index),
          scrollDirection: Axis.horizontal,
          height: size.height,
        ),
        items: item
            .map(
              (e) => SizedBox(
                width: size.width,
                child: AnimalsDetails(
                  nameArbic: e.nameArbic,
                  nameEnglish: e.nameEnglish,
                  passimage: e.passimage,
                ),
              ),
            )
            .toList(),
      ),
    );
  }
}
