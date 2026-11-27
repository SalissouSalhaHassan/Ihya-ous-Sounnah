import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';
import 'core/app_config.dart';
import 'core/app_translations.dart';
import 'core/offline_sync_engine.dart';
import 'core/sync_client.dart';
import 'features/auth/login_screen.dart';
import 'features/fatwa/fatwa_tab.dart';
import 'features/funerals/funeral_sheet.dart';
import 'features/mosques/mosques_tab.dart';
import 'features/nikah/nikah_tab.dart';
import 'features/quran/quran_tab.dart';
import 'features/security/security_tab.dart';
import 'features/shared/manara_widgets.dart';
import 'features/sync/sync_widgets.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await OfflineSyncEngine.init();
  runApp(const ManaraMobileApp());
}

class ManaraMobileApp extends StatefulWidget {
  const ManaraMobileApp({super.key});

  @override
  State<ManaraMobileApp> createState() => _ManaraMobileAppState();
}

class _ManaraMobileAppState extends State<ManaraMobileApp> {
  String _locale = 'ar';
  Map<String, dynamic>? _session;

  @override
  void initState() {
    super.initState();
    _session = OfflineSyncEngine.getSession();
  }

  void _changeLocale(String lang) => setState(() => _locale = lang);

  void _onAuthenticated() {
    setState(() => _session = OfflineSyncEngine.getSession());
  }

  Future<void> _onLogout() async {
    await OfflineSyncEngine.clearSession();
    setState(() => _session = null);
  }

  @override
  Widget build(BuildContext context) {
    final isRtl = _locale == 'ar';

    return Directionality(
      textDirection: isRtl ? TextDirection.rtl : TextDirection.ltr,
      child: MaterialApp(
        title: "Ihya'ous Sounnah",
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          brightness: Brightness.dark,
          scaffoldBackgroundColor: const Color(0xFF0F172A),
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF059669),
            brightness: Brightness.dark,
          ),
          useMaterial3: true,
        ),
        home: _session == null
            ? LoginScreen(
                currentLocale: _locale,
                onLocaleChanged: _changeLocale,
                onLoginSuccess: _onAuthenticated,
              )
            : HomeScreen(
                currentLocale: _locale,
                onLocaleChanged: _changeLocale,
                session: _session!,
                onLogout: _onLogout,
              ),
      ),
    );
  }
}

class HomeScreen extends StatefulWidget {
  final String currentLocale;
  final ValueChanged<String> onLocaleChanged;
  final Map<String, dynamic> session;
  final Future<void> Function() onLogout;

