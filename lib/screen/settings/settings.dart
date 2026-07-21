import 'package:englich_kids/theme/provider.dart';
import 'package:englich_kids/theme/theme.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shorebird_code_push/shorebird_code_push.dart';
import 'package:restart_app/restart_app.dart';

// Initialize Shorebird Updater
final shorebirdUpdater = ShorebirdUpdater();

class Settings extends StatefulWidget {
  const Settings({super.key});

  @override
  State<Settings> createState() => _SettingsState();
}

class _SettingsState extends State<Settings> {
  late Mode providerMode;
  String name = 'Theme Colors';
  bool _isCheckingForUpdates = false;
  String _buttonText = "Check for Updates";

  void _updateButtonText(String message, {bool resetAfter = false}) {
    if (!mounted) return;
    setState(() {
      _buttonText = message;
    });
    
    if (resetAfter) {
      Future.delayed(const Duration(seconds: 4), () {
        if (mounted) {
          setState(() {
            _buttonText = "Check for Updates";
          });
        }
      });
    }
  }

  Future<void> _checkForUpdates() async {
    setState(() {
      _isCheckingForUpdates = true;
    });
    _updateButtonText("Checking...");

    try {
      // 1. Check for update status
      final status = await shorebirdUpdater.checkForUpdate();

      if (!mounted) return;

      if (status == UpdateStatus.outdated) {
        _updateButtonText("Downloading...");

        // 3. Download the patch
        await shorebirdUpdater.update();

        if (!mounted) return;

        // 4. Force Strong Automatic Restart immediately
        _updateButtonText("Restarting...");
        await Future.delayed(const Duration(seconds: 1));
        await Restart.restartApp();
      } else if (status == UpdateStatus.restartRequired) {
        // If already downloaded, just restart strongly
        _updateButtonText("Restarting...");
        await Future.delayed(const Duration(milliseconds: 500));
        await Restart.restartApp();
      } else {
        _updateButtonText("Up to Date", resetAfter: true);
      }
    } catch (e) {
      _updateButtonText("Error: Try Again", resetAfter: true);
    } finally {
      if (mounted) {
        setState(() {
          _isCheckingForUpdates = false;
        });
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
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const Spacer(),
            // خيار الألوان تم نقله للأسفل
            Center(
              child: DropdownMenu(
                label: Text(name),
                width: MediaQuery.of(context).size.width * 0.85,
                onSelected: (value) {
                  if (value != null) {
                    providerMode.setMode(value);
                  }
                },
                dropdownMenuEntries: const [
                  DropdownMenuEntry(value: AppTheme.boy, label: "Blue (Boys)"),
                  DropdownMenuEntry(value: AppTheme.girl, label: "Pink (Girls)"),
                  DropdownMenuEntry(value: AppTheme.orange, label: "Orange"),
                ],
              ),
            ),
            const SizedBox(height: 20),
            // زر التحديث أصبح ذكياً الآن
            SizedBox(
              width: MediaQuery.of(context).size.width * 0.85,
              child: ElevatedButton.icon(
                onPressed: _isCheckingForUpdates ? null : _checkForUpdates,
                icon: _isCheckingForUpdates 
                  ? const SizedBox(
                      width: 20, 
                      height: 20, 
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)
                    )
                  : const Icon(Icons.system_update, color: Colors.white),
                label: Text(
                  _buttonText,
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).dividerColor,
                  padding: const EdgeInsets.symmetric(vertical: 15),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  elevation: 5,
                ),
              ),
            ),
            const SizedBox(height: 20),
            // رقم الإصدار فقط في الأسفل
            const Text(
              "Version 1.0.0",
              style: TextStyle(color: Colors.black54, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }
}
