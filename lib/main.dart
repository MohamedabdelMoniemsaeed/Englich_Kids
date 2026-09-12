import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'services/tts_service.dart';
import 'services/theme_controller.dart';
import 'screens/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await TtsService.init();
  final themeController = ThemeController();
  await themeController.load();
  runApp(EnglichKidsFlutterApp(themeController: themeController));
}

class EnglichKidsFlutterApp extends StatelessWidget {
  final ThemeController? themeController;

  const EnglichKidsFlutterApp({super.key, this.themeController});

  @override
  Widget build(BuildContext context) {
    final controller = themeController ?? ThemeController();
    return AnimatedBuilder(
      animation: controller,
      builder: (context, child) {
        final seedColor = controller.theme == AppTheme.pink
            ? const Color(0xFFE91E63)
            : controller.theme == AppTheme.blue
                ? const Color(0xFF1976D2)
                : Colors.indigo;
        final lightScheme = ColorScheme.fromSeed(
          seedColor: seedColor,
          brightness: Brightness.light,
        );
        final darkScheme = ColorScheme.fromSeed(
          seedColor: seedColor,
          brightness: Brightness.dark,
        );
        final scheme = controller.isDark ? darkScheme : lightScheme;
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'Englich Kids',
          theme: ThemeData(
            textTheme: GoogleFonts.cairoTextTheme(),
            useMaterial3: true,
            brightness: Brightness.light,
            scaffoldBackgroundColor: Colors.transparent,
            colorScheme: lightScheme,
            appBarTheme: AppBarTheme(
              backgroundColor: scheme.primary,
              foregroundColor: scheme.onPrimary,
            ),
            cardTheme: CardThemeData(
              color: scheme.surfaceContainerHighest,
              elevation: 1,
            ),
          ),
          darkTheme: ThemeData(
            textTheme: GoogleFonts.cairoTextTheme(ThemeData.dark().textTheme),
            useMaterial3: true,
            brightness: Brightness.dark,
            scaffoldBackgroundColor: Colors.transparent,
            colorScheme: darkScheme,
            appBarTheme: AppBarTheme(
              backgroundColor: scheme.primary,
              foregroundColor: scheme.onPrimary,
            ),
            cardTheme: CardThemeData(
              color: scheme.surfaceContainerHighest,
              elevation: 1,
            ),
          ),
          themeMode: controller.mode,
          home: HomeScreen(themeController: controller),
          builder: (context, child) => Stack(
            fit: StackFit.expand,
            children: [
              ColoredBox(color: scheme.surface),
              if (controller.backgroundAsset != null)
                Opacity(
                  opacity: 0.5,
                  child: Image.asset(
                    controller.backgroundAsset!,
                    fit: BoxFit.cover,
                  ),
                ),
              child ?? const SizedBox.shrink(),
            ],
          ),
        );
      },
    );
  }
}

typedef EnglishKidsFlutterApp = EnglichKidsFlutterApp;