  const HomeScreen({
    super.key,
    required this.currentLocale,
    required this.onLocaleChanged,
    required this.session,
    required this.onLogout,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  int _pendingCount = 0;
  bool _isSyncing = false;
  List<Map<String, dynamic>> _cachedMosques = [];
  String? _selectedMosqueId;

  final _studentController = TextEditingController();
  final _surahController = TextEditingController();
  final _groomController = TextEditingController();
  final _groomRepController = TextEditingController();
  final _brideController = TextEditingController();
  final _guardianController = TextEditingController();
  final _dowryController = TextEditingController(text: '150000');
  final _witness1Controller = TextEditingController();
  final _witness2Controller = TextEditingController();
  final _contractDateController = TextEditingController(
    text: DateTime.now().toIso8601String().split('T')[0],
  );
  final _imamNameController = TextEditingController();
  String _brideMaritalStatus = 'CELIBATAIRE';
  final _mosqueNameController = TextEditingController();
  final _mosqueCityController = TextEditingController();
  final _plateController = TextEditingController();
  final _deceasedNameController = TextEditingController();
  final _prayerTimeController = TextEditingController(text: 'بعد صلاة الظهر');
  final _questionController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _refreshLocalState();
  }

  @override
  void dispose() {
    _studentController.dispose();
    _surahController.dispose();
    _groomController.dispose();
    _groomRepController.dispose();
    _brideController.dispose();
    _guardianController.dispose();
    _dowryController.dispose();
    _witness1Controller.dispose();
    _witness2Controller.dispose();
    _contractDateController.dispose();
    _imamNameController.dispose();
    _mosqueNameController.dispose();
    _mosqueCityController.dispose();
    _plateController.dispose();
    _deceasedNameController.dispose();
    _prayerTimeController.dispose();
    _questionController.dispose();
    super.dispose();
  }

  String get _staffId => (widget.session['userId'] ?? 'STAFF_MOBILE').toString();

  String _t(String key) => AppTranslations.get(key, widget.currentLocale);

  void _refreshLocalState() {
    final mosques = OfflineSyncEngine.getCachedMosques();
    setState(() {
      _pendingCount = OfflineSyncEngine.getPendingItems().length;
      _cachedMosques = mosques;
      if (_selectedMosqueId == null && mosques.isNotEmpty) {
        _selectedMosqueId = mosques.first['id']?.toString();
      }
    });
  }

  void _showNotification(String message, {Color color = const Color(0xFF059669)}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: color,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        content: Text(message, style: const TextStyle(fontWeight: FontWeight.bold)),
      ),
    );
  }

  Future<void> _triggerSync() async {
    setState(() => _isSyncing = true);
    try {
      final deviceId = await OfflineSyncEngine.getOrCreateDeviceId();
      final client = ManaraSyncClient(
        serverBaseUrl: AppConfig.apiBaseUrl,
        deviceId: deviceId,
        staffId: _staffId,
        organizationId: (widget.session['organizationId'] ?? '').toString(),
        accessToken: (widget.session['accessToken'] ?? '').toString(),
      );

      final result = await client.pushPendingAndPullDelta();
      _refreshLocalState();
      if (result['status'] == 'NOOP_PULLED') {
        _showNotification(
          '${_t('noPendingSync')} (${_t('cachedMosques')}: ${_cachedMosques.length})',
          color: const Color(0xFF475569),
        );
        return;
      }

      final processedCount = (result['processedIds'] as List?)?.length ?? 0;
      _showNotification('${_t('syncSuccess')} ($processedCount)');
    } catch (e) {
      _refreshLocalState();
      if (e.toString().contains('UNAUTHORIZED')) {
        _showNotification(_t('sessionExpired'), color: const Color(0xFFDC2626));
        await widget.onLogout();
      } else {
        _showNotification(_t('syncFailed'), color: const Color(0xFFD97706));
      }
    } finally {
      if (mounted) setState(() => _isSyncing = false);
    }
  }

  Future<void> _recordQuranProgress() async {
    if (_studentController.text.trim().isEmpty) return;
    await OfflineSyncEngine.recordFieldAction(
      entityType: 'QURAN_PROGRESS',
      entityId: const Uuid().v4(),
      action: SyncAction.insert,
      payload: {
        'studentName': _studentController.text.trim(),
        'surahName': _surahController.text.trim().isEmpty
            ? 'سورة البقرة'
            : _surahController.text.trim(),
        'score': 'EXCELLENT',
        'date': DateTime.now().toIso8601String(),
      },
      staffId: _staffId,
    );
    _studentController.clear();
    _refreshLocalState();
    _showNotification(_t('saveLocal'));
  }

  Future<void> _recordNikah() async {
    if (_groomController.text.trim().isEmpty || _brideController.text.trim().isEmpty) return;

    final statusLabels = {
      'CELIBATAIRE': 'البكر / Célibataire',
      'DIVORCEE': 'الثيب / Divorcée',
      'VEUVE': 'أرملة / Veuve',
    };
    final notesParts = <String>[
      if (_groomRepController.text.trim().isNotEmpty)
        'وكيل الزوج: ${_groomRepController.text.trim()}',
      'حالة الزوجة: ${statusLabels[_brideMaritalStatus] ?? _brideMaritalStatus}',
    ];

    await OfflineSyncEngine.recordFieldAction(
      entityType: 'MARRIAGE',
      entityId: const Uuid().v4(),
      action: SyncAction.insert,
      payload: {
        'mosqueId': ?_selectedMosqueId,
        'contractNumber': 'NIKAH-MOB-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
        'groomFullName': _groomController.text.trim(),
        'brideFullName': _brideController.text.trim(),
        'guardianName': _guardianController.text.trim().isEmpty
            ? 'الوالد'
            : _guardianController.text.trim(),
        'witness1Name': _witness1Controller.text.trim().isEmpty
            ? 'الشاهد الأول'
            : _witness1Controller.text.trim(),
        'witness2Name': _witness2Controller.text.trim().isEmpty
            ? 'الشاهد الثاني'
            : _witness2Controller.text.trim(),
        'dowryAmount': double.tryParse(_dowryController.text.trim()) ?? 150000,
        'dowryStatus': 'PAID',
        'dowryNotes': notesParts.join(' | '),
        'contractDate': _contractDateController.text.trim().isEmpty
            ? DateTime.now().toIso8601String().split('T')[0]
            : _contractDateController.text.trim(),
        if (_imamNameController.text.trim().isNotEmpty)
          'imamName': _imamNameController.text.trim(),
      },
      staffId: _staffId,
    );
    _groomController.clear();
    _groomRepController.clear();
    _brideController.clear();
    _guardianController.clear();
    _witness1Controller.clear();
    _witness2Controller.clear();
    _imamNameController.clear();
    setState(() => _brideMaritalStatus = 'CELIBATAIRE');
    _refreshLocalState();
    _showNotification(_t('saveLocal'), color: const Color(0xFFE11D48));
  }

  Future<void> _recordMosque() async {
    if (_mosqueNameController.text.trim().isEmpty) return;
    await OfflineSyncEngine.recordFieldAction(
      entityType: 'MOSQUE',
      entityId: const Uuid().v4(),
      action: SyncAction.insert,
      payload: {
        'name': _mosqueNameController.text.trim(),
        'city': _mosqueCityController.text.trim().isEmpty
            ? 'النيجر'
            : _mosqueCityController.text.trim(),
        'type': 'JUMA',
        'capacity': 150,
      },
      staffId: _staffId,
    );
    _mosqueNameController.clear();
    _mosqueCityController.clear();
    _refreshLocalState();
    _showNotification(_t('saveLocal'), color: const Color(0xFF10B981));
  }

  Future<void> _recordSecurity() async {
    if (_plateController.text.trim().isEmpty) return;
    await OfflineSyncEngine.recordFieldAction(
      entityType: 'SECURITY_GATE',
      entityId: const Uuid().v4(),
      action: SyncAction.insert,
      payload: {
        'plateNumber': _plateController.text.trim(),
        'entryTime': DateTime.now().toIso8601String(),
        'status': 'PARKED',
      },
      staffId: _staffId,
    );
    _plateController.clear();
    _refreshLocalState();
    _showNotification(_t('saveLocal'), color: const Color(0xFF2563EB));
  }

  Future<void> _recordFuneral() async {
    if (_deceasedNameController.text.trim().isEmpty) return;
    await OfflineSyncEngine.recordFieldAction(
      entityType: 'FUNERAL',
      entityId: const Uuid().v4(),
      action: SyncAction.insert,
      payload: {
        'deceasedName': _deceasedNameController.text.trim(),
        'prayerTime': _prayerTimeController.text.trim(),
        'status': 'SCHEDULED',
      },
      staffId: _staffId,
    );
    _deceasedNameController.clear();
    _refreshLocalState();
    _showNotification(_t('saveLocal'), color: const Color(0xFF9333EA));
  }

  Future<void> _recordFatwa() async {
    if (_questionController.text.trim().isEmpty) return;
    await OfflineSyncEngine.recordFieldAction(
      entityType: 'FATWA_QUESTION',
      entityId: const Uuid().v4(),
      action: SyncAction.insert,
      payload: {
        'refCode': 'FATWA-MOB-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}',
        'question': _questionController.text.trim(),
        'date': DateTime.now().toIso8601String().split('T')[0],
      },
      staffId: _staffId,
    );
    _questionController.clear();
    _refreshLocalState();
    _showNotification(_t('saveLocal'), color: const Color(0xFFD97706));
  }

  Widget _buildSyncBanner() {
    return SyncHeaderBanner(
      locale: widget.currentLocale,
      pendingCount: _pendingCount,
      isSyncing: _isSyncing,
      onSync: _triggerSync,
    );
  }

  Widget _buildHomeDashboardView() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _buildSyncBanner(),
          const SizedBox(height: 20),
          Text(
            _t('fieldSectors'),
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 12),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.25,
            children: [
              ManaraNavCard(
                title: _t('quranTitle'),
                subtitle: _t('subQuran'),
                icon: Icons.menu_book,
                color: const Color(0xFF2DD4BF),
                onTap: () => setState(() => _currentIndex = 1),
              ),
              ManaraNavCard(
                title: _t('nikahTitle'),
                subtitle: _t('subNikah'),
                icon: Icons.favorite,
                color: const Color(0xFFFB7185),
                onTap: () => setState(() => _currentIndex = 2),
              ),
              ManaraNavCard(
                title: _t('mosquesTitle'),
                subtitle: _t('subMosques'),
                icon: Icons.mosque,
                color: const Color(0xFF34D399),
                onTap: () => setState(() => _currentIndex = 3),
              ),
              ManaraNavCard(
                title: _t('securityTitle'),
                subtitle: _t('subSecurity'),
                icon: Icons.security,
                color: const Color(0xFF60A5FA),
                onTap: () => setState(() => _currentIndex = 4),
              ),
              ManaraNavCard(
                title: _t('funeralsTitle'),
                subtitle: _t('subFunerals'),
                icon: Icons.notifications_active,
                color: const Color(0xFFA855F7),
                onTap: () => showFuneralQuickDialog(
                  context: context,
                  locale: widget.currentLocale,
                  deceasedNameController: _deceasedNameController,
                  prayerTimeController: _prayerTimeController,
                  onSubmit: _recordFuneral,
                ),
              ),
              ManaraNavCard(
                title: _t('fatwaTitle'),
                subtitle: _t('subFatwa'),
                icon: Icons.school,
                color: const Color(0xFFFBBF24),
                onTap: () => setState(() => _currentIndex = 5),
              ),
            ],
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final banner = _buildSyncBanner();
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
        title: Row(
          children: [
            Container(
              width: 34,
              height: 34,
              padding: const EdgeInsets.all(2),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(6),
                child: Image.asset('assets/images/logo.jpg', fit: BoxFit.contain),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Ihya'ous Sounnah",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17),
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    _t('tagline'),
                    style: const TextStyle(fontSize: 11, color: Colors.white70),
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.language, color: Color(0xFF10B981)),
            onSelected: widget.onLocaleChanged,
            itemBuilder: (context) => const [
              PopupMenuItem(value: 'ar', child: Text('العربية (RTL)')),
              PopupMenuItem(value: 'fr', child: Text('Français (LTR)')),
              PopupMenuItem(value: 'ha', child: Text('Harshen Hausa (LTR)')),
            ],
          ),
          IconButton(
            tooltip: _t('logout'),
            icon: const Icon(Icons.logout, color: Colors.white70),
            onPressed: widget.onLogout,
          ),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) => setState(() => _currentIndex = index),
        backgroundColor: const Color(0xFF0F172A),
        indicatorColor: const Color(0xFF059669).withValues(alpha: 0.3),
        destinations: [
          NavigationDestination(
            icon: const Icon(Icons.dashboard_outlined),
            selectedIcon: const Icon(Icons.dashboard, color: Color(0xFF10B981)),
            label: _t('navHome'),
          ),
          NavigationDestination(
            icon: const Icon(Icons.menu_book_outlined),
            selectedIcon: const Icon(Icons.menu_book, color: Color(0xFF2DD4BF)),
            label: _t('navQuran'),
          ),
          NavigationDestination(
            icon: const Icon(Icons.favorite_outline),
            selectedIcon: const Icon(Icons.favorite, color: Color(0xFFFB7185)),
            label: _t('navNikah'),
          ),
          NavigationDestination(
            icon: const Icon(Icons.mosque_outlined),
            selectedIcon: const Icon(Icons.mosque, color: Color(0xFF34D399)),
            label: _t('navMosques'),
          ),
          NavigationDestination(
            icon: const Icon(Icons.security_outlined),
            selectedIcon: const Icon(Icons.security, color: Color(0xFF60A5FA)),
            label: _t('navSecurity'),
          ),
          NavigationDestination(
            icon: const Icon(Icons.auto_stories_outlined),
            selectedIcon: const Icon(Icons.auto_stories, color: Color(0xFFFBBF24)),
            label: _t('navFatwa'),
          ),
        ],
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: [
          _buildHomeDashboardView(),
          QuranTab(
            locale: widget.currentLocale,
            syncBanner: banner,
            studentController: _studentController,
            surahController: _surahController,
            onSave: _recordQuranProgress,
          ),
          NikahTab(
            locale: widget.currentLocale,
            syncBanner: banner,
            groomController: _groomController,
            groomRepController: _groomRepController,
            brideController: _brideController,
            guardianController: _guardianController,
            dowryController: _dowryController,
            witness1Controller: _witness1Controller,
            witness2Controller: _witness2Controller,
            contractDateController: _contractDateController,
            imamNameController: _imamNameController,
            brideMaritalStatus: _brideMaritalStatus,
            onMaritalStatusChanged: (val) => setState(() => _brideMaritalStatus = val),
            cachedMosques: _cachedMosques,
            selectedMosqueId: _selectedMosqueId,
            onMosqueChanged: (val) => setState(() => _selectedMosqueId = val),
            onSave: _recordNikah,
          ),
          MosquesTab(
            locale: widget.currentLocale,
            syncBanner: banner,
            mosqueNameController: _mosqueNameController,
            mosqueCityController: _mosqueCityController,
            cachedMosques: _cachedMosques,
            onSave: _recordMosque,
          ),
          SecurityTab(
            locale: widget.currentLocale,
            syncBanner: banner,
            plateController: _plateController,
            onSave: _recordSecurity,
          ),
          FatwaTab(
            locale: widget.currentLocale,
            syncBanner: banner,
            questionController: _questionController,
            onSave: _recordFatwa,
          ),
        ],
      ),
    );
  }
}
