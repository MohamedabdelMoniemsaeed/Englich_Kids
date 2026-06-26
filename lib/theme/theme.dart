import 'package:flutter/material.dart';

enum AppTheme { boy, girl }

class ThemeApp {
  static const String boyBackground = 'assets/images/boy_background.png';
  static const String girlBackground = 'assets/images/girl_background.png';

  static final ThemeData boyTheme = ThemeData(
    appBarTheme: AppBarTheme(
      centerTitle: true,
      backgroundColor: Colors.blue.shade400,
      titleTextStyle: const TextStyle(
        color: Colors.white,
        fontSize: 30,
        fontWeight: FontWeight.bold,
      ),
    ),
    primaryColor: Colors.blue.shade100,
    hoverColor: Colors.blue.shade400,
    dividerColor: Colors.blue,
  );

  static final ThemeData girlTheme = ThemeData(
    appBarTheme: AppBarTheme(
      centerTitle: true,
      backgroundColor: Colors.pink.shade400,
      titleTextStyle: const TextStyle(
        color: Colors.white,
        fontSize: 30,
        fontWeight: FontWeight.bold,
      ),
    ),
    primaryColor: Colors.pink.shade100,
    hoverColor: Colors.pink.shade400,
    dividerColor: Colors.pink,
  );
}

extension AppThemeExtension on AppTheme {
  ThemeData get themeData {
    switch (this) {
      case AppTheme.girl:
        return ThemeApp.girlTheme;
      case AppTheme.boy:
        return ThemeApp.boyTheme;
    }
  }

  String get backgroundImage {
    switch (this) {
      case AppTheme.girl:
        return ThemeApp.girlBackground;
      case AppTheme.boy:
        return ThemeApp.boyBackground;
    }
  }
}
