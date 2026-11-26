import 'package:flutter/material.dart';
import '../../core/app_translations.dart';
import '../shared/manara_widgets.dart';

class NikahTab extends StatelessWidget {
  final String locale;
  final Widget syncBanner;
  final TextEditingController groomController;
  final TextEditingController groomRepController;
  final TextEditingController brideController;
  final TextEditingController guardianController;
  final TextEditingController dowryController;
  final TextEditingController witness1Controller;
  final TextEditingController witness2Controller;
  final TextEditingController contractDateController;
  final TextEditingController imamNameController;
  final String brideMaritalStatus;
  final ValueChanged<String> onMaritalStatusChanged;
  final List<Map<String, dynamic>> cachedMosques;
  final String? selectedMosqueId;
  final ValueChanged<String?> onMosqueChanged;
  final VoidCallback onSave;

  const NikahTab({
    super.key,
    required this.locale,
    required this.syncBanner,
    required this.groomController,
    required this.groomRepController,
    required this.brideController,
    required this.guardianController,
    required this.dowryController,
    required this.witness1Controller,
    required this.witness2Controller,
    required this.contractDateController,
    required this.imamNameController,
    required this.brideMaritalStatus,
    required this.onMaritalStatusChanged,
    required this.cachedMosques,
    required this.selectedMosqueId,
    required this.onMosqueChanged,
    required this.onSave,
  });

  String _t(String key) => AppTranslations.get(key, locale);

  @override
  Widget build(BuildContext context) {
    final statusOptions = [
      ('CELIBATAIRE', _t('statusVirgin')),
      ('DIVORCEE', _t('statusDivorced')),
      ('VEUVE', _t('statusWidow')),
    ];

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
              // 1. اسم الزوج
              TextField(
                controller: groomController,
                decoration: manaraFieldDecoration('${_t('groomName')} *'),
              ),
              const SizedBox(height: 12),
              // 2. اسم الزوجة
              TextField(
                controller: brideController,
                decoration: manaraFieldDecoration('${_t('brideName')} *'),
              ),
              const SizedBox(height: 12),
              // 3. اسم وكيل الزوج
              TextField(
                controller: groomRepController,
                decoration: manaraFieldDecoration(_t('groomRep')),
              ),
              const SizedBox(height: 12),
              // 4. اسم ولي الزوجة
              TextField(
                controller: guardianController,
                decoration: manaraFieldDecoration('${_t('guardianName')} *'),
              ),
              const SizedBox(height: 12),
              // 5. الصداق
              TextField(
                controller: dowryController,
                keyboardType: TextInputType.number,
                decoration: manaraFieldDecoration(_t('dowryAmount')),
              ),
              const SizedBox(height: 12),
              // 6. الشهود
              Text(
                _t('witnesses'),
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white70),
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: witness1Controller,
                      decoration: manaraFieldDecoration(_t('witness1')),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      controller: witness2Controller,
                      decoration: manaraFieldDecoration(_t('witness2')),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              // 7. مكان العقد : مسجد
              if (cachedMosques.isNotEmpty) ...[
                DropdownButtonFormField<String>(
                  initialValue: cachedMosques.any((m) => m['id']?.toString() == selectedMosqueId)
                      ? selectedMosqueId
                      : null,
                  decoration: manaraFieldDecoration(_t('mosquePlace')),
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
              // 8. تاريخ العقد
              TextField(
                controller: contractDateController,
                readOnly: true,
                onTap: () async {
                  final now = DateTime.now();
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: DateTime.tryParse(contractDateController.text) ?? now,
                    firstDate: DateTime(2020),
                    lastDate: DateTime(2035),
                  );
                  if (picked != null) {
                    contractDateController.text = picked.toIso8601String().split('T')[0];
                  }
                },
                decoration: manaraFieldDecoration(_t('contractDate')).copyWith(
                  suffixIcon: const Icon(Icons.calendar_today, size: 18),
                ),
              ),
              const SizedBox(height: 12),
              // 9. حالة الزوجة (البكر / الثيب / أرملة)
              Text(
                _t('maritalStatus'),
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white70),
              ),
              const SizedBox(height: 6),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: statusOptions.map((opt) {
                  final selected = brideMaritalStatus == opt.$1;
                  return ChoiceChip(
                    label: Text(opt.$2, style: const TextStyle(fontSize: 12)),
                    selected: selected,
                    selectedColor: const Color(0xFFE11D48).withValues(alpha: 0.25),
                    checkmarkColor: const Color(0xFFFB7185),
                    side: BorderSide(
                      color: selected ? const Color(0xFFE11D48) : Colors.white12,
                    ),
                    onSelected: (_) => onMaritalStatusChanged(opt.$1),
                  );
                }).toList(),
              ),
              const SizedBox(height: 12),
              // 10. ختم وتوقيع الإمام
              TextField(
                controller: imamNameController,
                decoration: manaraFieldDecoration(_t('imamSign')),
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
