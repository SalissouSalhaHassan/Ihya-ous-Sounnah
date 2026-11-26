import 'package:flutter/material.dart';
import '../../core/app_translations.dart';
import '../shared/manara_widgets.dart';

class NikahTab extends StatelessWidget {
  final String locale;
  final Widget syncBanner;
  final TextEditingController groomController;
  final TextEditingController brideController;
  final TextEditingController guardianController;
  final TextEditingController dowryController;
  final List<Map<String, dynamic>> cachedMosques;
  final String? selectedMosqueId;
  final ValueChanged<String?> onMosqueChanged;
  final VoidCallback onSave;

  const NikahTab({
    super.key,
    required this.locale,
    required this.syncBanner,
    required this.groomController,
    required this.brideController,
    required this.guardianController,
    required this.dowryController,
    required this.cachedMosques,
    required this.selectedMosqueId,
    required this.onMosqueChanged,
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
            title: _t('newNikah'),
            icon: Icons.favorite,
            accentColor: const Color(0xFFFB7185),
            children: [
              if (cachedMosques.isNotEmpty) ...[
                DropdownButtonFormField<String>(
                  initialValue: cachedMosques.any((m) => m['id']?.toString() == selectedMosqueId)
                      ? selectedMosqueId
                      : null,
                  decoration: manaraFieldDecoration(_t('mosqueName')),
                  dropdownColor: const Color(0xFF1E293B),
                  items: cachedMosques
                      .map((m) => DropdownMenuItem<String>(
                            value: m['id']?.toString(),
                            child: Text((m['name'] ?? 'مسجد').toString()),
                          ))
                      .toList(),
                  onChanged: onMosqueChanged,
                ),
                const SizedBox(height: 12),
              ],
              TextField(
                controller: groomController,
                decoration: manaraFieldDecoration(_t('groomName')),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: brideController,
                decoration: manaraFieldDecoration(_t('brideName')),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: guardianController,
                decoration: manaraFieldDecoration(_t('guardianName')),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: dowryController,
                keyboardType: TextInputType.number,
                decoration: manaraFieldDecoration(_t('dowryAmount')),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE11D48),
                  foregroundColor: Colors.white,
                  minimumSize: const Size.fromHeight(48),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: onSave,
                icon: const Icon(Icons.verified),
                label: Text(_t('saveLocal'), style: const TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
