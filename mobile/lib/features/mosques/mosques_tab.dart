import 'package:flutter/material.dart';
import '../../core/app_translations.dart';
import '../shared/manara_widgets.dart';

class MosquesTab extends StatelessWidget {
  final String locale;
  final Widget syncBanner;
  final TextEditingController mosqueNameController;
  final TextEditingController mosqueCityController;
  final List<Map<String, dynamic>> cachedMosques;
  final VoidCallback onSave;

  const MosquesTab({
    super.key,
    required this.locale,
    required this.syncBanner,
    required this.mosqueNameController,
    required this.mosqueCityController,
    required this.cachedMosques,
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
            title: _t('newMosque'),
            icon: Icons.mosque,
            accentColor: const Color(0xFF34D399),
            children: [
              TextField(
                controller: mosqueNameController,
                decoration: manaraFieldDecoration(_t('mosqueName')),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: mosqueCityController,
                decoration: manaraFieldDecoration(_t('mosqueCity')),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF059669),
                  foregroundColor: Colors.white,
                  minimumSize: const Size.fromHeight(48),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: onSave,
                icon: const Icon(Icons.add_location_alt),
                label: Text(_t('saveLocal'), style: const TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          if (cachedMosques.isNotEmpty) ...[
            const SizedBox(height: 16),
            ManaraFormCard(
              title: '${_t('cachedMosques')} (${cachedMosques.length})',
              icon: Icons.cloud_done_outlined,
              accentColor: const Color(0xFF10B981),
              children: cachedMosques
                  .map(
                    (m) => Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0F172A),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: Colors.white10),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.mosque, color: Color(0xFF34D399), size: 18),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  (m['name'] ?? '').toString(),
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                                ),
                                if (m['city'] != null)
                                  Text(
                                    m['city'].toString(),
                                    style: const TextStyle(color: Colors.white54, fontSize: 11),
                                  ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                  .toList(),
            ),
          ],
        ],
      ),
    );
  }
}
