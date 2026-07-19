import 'package:englich_kids/theme/porvider.dart';
import 'package:englich_kids/theme/theme.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

class Settings extends StatefulWidget {
  const Settings({super.key});

  @override
  State<Settings> createState() => _SettingsState();
}

class _SettingsState extends State<Settings> {
  late Mode providerMode;
  String name = 'Theme Colors';

  // رابط مستودع المشروع على جيت هاب لتحميل أحدث APK
  final String githubUrl = "https://github.com/MohamedabdelMoniemsaeed/Englich_Kids/releases/latest";

  Future<void> _launchUpdateUrl() async {
    final Uri url = Uri.parse(githubUrl);
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not open update link')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    providerMode = Provider.of<Mode>(context);

    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      appBar: AppBar(title: const Text("Settings")),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            const SizedBox(height: 50),
            Center(
              child: DropdownMenu(
                label: Text(name),
                width: MediaQuery.of(context).size.width * 0.8,
                onSelected: (value) {
                  if (value != null) {
                    providerMode.setMode(value);
                  }
                },
                dropdownMenuEntries: const [
                  DropdownMenuEntry(value: AppTheme.boy, label: "Blue (Boys)"),
                  DropdownMenuEntry(value: AppTheme.girl, label: "Pink (Girls)"),
                ],
              ),
            ),
            const Spacer(),
            // زر التحديث الجديد في الأسفل
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: _launchUpdateUrl,
                icon: const Icon(Icons.system_update, color: Colors.white),
                label: const Text(
                  "Check for Updates",
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).hoverColor,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              "Version 1.0.0",
              style: TextStyle(color: Colors.black54, fontWeight: FontWeight.w500),
            ),
          ],
        ),
      ),
    );
  }
}
