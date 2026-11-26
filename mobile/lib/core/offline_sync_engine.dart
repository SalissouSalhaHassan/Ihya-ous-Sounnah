import 'package:hive_flutter/hive_flutter.dart';
import 'package:uuid/uuid.dart';

/// نوع العملية الميدانية
enum SyncAction { insert, update, delete }

/// عنصر طابور المزامنة الدائم في ذاكرة الهاتف
class OutboxItem {
  final String id;
  final String entityType; // MOSQUE, QURAN_PROGRESS, MARRIAGE, DONATION
  final String entityId;
  final SyncAction action;
  final Map<String, dynamic> payload;
  final String idempotencyKey;
  final DateTime createdAt;
  final int version;
  bool isSynced;

  OutboxItem({
    required this.id,
    required this.entityType,
    required this.entityId,
    required this.action,
    required this.payload,
    required this.idempotencyKey,
    required this.createdAt,
    this.version = 1,
    this.isSynced = false,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'entityType': entityType,
      'entityId': entityId,
      'action': action.name,
      'payload': payload,
      'idempotencyKey': idempotencyKey,
      'createdAt': createdAt.toIso8601String(),
      'version': version,
      'isSynced': isSynced,
    };
  }

  factory OutboxItem.fromMap(Map<dynamic, dynamic> map) {
    return OutboxItem(
      id: map['id'] as String,
      entityType: map['entityType'] as String,
      entityId: map['entityId'] as String,
      action: SyncAction.values.firstWhere((e) => e.name == map['action']),
      payload: Map<String, dynamic>.from(map['payload'] as Map),
      idempotencyKey: map['idempotencyKey'] as String,
      createdAt: DateTime.parse(map['createdAt'] as String),
      version: map['version'] as int? ?? 1,
      isSynced: map['isSynced'] as bool? ?? false,
    );
  }
}

/// محرك المزامنة الميداني المقاوم للانقطاع الطويل
class OfflineSyncEngine {
  static const String outboxBoxName = 'manara_outbox_queue';
  static const String sessionBoxName = 'manara_auth_session';
  static const String cacheBoxName = 'manara_server_cache';
  static final _uuid = const Uuid();

  /// تهيئة المحرك وصناديق Hive
  static Future<void> init() async {
    await Hive.initFlutter();
    await Future.wait([
      Hive.openBox(outboxBoxName),
      Hive.openBox(sessionBoxName),
      Hive.openBox(cacheBoxName),
    ]);
  }

  /// معرف جهاز ثابت لكل هاتف يُولد مرة واحدة ويُحفظ محلياً
  static Future<String> getOrCreateDeviceId() async {
    final box = Hive.box(sessionBoxName);
    final existing = box.get('deviceId') as String?;
    if (existing != null && existing.isNotEmpty) return existing;
    final generated = 'DEV_MOB_${_uuid.v4().substring(0, 8).toUpperCase()}';
    await box.put('deviceId', generated);
    return generated;
  }

  /// حفظ جلسة الموظف محلياً للعمل أوفلاين وأونلاين
  static Future<void> saveSession({
    required String accessToken,
    required String userId,
    required String email,
    required String role,
    String? organizationId,
    String? fullName,
  }) async {
    final box = Hive.box(sessionBoxName);
    await box.put('session', {
      'accessToken': accessToken,
      'userId': userId,
      'email': email,
      'role': role,
      'organizationId': organizationId,
      'fullName': fullName ?? '',
    });
  }

  static Map<String, dynamic>? getSession() {
    final box = Hive.box(sessionBoxName);
    final raw = box.get('session');
    if (raw is Map) {
      return Map<String, dynamic>.from(raw);
    }
    return null;
  }

  static Future<void> clearSession() async {
    final box = Hive.box(sessionBoxName);
    await box.delete('session');
  }

  /// حفظ واسترجاع نقطة المزامنة الأخيرة (Checkpoint)
  static Future<void> saveLastSyncCheckpoint(String isoTimestamp) async {
    final box = Hive.box(cacheBoxName);
    await box.put('lastSyncCheckpoint', isoTimestamp);
  }

  static String? getLastSyncCheckpoint() {
    final box = Hive.box(cacheBoxName);
    return box.get('lastSyncCheckpoint') as String?;
  }

  /// حفظ المساجد المحدثة القادمة من السيرفر في الكاش المحلي
  static Future<void> saveCachedMosques(List<dynamic> mosques) async {
    final box = Hive.box(cacheBoxName);
    final existingRaw = box.get('mosques');
    final Map<String, Map<String, dynamic>> byId = {};

    if (existingRaw is List) {
      for (final item in existingRaw) {
        if (item is Map && item['id'] != null) {
          byId[item['id'].toString()] = Map<String, dynamic>.from(item);
        }
      }
    }

    for (final item in mosques) {
      if (item is Map && item['id'] != null) {
        byId[item['id'].toString()] = Map<String, dynamic>.from(item);
      }
    }

    await box.put('mosques', byId.values.toList());
  }

  static List<Map<String, dynamic>> getCachedMosques() {
    final box = Hive.box(cacheBoxName);
    final raw = box.get('mosques');
    if (raw is List) {
      return raw.whereType<Map>().map((m) => Map<String, dynamic>.from(m)).toList();
    }
    return [];
  }

  /// تسجيل عملية ميدانية جديدة في صندوق الحفظ الدائم
  static Future<OutboxItem> recordFieldAction({
    required String entityType,
    required String entityId,
    required SyncAction action,
    required Map<String, dynamic> payload,
    required String staffId,
  }) async {
    final box = Hive.box(outboxBoxName);
    
    // إنشاء مفتاح فريد ضد التكرار (Idempotency Key)
    final idempotencyKey = 'IDEMP_${staffId}_${DateTime.now().microsecondsSinceEpoch}_${_uuid.v4().substring(0, 8)}';
    
    final item = OutboxItem(
      id: _uuid.v4(),
      entityType: entityType,
      entityId: entityId,
      action: action,
      payload: payload,
      idempotencyKey: idempotencyKey,
      createdAt: DateTime.now(),
      version: 1,
      isSynced: false,
    );

    await box.put(item.id, item.toMap());
    return item;
  }

  /// جلب كافة الحركات المعلقة في الميدان
  static List<OutboxItem> getPendingItems() {
    final box = Hive.box(outboxBoxName);
    final items = <OutboxItem>[];
    for (var key in box.keys) {
      final map = box.get(key);
      if (map != null) {
        final item = OutboxItem.fromMap(map);
        if (!item.isSynced) {
          items.add(item);
        }
      }
    }
    return items;
  }

  /// تأكيد مزامنة العناصر التي قبلها الخادم فقط (لمنع فقدان البيانات)
  static Future<int> markItemsSynced(List<String> ids) async {
    final box = Hive.box(outboxBoxName);
    var updated = 0;

    for (final id in ids) {
      final map = box.get(id);
      if (map != null) {
        final item = OutboxItem.fromMap(map);
        if (!item.isSynced) {
          item.isSynced = true;
          await box.put(id, item.toMap());
          updated++;
        }
      }
    }

    return updated;
  }
}
