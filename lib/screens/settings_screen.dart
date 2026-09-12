import 'package:flutter/material.dart';
import '../services/theme_controller.dart';

class SettingsScreen extends StatelessWidget {
  final ThemeController themeController;

  const SettingsScreen({super.key, required this.themeController});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('الإعدادات / Settings'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Card(
            child: SwitchListTile(
              secondary: Icon(
                  themeController.isDark ? Icons.dark_mode : Icons.light_mode),
              title: const Text(
                'الوضع الداكن / Dark mode',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Text(
                themeController.isDark
                    ? 'التطبيق يعمل بالوضع الداكن'
                    : 'التطبيق يعمل بالوضع الفاتح',
              ),
              value: themeController.isDark,
              onChanged: (enabled) => themeController.setTheme(
                enabled ? AppTheme.dark : AppTheme.light,
              ),
            ),
          ),
          const SizedBox(height: 18),
          const Text(
            'اختيار شكل التطبيق / Choose a theme',
            style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 10),
          _ThemeChoice(
            title: 'Pink theme / الثيم الوردي',
            icon: Icons.favorite,
            color: Colors.pink,
            selected: themeController.theme == AppTheme.pink,
            onTap: () => themeController.setTheme(AppTheme.pink),
          ),
          _ThemeChoice(
            title: 'Blue theme / الثيم الأزرق',
            icon: Icons.star,
            color: Colors.blue,
            selected: themeController.theme == AppTheme.blue,
            onTap: () => themeController.setTheme(AppTheme.blue),
          ),
          _ThemeChoice(
            title: 'Light theme / الثيم الفاتح',
            icon: Icons.light_mode,
            color: Colors.indigo,
            selected: themeController.theme == AppTheme.light,
            onTap: () => themeController.setTheme(AppTheme.light),
          ),
        ],
      ),
    );
  }
}

class _ThemeChoice extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color color;
  final bool selected;
  final VoidCallback onTap;

  const _ThemeChoice({
    required this.title,
    required this.icon,
    required this.color,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: color.withValues(alpha: 0.5),
          child: Icon(icon, color: color),
        ),
        title: Text(title),
        trailing: selected
            ? Icon(Icons.check_circle, color: color)
            : const Icon(Icons.circle_outlined),
        onTap: onTap,
      ),
    );
  }
}
