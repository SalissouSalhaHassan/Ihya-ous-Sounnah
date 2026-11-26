import 'package:flutter/material.dart';
import '../../core/app_translations.dart';
import '../shared/manara_widgets.dart';

void showFuneralQuickDialog({
  required BuildContext context,
  required String locale,
  required TextEditingController deceasedNameController,
  required TextEditingController prayerTimeController,
  required VoidCallback onSubmit,
}) {
  String t(String key) => AppTranslations.get(key, locale);

  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: const Color(0xFF1E293B),
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (ctx) => Padding(
      padding: EdgeInsets.only(
        left: 16,
        right: 16,
        top: 20,
        bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              const Icon(Icons.notifications_active, color: Color(0xFFA855F7)),
              const SizedBox(width: 8),
              Text(
                t('newFuneral'),
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ],
          ),
          const SizedBox(height: 16),
          TextField(
            controller: deceasedNameController,
            decoration: manaraFieldDecoration(t('deceasedName')),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: prayerTimeController,
            decoration: manaraFieldDecoration(t('prayerTime')),
          ),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF9333EA),
              foregroundColor: Colors.white,
              minimumSize: const Size.fromHeight(48),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () {
              Navigator.pop(ctx);
              onSubmit();
            },
            icon: const Icon(Icons.campaign),
            label: Text(t('saveLocal'), style: const TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    ),
  );
}
