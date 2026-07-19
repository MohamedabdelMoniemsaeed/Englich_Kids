import 'package:englich_kids/screen/widget/screen_home.dart';
import 'package:englich_kids/services/tts_service.dart';
import 'package:englich_kids/theme/provider.dart';
import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:provider/provider.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  MobileAds.instance.initialize();
  TtsService.initialize();

  runApp(
    ChangeNotifierProvider(create: (context) => Mode(), child: const MyApp()),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<Mode>(
      builder: (context, mode, child) {
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          theme: mode.theme,
          home: const SplashVideoScreen(),
        );
      },
    );
  }
}
