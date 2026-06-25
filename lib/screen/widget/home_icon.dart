import 'package:flutter/material.dart';

// ignore: must_be_immutable
class TapRow extends StatelessWidget {
  String name;
  Color color = Colors.white54;
  String image;
  Function() onTap;
  TapRow(
      {super.key,
      required this.name,
      // required this.color,
      required this.image,
      required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
              end: Alignment.topCenter,
              begin: Alignment.bottomCenter,
              stops: const [0, 1],
              tileMode: TileMode.clamp,
              colors: [Theme.of(context).dividerColor, color]),
          borderRadius: BorderRadius.circular(50),
          color: color,
        ),
        margin: const EdgeInsets.all(10),
        alignment: Alignment.center,
        width: MediaQuery.of(context).size.width * .5,
        // height: MediaQuery.of(context).size.height * .3,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            SizedBox(
              width: MediaQuery.of(context).size.width * .30,
              // height: MediaQuery.of(context).size.height * .2,
              child: SizedBox(
                height: MediaQuery.of(context).size.height * .15,
                child: Image.asset(
                  image,
                  fit: BoxFit.cover,
                ),
              ),
            ),
            Text(
              name,
              style: const TextStyle(
                  fontSize: 30,
                  color: Colors.black,
                  fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}
