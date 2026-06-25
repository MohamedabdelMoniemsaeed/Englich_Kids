import 'package:englich_kids/models/colors/data_colors.dart';
import 'package:englich_kids/models/colors/sound_colors.dart';
import 'package:englich_kids/screen/widgets_details/colors_Details.dart';
import 'package:flutter/material.dart';

class ColorsScreen extends StatefulWidget {
  const ColorsScreen({super.key});

  @override
  State<ColorsScreen> createState() => _ColorsScreenState();
}

class _ColorsScreenState extends State<ColorsScreen> {
  @override
  Widget build(BuildContext context) {
    final List<ColorsDetails> item = [
      ColorsDetails(
          color: Colors.red,
          sound: SoundColors.red,
          nameArbic: "احمر",
          nameEnglish: DataColors.red),
      ColorsDetails(
          color: Colors.black,
          sound: SoundColors.black,
          nameArbic: "اسود",
          nameEnglish: DataColors.black),
      ColorsDetails(
          color: Colors.brown,
          sound: SoundColors.brown,
          nameArbic: "بني",
          nameEnglish: DataColors.brown),
      ColorsDetails(
          color: Colors.orange,
          sound: SoundColors.orange,
          nameArbic: "برتقالي",
          nameEnglish: DataColors.orange),
      ColorsDetails(
          color: Colors.green,
          sound: SoundColors.green,
          nameArbic: "اخضر",
          nameEnglish: DataColors.green),
      ColorsDetails(
          color: Colors.yellow,
          sound: SoundColors.yellow,
          nameArbic: "اصفر",
          nameEnglish: DataColors.yellow),
    ];

    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      appBar: AppBar(
        title: const Text(
          'Colors',
          style: TextStyle(),
        ),
      ),
      body: Column(
        children: item
            .map((e) => ColorsDetails(
                  color: e.color,
                  nameArbic: e.nameArbic,
                  nameEnglish: e.nameEnglish,
                  sound: e.sound,
                ))
            .toList(),
      ),
    );
  }
}
