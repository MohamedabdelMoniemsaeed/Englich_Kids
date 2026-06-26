// ignore: file_names
import 'package:carousel_slider/carousel_slider.dart';
import 'package:englich_kids/models/animals/data_Animals.dart';
import 'package:englich_kids/models/animals/image_Animals.dart';
import 'package:englich_kids/models/animals/sound_Animals.dart';
import 'package:englich_kids/screen/widgets_details/Animals_Details.dart';

import 'package:flutter/material.dart';

class AnimalsScreen extends StatefulWidget {
  const AnimalsScreen({super.key});

  @override
  State<AnimalsScreen> createState() => _AnimalsScreenState();
}

class _AnimalsScreenState extends State<AnimalsScreen> {
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
        sounds: SoundAnimals.rooster,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.penguin,
        passimage: ImageAnimals.penguin,
        nameArbic: DataAnimals.penguinArabic,
        sounds: SoundAnimals.penguin,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.peacock,
        passimage: ImageAnimals.peacock,
        nameArbic: DataAnimals.peacockArabic,
        sounds: SoundAnimals.peacock,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.horse,
        passimage: ImageAnimals.horse,
        nameArbic: DataAnimals.horseArabic,
        sounds: SoundAnimals.horse,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.cow,
        passimage: ImageAnimals.cow,
        nameArbic: DataAnimals.cowArabic,
        sounds: SoundAnimals.cow,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.chick,
        passimage: ImageAnimals.chick,
        nameArbic: DataAnimals.chickArabic,
        sounds: SoundAnimals.chick,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.cat,
        passimage: ImageAnimals.cat,
        nameArbic: DataAnimals.catArabic,
        sounds: SoundAnimals.cat,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.canary,
        passimage: ImageAnimals.canary,
        nameArbic: DataAnimals.canaryArabic,
        sounds: SoundAnimals.canary,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.camel,
        passimage: ImageAnimals.camel,
        nameArbic: DataAnimals.camelArabic,
        sounds: SoundAnimals.camel,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.tiger,
        passimage: ImageAnimals.tiger,
        nameArbic: DataAnimals.tigerArabic,
        sounds: SoundAnimals.tiger,
      ),
      AnimalsDetails(
        nameEnglish: DataAnimals.elephant,
        passimage: ImageAnimals.elephant,
        nameArbic: DataAnimals.elephantArabic,
        sounds: SoundAnimals.elephant,
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
          // enlargeFactor: 0.3,
          onPageChanged: (index, reason) => setState(() => indexs = index),
          scrollDirection: Axis.horizontal,
          height: size.height,
        ),
        items: item
            .map(
              (e) => AnimalsDetails(
                nameArbic: e.nameArbic,
                nameEnglish: e.nameEnglish,
                passimage: e.passimage,
                sounds: e.sounds,
              ),
            )
            .toList(),
      ),
    );
  }
}
