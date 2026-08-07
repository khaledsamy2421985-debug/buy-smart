import React from 'react';
import { SeoHead } from '../components/SeoHead';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <SeoHead 
        title="سياسة الخصوصية" 
        description="سياسة الخصوصية وحماية بيانات المستخدمين في موقع صفوة العروض."
      />

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
          <ShieldCheck size={28} />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            سياسة الخصوصية 🔐
          </h1>
        </div>
        <p className="text-xs text-slate-400 font-bold">آخر تحديث: أغسطس 2026</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
        
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100">1. مقدمة وتعهد الخصوصية</h2>
          <p>
            نحن في منصة <strong>صفوة العروض (Safwa Deals)</strong> نلتزم بأعلى معايير حماية وخصوصية زوارنا. توضح هذه وثيقة سياسة الخصوصية كيفية تعاملنا مع البيانات عند زيارة الموقع واستخدام روابط الأفلييت.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100">2. ملفات تعريف الارتباط (Cookies) وتتبع الأفلييت</h2>
          <p>
            تستخدم منصتنا ملفات الكوكيز وحافظة المتصفح (localStorage) لغرض حفظ التفضيلات وتجربة الاستخدام (مثل تفعيل الوضع الداكن، قائمة المفضلة، وجدول المقارنة). عند النقر على روابط الأفلييت والانتقال للمتجر الشريك (مثل أمازون أو نون)، قد يتم وضع ملف كوكيز من المتجر لتتبع عملية الشراء المكتملة وتوثيق عمولة الأفلييت للموقع.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100">3. جمع المعلومات الشخصية</h2>
          <p>
            لا نطلب من الزائرين إنشاء حسابات أو تقديم بيانات بطاقات ائتمانية على موقعنا. يتم جمع البريد الإلكتروني اختيارياً فقط في حال رغبت في الاشتراك بالنشرة البريدية، ولا يتم مشاركة بريدك مع أي جهات خارجية مطلقاً.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100">4. الروابط الخارجية للمتاجر</h2>
          <p>
            يحتوي موقعنا على روابط لمواقع خارجية. لسنا مسؤولين عن سياسات الخصوصية أو محتوى هذه المواقع الخارجية. ننصح بقراءة سياسة الخصوصية الخاصة بالمتجر البائع عند الانتقال إليه.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100">5. التواصل بشأن الخصوصية</h2>
          <p>
            لأي أسئلة أو استفسارات تتعلق بسياسة الخصوصية، يمكنكم التواصل معنا عبر البريد الإلكتروني: <span className="dir-ltr inline-block font-bold">privacy@safwadeals.com</span>.
          </p>
        </section>

      </div>
    </div>
  );
};
