import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum AppTheme { light, dark, pink, blue }

class ThemeController extends ChangeNotifier {
  AppTheme _theme = AppTheme.light;

  AppTheme get theme => _theme;
  ThemeMode get mode =>
      _theme == AppTheme.dark ? ThemeMode.dark : ThemeMode.light;
  bool get isDark => _theme == AppTheme.dark;
  String? get backgroundAsset {
    switch (_theme) {
      case AppTheme.pink:
        return 'assets/images/girl_background.png';
      case AppTheme.blue:
        return 'assets/images/boy_background.png';
      case AppTheme.light:
      case AppTheme.dark:
        return null;
    }
  }

  Future<void> load() async {
    final preferences = await SharedPreferences.getInstance();
    final savedTheme = preferences.getString('app_theme');
    _theme = AppTheme.values.firstWhere(
      (value) => value.name == savedTheme,
      orElse: () => preferences.getBool('dark_mode') == true
          ? AppTheme.dark
          : AppTheme.light,
    );
    notifyListeners();
  }

  Future<void> setDarkMode(bool enabled) async {
    await setTheme(enabled ? AppTheme.dark : AppTheme.light);
  }

  Future<void> setTheme(AppTheme theme) async {
    _theme = theme;
    notifyListeners();
    final preferences = await SharedPreferences.getInstance();
    await preferences.setString('app_theme', theme.name);
    await preferences.setBool('dark_mode', theme == AppTheme.dark);
  }
}
