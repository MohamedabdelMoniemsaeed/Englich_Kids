// ignore: file_names
import 'package:carousel_slider/carousel_slider.dart';
import 'package:englich_kids/models/zoo/data_Zoo.dart';
import 'package:englich_kids/models/zoo/image_Zoo.dart';
import 'package:englich_kids/models/zoo/sound_Zoo.dart';
import 'package:englich_kids/screen/widgets_details/zoo_Details.dart';
import 'package:flutter/material.dart';

class ZooScreen extends StatefulWidget {
  const ZooScreen({super.key});

  @override
  State<ZooScreen> createState() => _ZooScreenState();
}

class _ZooScreenState extends State<ZooScreen> {
  // ignore: recursive_getters
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    // ignore: unused_local_variable
    int indexs = 0;
    final List<ZooDetails> item = [
      ZooDetails(
        nameEnglish: DataZoo.rooster,
        passimage: ImageZoo.rooster,
        nameArbic: DataZoo.roosterArabic,
        sounds: SoundZoo.rooster,
      ),
      ZooDetails(
        nameEnglish: DataZoo.penguin,
        passimage: ImageZoo.penguin,
        nameArbic: DataZoo.penguinArabic,
        sounds: SoundZoo.penguin,
      ),
      ZooDetails(
        nameEnglish: DataZoo.peacock,
        passimage: ImageZoo.peacock,
        nameArbic: DataZoo.peacockArabic,
        sounds: SoundZoo.peacock,
      ),
      ZooDetails(
        nameEnglish: DataZoo.horse,
        passimage: ImageZoo.horse,
        nameArbic: DataZoo.horseArabic,
        sounds: SoundZoo.horse,
      ),
      ZooDetails(
        nameEnglish: DataZoo.cow,
        passimage: ImageZoo.cow,
        nameArbic: DataZoo.cowArabic,
        sounds: SoundZoo.cow,
      ),
      ZooDetails(
        nameEnglish: DataZoo.chick,
        passimage: ImageZoo.chick,
        nameArbic: DataZoo.chickArabic,
        sounds: SoundZoo.chick,
      ),
      ZooDetails(
        nameEnglish: DataZoo.cat,
        passimage: ImageZoo.cat,
        nameArbic: DataZoo.catArabic,
        sounds: SoundZoo.cat,
      ),
      ZooDetails(
        nameEnglish: DataZoo.canary,
        passimage: ImageZoo.canary,
        nameArbic: DataZoo.canaryArabic,
        sounds: SoundZoo.canary,
      ),
      ZooDetails(
        nameEnglish: DataZoo.camel,
        passimage: ImageZoo.camel,
        nameArbic: DataZoo.camelArabic,
        sounds: SoundZoo.camel,
      ),
      ZooDetails(
        nameEnglish: DataZoo.tiger,
        passimage: ImageZoo.tiger,
        nameArbic: DataZoo.tigerArabic,
        sounds: SoundZoo.tiger,
      ),
      ZooDetails(
        nameEnglish: DataZoo.elephant,
        passimage: ImageZoo.elephant,
        nameArbic: DataZoo.elephantArabic,
        sounds: SoundZoo.elephant,
      ),
    ];
    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      appBar: AppBar(
        centerTitle: true,
        // backgroundColor: Colors.pink[400],
        backgroundColor: Theme.of(context).dividerColor,
        title: const Text(
          'Zoo',
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
              (e) => ZooDetails(
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
