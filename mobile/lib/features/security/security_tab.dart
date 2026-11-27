import 'package:flutter/material.dart';
import '../../core/app_translations.dart';
import '../shared/manara_widgets.dart';

class SecurityTab extends StatelessWidget {
  final String locale;
  final Widget syncBanner;
  final TextEditingController plateController;
  final VoidCallback onSave;

  const SecurityTab({
    super.key,
    required this.locale,
    required this.syncBanner,
    required this.plateController,
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
            title: _t('securityTitle'),
            icon: Icons.security,
            accentColor: const Color(0xFF60A5FA),
            children: [
              TextField(
                controller: plateController,
                decoration: manaraFieldDecoration(
                  _t('plateNumber'),
                  hintText: _t('plateHint'),
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2563EB),
                  foregroundColor: Colors.white,
                  minimumSize: const Size.fromHeight(48),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: onSave,
                icon: const Icon(Icons.qr_code_scanner),
                label: Text(
                  _t('saveSecurityOffline'),
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
