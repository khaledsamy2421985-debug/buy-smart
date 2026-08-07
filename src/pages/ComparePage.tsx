import React from 'react';
import { useApp } from '../context/AppContext';
import { SeoHead } from '../components/SeoHead';
import { formatCurrency } from '../utils/formatCurrency';
import { GitCompare, ShoppingBag, ExternalLink, X, Star, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export const ComparePage: React.FC = () => {
  const { compareList, products, toggleCompare, clearCompare, navigate } = useApp();

  const comparedProducts = products.filter(p => compareList.includes(p.id));

  return (
    <div className="space-y-8 pb-16">
      <SeoHead 
        title="مقارنة المنتجات والأسعار" 
        description="قارن بين أسعار ومواصفات وإيجابيات وسلبيات المنتجات جنبًا إلى جنب لاختيار الصفقة الأفضل."
      />

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-2">
            <GitCompare size={14} />
            <span>أداة المقارنة التفاعلية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            جدول المقارنة الشامل ⚖️
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            قارن بين المنتجات المحددة جنباً إلى جنب لتحديد الخيار الأنسب لميزانيتك واحتياجاتك.
          </p>
        </div>

        {comparedProducts.length > 0 && (
          <button
            onClick={clearCompare}
            className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs font-bold hover:bg-rose-100 transition-colors"
          >
            مسح كافة المنتجات ({comparedProducts.length})
          </button>
        )}
      </div>

      {comparedProducts.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto">
            <GitCompare size={32} />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
            لم تقم بإضافة أي منتجات للمقارنة بعد
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تصفح كتالوج المنتجات وانقر على زر المقارنة ⚖️ على أي منتج لإضافته إلى هذا الجدول.
          </p>
          <button
            onClick={() => navigate('products')}
            className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/20"
          >
            تصفح المنتجات وإضافتها
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto pb-6">
          <table className="w-full bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <th className="p-4 text-right text-xs font-bold text-slate-400 w-48">الخاصية / المنتجات</th>
                {comparedProducts.map(prod => (
                  <th key={prod.id} className="p-4 text-center relative border-r border-slate-200 dark:border-slate-700 min-w-[200px]">
                    <button
                      onClick={() => toggleCompare(prod.id)}
                      className="absolute top-2 left-2 p-1.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-500 hover:text-white transition-colors"
                      title="إزالة من المقارنة"
                    >
                      <X size={14} />
                    </button>
                    <img src={prod.image} alt={prod.name} className="w-24 h-24 object-contain mx-auto mb-2 rounded-xl" />
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 line-clamp-2 px-2">
                      {prod.name}
                    </h4>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80 text-xs">
              
              {/* Row: Price */}
              <tr>
                <td className="p-4 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/30">
                  السعر والتخفيض
                </td>
                {comparedProducts.map(prod => (
                  <td key={prod.id} className="p-4 text-center border-r border-slate-200 dark:border-slate-700">
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 block">
                      {formatCurrency(prod.price)}
                    </span>
                    {prod.originalPrice > prod.price && (
                      <span className="text-slate-400 line-through text-[11px] font-bold block">
                        {formatCurrency(prod.originalPrice)} (-{prod.discountPercent}%)
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row: Rating */}
              <tr>
                <td className="p-4 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/30">
                  التقييم وسرعة الطلب
                </td>
                {comparedProducts.map(prod => (
                  <td key={prod.id} className="p-4 text-center border-r border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-center gap-1 text-amber-400 font-bold">
                      <Star size={14} className="fill-current" />
                      <span>{prod.rating} ({prod.reviewsCount} تقييم)</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row: Store */}
              <tr>
                <td className="p-4 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/30">
                  المتجر الموفر
                </td>
                {comparedProducts.map(prod => (
                  <td key={prod.id} className="p-4 text-center border-r border-slate-200 dark:border-slate-700 font-extrabold text-slate-800 dark:text-slate-200">
                    {prod.store || 'المتجر الرسمي'}
                  </td>
                ))}
              </tr>

              {/* Row: Pros */}
              <tr>
                <td className="p-4 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/30">
                  الإيجابيات البارزة
                </td>
                {comparedProducts.map(prod => (
                  <td key={prod.id} className="p-4 border-r border-slate-200 dark:border-slate-700 text-right">
                    <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                      {(prod.pros || ['جودة تصنيع عالية', 'سعر ممتاز']).map((p, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Row: CTA Affiliate Buy Link */}
              <tr className="bg-slate-50 dark:bg-slate-900/80">
                <td className="p-4 font-bold text-slate-500 dark:text-slate-400">
                  رابط الشراء المباشر
                </td>
                {comparedProducts.map(prod => (
                  <td key={prod.id} className="p-4 text-center border-r border-slate-200 dark:border-slate-700">
                    <a
                      href={prod.affiliateUrl}
                      target="_blank"
                      rel="sponsored nofollow noopener"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 hover:scale-105 transition-transform"
                    >
                      <ShoppingBag size={14} />
                      <span>اشترِ الآن</span>
                      <ExternalLink size={12} />
                    </a>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
