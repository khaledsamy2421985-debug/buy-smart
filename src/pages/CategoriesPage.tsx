import React from 'react';
import { useApp } from '../context/AppContext';
import { SeoHead } from '../components/SeoHead';
import { ArrowLeft, Tag, Layers } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { categories, products, navigate } = useApp();

  return (
    <div className="space-y-8 pb-12">
      <SeoHead 
        title="تصفح جميع الأقسام والمنتجات" 
        description="استكشف الأقسام المتنوعة في موقع صفوة العروض من إلكترونيات، أجهزة منزلية، موضة، وصوتيات."
      />

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm text-right space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
          <Layers size={14} />
          <span>فئات التسوق الموثوقة</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">
          تصفح أقسام المنتجات والعروض 📂
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
          اختر القسم الذي يناسب احتياجاتك لاستعراض أفضل الصفقات والمنتجات مع خاصية الفلترة والمقارنة.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const categoryProducts = products.filter(p => p.category === cat.id);
          const topDiscount = Math.max(...categoryProducts.map(p => p.discountPercent || 0), 0);

          return (
            <div 
              key={cat.id}
              onClick={() => navigate(`products?category=${cat.id}`)}
              className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Category Header Image */}
              <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
                
                <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-white">
                  <h3 className="text-lg font-black drop-shadow-md">
                    {cat.name}
                  </h3>
                  <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                    {categoryProducts.length} منتج
                  </span>
                </div>
              </div>

              {/* Category Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {cat.description}
                </p>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  {topDiscount > 0 ? (
                    <span className="text-[11px] font-extrabold text-rose-500 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-lg">
                      خصومات حتى {topDiscount}% 🔥
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-400">عروض متجددة</span>
                  )}

                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 group-hover:translate-x-[-4px] transition-transform flex items-center gap-1">
                    <span>استعرض القسم</span>
                    <ArrowLeft size={14} />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
