# Ihya'ous Sounnah — منارة (Manara Awqaf & Dawah ERP)

منظومة متكاملة هجينة (لوحة تحكم ويب + تطبيق جوال ميداني Offline-First) لإدارة الأوقاف، المساجد، حلقات القرآن الكريم، عقود الزواج الشرعية، الفتاوى، والمشاريع الخيرية بثلاث لغات (**العربية، الفرنسية، الهوسا**).

## هيكلة المشروع

- `web/` — تطبيق الويب وواجهات البرمجة (Next.js 16, React 19, Tailwind CSS v4, Supabase, Drizzle ORM).
- `mobile/` — تطبيق الجوال الميداني دون إنترنت (Flutter + Hive + OfflineSyncEngine).
- `MANARA_AWQAF_DAWAH_MASTER_PLAN.md` — الخطة المعمارية والوظيفية الشاملة.

## النشر على Vercel (تطبيق الويب)

1. استورد المستودع في [Vercel](https://vercel.com/new).
2. عيّن **Root Directory** إلى `web`.
3. أضف متغيرات البيئة التالية في إعدادات المشروع على Vercel (انظر `web/.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
4. اضغط **Deploy**.
