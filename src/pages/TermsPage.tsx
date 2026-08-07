import React from 'react';
import { SeoHead } from '../components/SeoHead';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <SeoHead 
        title="الشروط والأحكام" 
        description="الشروط والأحكام الخاصة باستكشاف واستخدام موقع صفوة العروض وروابط الأفلييت."
      />

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
          <FileText size={28} />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            الشروط والأحكام 📜
          </h1>
        </div>
        <p className="text-xs text-slate-400 font-bold">آخر تحديث: أغسطس 2026</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
        
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100">1. القبول بالشروط</h2>
          <p>
            بدخولك واستخدامك لمنصة <strong>صفوة العروض (Safwa Deals)</strong>، فإنك توافق على الالتزام بكافة الشروط والأحكام الواردة في هذه الصفحة. إذا كنت لا توافق على أي جزء منها، يرجى الامتناع عن استخدام الموقع.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100">2. طبيعة الخدمات وروابط التسويق بالعمولة</h2>
          <p>
            منصة صفوة العروض توفر خدمة تجميع وتصفية العروض والمقارنة بينها. نحن لسنا متجراً بائعاً، ولا نقوم بشحن المنتجات أو تحصيل الأموال مباشرة. جميع المعاملات المالية والشحن والضمان تتم مباشرة بين المستخدم والمتجر الشريك المفوض (مثل أمازون، نون، إلخ).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100">3. دقة الأسعار والمعلومات</h2>
          <p>
            نبذل أقصى جهد لتحديث الأسعار وتوافر المنتجات بشكل دائم. ومع ذلك، قد تختلف الأسعار وتوافر المنتجات لدى المتاجر الأصلية دون إشعار مسبق. السعر المعتمد النهائي هو السعر المعروض على صفحة المتجر الشريك وقت الشراء.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100">4. حقوق الملكية الفكرية</h2>
          <p>
            جميع النصوص والتصاميم والشعارات الخاصة بالموقع مملوكة لصفوة العروض. علامات المنتجات والصور التجارية تخص أصحابها ومتاجرهم الرسمية وتُستخدم لغرض التعريف والمراجعة فقط.
          </p>
        </section>

      </div>
    </div>
  );
};
