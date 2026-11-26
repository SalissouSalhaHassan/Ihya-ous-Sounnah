import 'package:flutter/material.dart';
import '../../core/app_translations.dart';
import '../shared/manara_widgets.dart';

class FatwaTab extends StatelessWidget {
  final String locale;
  final Widget syncBanner;
  final TextEditingController questionController;
  final VoidCallback onSave;

  const FatwaTab({
    super.key,
    required this.locale,
    required this.syncBanner,
    required this.questionController,
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
            title: _t('newFatwa'),
            icon: Icons.school,
            accentColor: const Color(0xFFFBBF24),
            children: [
              TextField(
                controller: questionController,
                maxLines: 4,
                decoration: manaraFieldDecoration(_t('questionText')),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFD97706),
                  foregroundColor: Colors.white,
                  minimumSize: const Size.fromHeight(48),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: onSave,
                icon: const Icon(Icons.send),
                label: Text(_t('saveLocal'), style: const TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
