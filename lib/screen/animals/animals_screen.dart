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
  static final List<_AnimalItem> _animals = [
    _AnimalItem(
      nameEnglish: DataAnimals.rooster,
      passimage: ImageAnimals.rooster,
      nameArbic: DataAnimals.roosterArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.penguin,
      passimage: ImageAnimals.penguin,
      nameArbic: DataAnimals.penguinArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.peacock,
      passimage: ImageAnimals.peacock,
      nameArbic: DataAnimals.peacockArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.horse,
      passimage: ImageAnimals.horse,
      nameArbic: DataAnimals.horseArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.cow,
      passimage: ImageAnimals.cow,
      nameArbic: DataAnimals.cowArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.chick,
      passimage: ImageAnimals.chick,
      nameArbic: DataAnimals.chickArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.cat,
      passimage: ImageAnimals.cat,
      nameArbic: DataAnimals.catArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.canary,
      passimage: ImageAnimals.canary,
      nameArbic: DataAnimals.canaryArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.camel,
      passimage: ImageAnimals.camel,
      nameArbic: DataAnimals.camelArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.tiger,
      passimage: ImageAnimals.tiger,
      nameArbic: DataAnimals.tigerArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.elephant,
      passimage: ImageAnimals.elephant,
      nameArbic: DataAnimals.elephantArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.bear,
      passimage: ImageAnimals.bear,
      nameArbic: DataAnimals.bearArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.zebra,
      passimage: ImageAnimals.zebra,
      nameArbic: DataAnimals.zebraArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.sheep,
      passimage: ImageAnimals.sheep,
      nameArbic: DataAnimals.sheepArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.fox,
      passimage: ImageAnimals.fox,
      nameArbic: DataAnimals.foxArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.donkey,
      passimage: ImageAnimals.donkey,
      nameArbic: DataAnimals.donkeyArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.dog,
      passimage: ImageAnimals.dog,
      nameArbic: DataAnimals.dogArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.chicken,
      passimage: ImageAnimals.chicken,
      nameArbic: DataAnimals.chickenArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.rhinoceros,
      passimage: ImageAnimals.rhinoceros,
      nameArbic: DataAnimals.rhinocerosArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.rabbit,
      passimage: ImageAnimals.rabbit,
      nameArbic: DataAnimals.rabbitArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.monkey,
      passimage: ImageAnimals.monkey,
      nameArbic: DataAnimals.monkeyArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.lion,
      passimage: ImageAnimals.lion,
      nameArbic: DataAnimals.lionArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.hyena,
      passimage: ImageAnimals.hyena,
      nameArbic: DataAnimals.hyenaArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.gorilla,
      passimage: ImageAnimals.gorilla,
      nameArbic: DataAnimals.gorillaArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.giraffe,
      passimage: ImageAnimals.giraffe,
      nameArbic: DataAnimals.giraffeArabic,
    ),
    _AnimalItem(
      nameEnglish: DataAnimals.gazelle,
      passimage: ImageAnimals.gazelle,
      nameArbic: DataAnimals.gazelleArabic,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      appBar: AppBar(
        centerTitle: true,
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
      body: CarouselSlider.builder(
        itemCount: _animals.length,
        options: CarouselOptions(
          viewportFraction: 1,
          enlargeCenterPage: true,
          enableInfiniteScroll: true,
          autoPlay: false,
          enlargeFactor: 0.15,
          pageSnapping: true,
          animateToClosest: true,
          scrollDirection: Axis.horizontal,
          height: size.height,
        ),
        itemBuilder: (context, index, realIndex) {
          final animal = _animals[index];
          return SizedBox(
            width: size.width,
            child: AnimalsDetails(
              nameArbic: animal.nameArbic,
              nameEnglish: animal.nameEnglish,
              passimage: animal.passimage,
            ),
          );
        },
      ),
    );
  }
}

class _AnimalItem {
  _AnimalItem({
    required this.nameEnglish,
    required this.passimage,
    required this.nameArbic,
  });

  final String nameEnglish;
  final String passimage;
  final String nameArbic;
}
