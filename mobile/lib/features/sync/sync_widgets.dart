import 'package:flutter/material.dart';
import '../../core/app_translations.dart';
import '../../core/offline_sync_engine.dart';

class SyncHeaderBanner extends StatelessWidget {
  final String locale;
  final int pendingCount;
  final bool isSyncing;
  final VoidCallback onSync;

  const SyncHeaderBanner({
    super.key,
    required this.locale,
    required this.pendingCount,
    required this.isSyncing,
    required this.onSync,
  });

  String _t(String key) => AppTranslations.get(key, locale);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF064E3B), Color(0xFF0F172A)],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF059669).withValues(alpha: 0.4)),
      ),
      child: Row(
        children: [
          const Icon(Icons.wifi_off, color: Color(0xFF34D399), size: 28),
          const SizedBox(width: 12),
          Expanded(
            child: InkWell(
              onTap: () => showPendingAuditDialog(context, locale),
              borderRadius: BorderRadius.circular(8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _t('offlineMode'),
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                  ),
                  Row(
                    children: [
                      Text(
                        '${_t('pendingOperations')}: $pendingCount',
                        style: const TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                      const SizedBox(width: 6),
                      const Icon(Icons.info_outline, size: 14, color: Color(0xFF34D399)),
                    ],
                  ),
                ],
              ),
            ),
          ),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF059669),
              foregroundColor: Colors.white,
            ),
            onPressed: isSyncing ? null : onSync,
            icon: isSyncing
                ? const SizedBox(
                    width: 14,
                    height: 14,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                  )
                : const Icon(Icons.sync, size: 16),
            label: Text(_t('syncNow'), style: const TextStyle(fontSize: 11)),
          ),
        ],
      ),
    );
  }
}

void showPendingAuditDialog(BuildContext context, [String locale = 'ar']) {
  final pendingItems = OfflineSyncEngine.getPendingItems();
  String t(String key) => AppTranslations.get(key, locale);

  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: const Color(0xFF1E293B),
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (ctx) => Container(
      height: MediaQuery.of(ctx).size.height * 0.7,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.history_toggle_off, color: Color(0xFF34D399)),
                  const SizedBox(width: 8),
                  Text(
                    t('pendingAuditTitle'),
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                ],
              ),
              Text(
                '${pendingItems.length} ${t('pendingAuditOps')}',
                style: const TextStyle(color: Color(0xFF34D399), fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            t('pendingAuditDesc'),
            style: const TextStyle(color: Colors.white60, fontSize: 11),
          ),
          const Divider(color: Colors.white24, height: 24),
          Expanded(
            child: pendingItems.isEmpty
                ? Center(
                    child: Text(
                      t('pendingAuditEmpty'),
                      style: const TextStyle(color: Colors.white70, fontSize: 13),
                    ),
                  )
                : ListView.separated(
                    itemCount: pendingItems.length,
                    separatorBuilder: (_, _) => const SizedBox(height: 8),
                    itemBuilder: (context, index) {
                      final item = pendingItems[index];
                      return Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFF0F172A),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.white12),
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: const Color(0xFF059669).withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Icon(Icons.hourglass_top, color: Color(0xFF34D399), size: 18),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item.entityType,
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    'ID: ${item.idempotencyKey}',
                                    style: const TextStyle(color: Colors.white54, fontSize: 10, fontFamily: 'monospace'),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              t('pendingStatus'),
                              style: const TextStyle(color: Color(0xFFFBBF24), fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    ),
  );
}
