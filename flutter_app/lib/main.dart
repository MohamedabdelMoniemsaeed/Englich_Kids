import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'services/tts_service.dart';
import 'screens/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await TtsService.init();
  runApp(const EnglishKidsFlutterApp());
}

class EnglishKidsFlutterApp extends StatelessWidget {
  const EnglishKidsFlutterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'English Kids',
      theme: ThemeData(
        textTheme: GoogleFonts.cairoTextTheme(),
        primarySwatch: Colors.indigo,
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}
