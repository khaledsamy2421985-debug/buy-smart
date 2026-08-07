import React from 'react';
import { SeoHead } from '../components/SeoHead';
import { Sparkles, ShieldCheck, Target, Award, HeartHandshake } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-16 max-w-4xl mx-auto">
      <SeoHead 
        title="من نحن - منصة صفوة العروض" 
        description="تعرف على منصة صفوة العروض ورؤيتنا في تقديم أفضل مراجعات المنتجات وتخفيضات الأفلييت الموثوقة."
      />

      {/* Hero Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-700 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
          <Sparkles size={32} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
          من نحن - صفوة العروض ✨
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
          صفوة العروض هي منصة تسويق بالعمولة (Affiliate Marketing) مستقلة ومتخصصة في تجميع ومراجعة وتصفية أفضل الصفقات والتخفيضات اليومية عبر المتاجر العالمية والمحلية المعتمدة.
        </p>
      </div>

      {/* Our Mission & Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
            <Target size={22} />
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">رؤيتنا ورسالتنا</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            تسهيل عملية الشراء للمستخدم العربي وتوفير الوقت والمال عبر تقديم مقارنات واضحة ودقيقة بين أفضل المنتجات، وروابط شراء مباشرة آمنة 100%.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
            <ShieldCheck size={22} />
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">التزامنا بالشفافية</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            جميع المنتجات المعروضة تخضع لتقييم دقيق بناءً على تجارب حقيقية وتقييمات المشترين. لا نضع أي روابط لمنتجات وهمية أو غير موثوقة.
          </p>
        </div>
      </div>

      {/* Transparency Note */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-8 space-y-4">
        <h3 className="text-xl font-extrabold flex items-center gap-2">
          <HeartHandshake className="text-amber-400" />
          كيف نكسب من الموقع؟
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          نعمل ضمن برامج الأفلييت (التسويق بالعمولة). عندما تضغط على زر "اشترِ الآن" وتكمل عملية الشراء لدى المتجر، قد نتلقى نسبة عمولة بسيطة من المتجر دون زيادة هللة واحدة على السعر الأصلي الذي تدفعه. هذا يساعدنا في استمرار تشغيل وتحسين منصة صفوة العروض مجاناً للجميع.
        </p>
      </div>
    </div>
  );
};
