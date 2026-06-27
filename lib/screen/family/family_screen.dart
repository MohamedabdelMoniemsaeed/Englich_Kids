import 'package:englich_kids/models/family/data_family.dart';
import 'package:englich_kids/models/family/image_family.dart';
import 'package:englich_kids/screen/widget/all_icon.dart';
import 'package:flutter/material.dart';

class FamilyScreen extends StatefulWidget {
  const FamilyScreen({super.key});

  @override
  State<FamilyScreen> createState() => _FamilyScreenState();
}

class _FamilyScreenState extends State<FamilyScreen> {
  @override
  Widget build(BuildContext context) {
    final List<FamilyIcon> item = [
      FamilyIcon(
        nameEnglish: DataFamily.daughter,
        images: ImageFamily.daughter,
        nameArbic: DataFamily.daughterArbic,
      ),
      FamilyIcon(
        nameEnglish: DataFamily.father,
        images: ImageFamily.father,
        nameArbic: DataFamily.fatherArbic,
      ),
      FamilyIcon(
        nameEnglish: DataFamily.mother,
        images: ImageFamily.mother,
        nameArbic: DataFamily.motherArbic,
      ),
      FamilyIcon(
        nameEnglish: DataFamily.son,
        images: ImageFamily.son,
        nameArbic: DataFamily.sonArbic,
      ),
      FamilyIcon(
        nameEnglish: DataFamily.grandfather,
        images: ImageFamily.grandfather,
        nameArbic: DataFamily.grandfatherArbic,
      ),
      FamilyIcon(
        nameEnglish: DataFamily.grandmother,
        images: ImageFamily.grandmother,
        nameArbic: DataFamily.grandmotherArbic,
      ),
      FamilyIcon(
        nameEnglish: DataFamily.brother,
        images: ImageFamily.brother,
        nameArbic: DataFamily.brotherArbic,
      ),
      FamilyIcon(
        nameEnglish: DataFamily.sister,
        images: ImageFamily.sister,
        nameArbic: DataFamily.sisterArbic,
      ),
    ];

    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      appBar: AppBar(
        title: const Text(
          'Family',
          style: TextStyle(
            fontSize: 30,
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: GridView.builder(
        itemCount: item.length,
        itemBuilder: (context, index) => item[index],
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
        ),
      ),
    );
  }
}
