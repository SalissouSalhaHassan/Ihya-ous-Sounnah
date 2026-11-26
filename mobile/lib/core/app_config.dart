/// إعدادات الاتصال المركزية لتطبيق الجوال الميداني
class AppConfig {
  static const String apiBaseUrl = String.fromEnvironment(
    'MANARA_API_URL',
    defaultValue: 'https://ihya-ous-sounnah.vercel.app',
  );
}
