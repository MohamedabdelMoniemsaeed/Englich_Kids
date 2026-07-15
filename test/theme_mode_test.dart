import 'package:flutter_test/flutter_test.dart';
import 'package:englich_kids/theme/porvider.dart';
import 'package:englich_kids/theme/theme.dart';

void main() {
  group('Mode Provider Tests', () {
    test('Initial mode should be AppTheme.boy', () {
      final mode = Mode();
      expect(mode.selectedTheme, AppTheme.boy);
      expect(mode.backgroundImage, ThemeApp.boyBackground);
      expect(mode.theme, isNotNull);
    });

    test('Setting mode to AppTheme.girl updates values and notifies listeners', () {
      final mode = Mode();
      bool listenerNotified = false;

      mode.addListener(() {
        listenerNotified = true;
      });

      mode.setMode(AppTheme.girl);

      expect(mode.selectedTheme, AppTheme.girl);
      expect(mode.backgroundImage, ThemeApp.girlBackground);
      expect(listenerNotified, true);
    });
  });
}
