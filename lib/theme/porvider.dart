import 'package:englich_kids/theme/theme.dart';
import 'package:flutter/material.dart';

class Mode extends ChangeNotifier {
  ThemeData mode = ThemeApp.boyTheme;
  
  void setmode(ThemeData modes) {
    mode = modes;
    notifyListeners();
  }
}
