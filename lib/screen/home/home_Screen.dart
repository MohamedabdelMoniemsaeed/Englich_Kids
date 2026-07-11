import 'package:englich_kids/models/numbers/image_number.dart';
import 'package:englich_kids/screen/abc/abc.dart';
import 'package:englich_kids/screen/colors/colors_Screen.dart';
import 'package:englich_kids/screen/family/family_screen.dart';
import 'package:englich_kids/screen/numbers/numbers_Screen.dart';
import 'package:englich_kids/screen/settings/settings.dart';
import 'package:englich_kids/screen/widget/home_icon.dart';
import 'package:englich_kids/screen/animals/animals_screen.dart';
import 'package:englich_kids/services/internet_service.dart';
import 'package:englich_kids/theme/porvider.dart';
import 'package:englich_kids/widgets/home_banner_ad.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      checkInternet();
    });
  }

  Future<void> checkInternet() async {
    bool connected = await InternetService.hasInternet();

    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          connected ? '✅ Connected to Internet' : '❌ No Internet Connection',
        ),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final List<TapRow> item = [
      TapRow(
        name: 'Numbers',
        image: ImageNumber.backgroundimage,
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const NumbersScreen()),
          );
        },
      ),
      TapRow(
        name: 'Family',
        image: 'assets/images/family_members/backgroundimage.jpg',
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const FamilyScreen()),
          );
        },
      ),
      TapRow(
        name: 'Animals',
        image: 'assets/images/animals/animalshome.jpg',
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AnimalsScreen()),
          );
        },
      ),
      TapRow(
        name: 'Colors',
        image: 'assets/images/colors/backgroundimage.jpg',
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const ColorsScreen()),
          );
        },
      ),
      TapRow(
        name: 'A B C',
        image: 'assets/images/abc/backgroundimage.jpg',
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AbcScreen()),
          );
        },
      ),
    ];

    final mode = Provider.of<Mode>(context);

    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      appBar: AppBar(title: const Text("English Kids")),
      body: Stack(
        children: [
          Positioned.fill(
            child: Image.asset(mode.backgroundImage, fit: BoxFit.cover),
          ),
          Positioned.fill(
            child: Container(
              color: Theme.of(context).primaryColor.withAlpha(166),
            ),
          ),
          Column(
            children: [
              Expanded(
                child: GridView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: item.length,
                  itemBuilder: (context, index) => item[index],
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                  ),
                ),
              ),
              const HomeBannerAd(),
            ],
          ),
        ],
      ),
      drawer: Drawer(
        backgroundColor: Theme.of(context).primaryColor,
        child: const Settings(),
      ),
    );
  }
}
