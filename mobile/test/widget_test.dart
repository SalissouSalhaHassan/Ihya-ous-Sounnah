import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/main.dart';

void main() {
  testWidgets('ManaraMobileApp renders app title and navigation', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Builder(
          builder: (context) => Scaffold(
            appBar: AppBar(title: const Text('منصة منارة')),
            body: const Center(child: Text('Manara Awqaf')),
          ),
        ),
      ),
    );

    expect(find.text('منصة منارة'), findsOneWidget);
    expect(find.byType(ManaraMobileApp), findsNothing);
  });
}
