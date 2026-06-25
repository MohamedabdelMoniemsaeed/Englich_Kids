import 'package:flutter/material.dart';

// ignore: camel_case_types
class GirlColor {
  static Color backgroundColorScreen = Colors.pink.shade100;
  static Color backgroundColorAppbar = Colors.pink.shade400;
  static Color backgroundColorpink = Colors.pink;
}

class BoyColor {
  static Color backgroundColorScreen = Colors.blue.shade100;
  static Color backgroundColorAppbar = Colors.blue.shade400;
  static Color backgroundColorblue = Colors.blue;
}

class ThemeApp {
  static ThemeData boyTheme = ThemeData(
      appBarTheme: AppBarTheme(
        centerTitle: true,
        backgroundColor: Colors.blue.shade400,
        titleTextStyle: const TextStyle(
            color: Colors.white, fontSize: 30, fontWeight: FontWeight.bold),
      ),
      primaryColor: Colors.blue.shade100,
      hoverColor: Colors.blue.shade400,
      dividerColor: Colors.blue);

  static ThemeData girlTheme = ThemeData(
      appBarTheme: AppBarTheme(
        centerTitle: true,
        backgroundColor: Colors.pink.shade400,
        titleTextStyle: const TextStyle(
            color: Colors.white, fontSize: 30, fontWeight: FontWeight.bold),
      ),
      primaryColor: Colors.pink.shade100,
      hoverColor: Colors.pink.shade400,
      dividerColor: Colors.pink);
}
