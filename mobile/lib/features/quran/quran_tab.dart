import 'package:flutter/material.dart';
import '../../core/app_translations.dart';
import '../shared/manara_widgets.dart';

class QuranTab extends StatelessWidget {
  final String locale;
  final Widget syncBanner;
  final TextEditingController studentController;
  final TextEditingController surahController;
  final VoidCallback onSave;

  const QuranTab({
    super.key,
    required this.locale,
    required this.syncBanner,
    required this.studentController,
    required this.surahController,
    required this.onSave,
  });

  String _t(String key) => AppTranslations.get(key, locale);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          syncBanner,
          const SizedBox(height: 16),
          ManaraFormCard(
            title: _t('recordAttendance'),
            icon: Icons.menu_book,
            accentColor: const Color(0xFF2DD4BF),
            children: [
              TextField(
                controller: studentController,
                decoration: manaraFieldDecoration(_t('studentName')),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: surahController,
                decoration: manaraFieldDecoration(_t('surahName')),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0D9488),
                  foregroundColor: Colors.white,
                  minimumSize: const Size.fromHeight(48),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: onSave,
                icon: const Icon(Icons.save),
                label: Text(_t('saveLocal'), style: const TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
