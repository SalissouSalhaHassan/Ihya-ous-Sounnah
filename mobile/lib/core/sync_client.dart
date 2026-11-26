import 'dart:convert';
import 'package:http/http.dart' as http;
import 'offline_sync_engine.dart';

/// عميل المزامنة الحقيقي بين الجوال وخادم منصة منارة
class ManaraSyncClient {
  final String serverBaseUrl;
  final String deviceId;
  final String staffId;
  final String organizationId;
  final String accessToken;

  ManaraSyncClient({
    required this.serverBaseUrl,
    required this.deviceId,
    required this.staffId,
    required this.organizationId,
    required this.accessToken,
  });

  /// تسجيل الدخول عبر خادم منارة وحفظ التوكن في Hive
  static Future<Map<String, dynamic>> login({
    required String serverBaseUrl,
    required String email,
    required String password,
  }) async {
    final url = Uri.parse('$serverBaseUrl/api/auth/login');
    final response = await http
        .post(
          url,
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'email': email.trim(), 'password': password}),
        )
        .timeout(const Duration(seconds: 15));

    final data = jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode != 200 || data['accessToken'] == null) {
      throw Exception(data['error'] ?? 'فشل تسجيل الدخول (${response.statusCode})');
    }

    final user = (data['user'] as Map?)?.cast<String, dynamic>() ?? {};
    await OfflineSyncEngine.saveSession(
      accessToken: data['accessToken'] as String,
      userId: (user['id'] ?? '').toString(),
      email: (user['email'] ?? email).toString(),
      role: (user['role'] ?? 'VIEWER').toString(),
      organizationId: user['organizationId']?.toString(),
      fullName: user['fullName']?.toString(),
    );

    return data;
  }

  /// إرسال حزم الحركات المعلقة واستقبال الدلتا من السيرفر
  Future<Map<String, dynamic>> pushPendingAndPullDelta() async {
    final pendingItems = OfflineSyncEngine.getPendingItems();
    final lastCheckpoint = OfflineSyncEngine.getLastSyncCheckpoint();

    final payload = {
      'deviceId': deviceId,
      'staffId': staffId,
      if (organizationId.isNotEmpty) 'organizationId': organizationId,
      'lastSyncCheckpoint': ?lastCheckpoint,
      'batch': pendingItems.map((item) => item.toMap()).toList(),
    };

    final url = Uri.parse('$serverBaseUrl/api/sync/delta');
    final response = await http
        .post(
          url,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $accessToken',
          },
          body: jsonEncode(payload),
        )
        .timeout(const Duration(seconds: 15));

    if (response.statusCode == 401 || response.statusCode == 403) {
      throw Exception('UNAUTHORIZED');
    }

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as Map<String, dynamic>;
      final processedIds = (data['processedIds'] as List?)?.cast<String>() ?? [];

      // تحديث حالة العناصر المؤكدة من السيرفر فقط
      if (processedIds.isNotEmpty) {
        await OfflineSyncEngine.markItemsSynced(processedIds);
      }

      // حفظ نقطة المزامنة الجديدة وبيانات المساجد الواردة من الخادم
      final newCheckpoint = data['newCheckpoint'] as String?;
      if (newCheckpoint != null && newCheckpoint.isNotEmpty) {
        await OfflineSyncEngine.saveLastSyncCheckpoint(newCheckpoint);
      }

      final serverDelta = data['serverDelta'];
      if (serverDelta is Map && serverDelta['updatedMosques'] is List) {
        await OfflineSyncEngine.saveCachedMosques(
          serverDelta['updatedMosques'] as List<dynamic>,
        );
      }

      if (pendingItems.isEmpty && processedIds.isEmpty) {
        return {
          ...data,
          'status': 'NOOP_PULLED',
        };
      }

      return data;
    } else {
      throw Exception('فشل الاتصال بخادم المزامنة: ${response.statusCode}');
    }
  }
}
