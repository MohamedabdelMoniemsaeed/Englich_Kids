import 'package:englich_kids/theme/porvider.dart';
import 'package:englich_kids/theme/theme.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class Settings extends StatefulWidget {
  const Settings({super.key});

  @override
  State<Settings> createState() => _SettingsState();
}

class _SettingsState extends State<Settings> {
  late Mode providerMode;
  String name = 'Theme Colors';

  @override
  Widget build(BuildContext context) {
    providerMode = Provider.of<Mode>(context);

    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      appBar: AppBar(title: const Text("Settings")),
      body: Column(
        children: [
          const Spacer(),
          DropdownMenu(
            label: Text(name),
            width: 300,
            onSelected: (value) {
              if (value != null) {
                providerMode.setMode(value);
              }
            },
            dropdownMenuEntries: const [
              DropdownMenuEntry(value: AppTheme.boy, label: "Blue"),
              DropdownMenuEntry(value: AppTheme.girl, label: "Pink"),
            ],
          ),
        ],
      ),
    );
  }
}
