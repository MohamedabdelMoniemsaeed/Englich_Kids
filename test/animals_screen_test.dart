import 'package:englich_kids/screen/animals/animals_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets(
    'Animals screen should not create nested scaffolds for each animal item',
    (tester) async {
      await tester.pumpWidget(const MaterialApp(home: AnimalsScreen()));

      await tester.pump();

      expect(find.byType(Scaffold), findsOneWidget);
    },
  );
}
