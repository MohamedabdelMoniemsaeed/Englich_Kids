import 'package:englich_kids/theme/theme.dart';
import 'package:flutter/material.dart';

class Mode extends ChangeNotifier {
  AppTheme selectedTheme = AppTheme.boy;

  ThemeData get theme => selectedTheme.themeData;
  String get backgroundImage => selectedTheme.backgroundImage;

  void setMode(AppTheme theme) {
    selectedTheme = theme;
    notifyListeners();
  }
}
