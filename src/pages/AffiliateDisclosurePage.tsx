import React from 'react';
import { SeoHead } from '../components/SeoHead';
import { ShieldAlert, ExternalLink, CheckCircle2 } from 'lucide-react';

export const AffiliateDisclosurePage: React.FC = () => {
  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <SeoHead 
        title="إفصاح التسويق بالعمولة (Affiliate Disclosure)" 
        description="إفصاح شفاف يوضح كيفية عمل روابط التسويق بالعمولة في موقع صفوة العروض والعمولات الناتجة عن عمليات الشراء."
      />

      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-slate-800/10 rounded-3xl p-8 border border-amber-300/40 dark:border-amber-900/40 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
          <ShieldAlert size={32} />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            إفصاح روابط التسويق بالعمولة ⚖️
          </h1>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
          التزاماً بالشفافية الكاملة وقوانين التجارة الإلكترونية العالمية (FTC Regulations)، يرجى قراءة هذا الإفصاح لمعرفة كيفية عمل روابط الموقع.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
        
        <section className="space-y-3">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100">ما هي روابط الأفلييت (Affiliate Links)؟</h2>
          <p>
            تعد منصة <strong>صفوة العروض (Safwa Deals)</strong> مشاركاً في العديد من برامج التسويق بالعمولة الخاصة بالمتاجر الإلكترونية الكبرى (مثل Amazon Associates، Noon Affiliate، AliExpress، وغيرها). عندما تنقر على زر "اشترِ الآن" أو أحد الروابط الترويجية الموجودة في موقعنا وتنتقل للمتجر وتكمل الشراء، قد نحصل على عمولة مالية بسيطة.
          </p>
        </section>

        <section className="space-y-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
          <h3 className="text-sm font-black flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <span>ما الذي يعنيه هذا بالنسبة لك كمشتري؟</span>
          </h3>
          <ul className="space-y-2 text-xs font-bold mr-4 list-disc">
            <li>لا تتغير الأسعار مطلقاً: يدفع الزائر نفس السعر تماماً كأنه دخل المتجر مباشرة.</li>
            <li>بدون أي رسوم خفية: لا تحمّلك المنصة أي تكلفة إضافية أو عمولات مفروضة.</li>
            <li>استمرارية الخدمة: تساعدنا العمولات البسيطة في استمرار تقديم خدمات المقارنة والمراجعات وتصفية الخصومات مجاناً.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100">الاستقلالية في المراجعات والترشيحات</h2>
          <p>
            حصولنا على عمولات من المتاجر لا يؤثر بأي شكل من الأشكال على حيادية التقييمات أو المواصفات المعروضة للمنتج. نعتمد في ترشيحاتنا على تقييمات المشترين الحقيقية، جودة المكونات والمواصفات، ونسبة الخصم المتاحة.
          </p>
        </section>

      </div>
    </div>
  );
};
