import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { SeoHead } from '../components/SeoHead';
import { Heart, ArrowLeft } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, navigate } = useApp();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="space-y-8 pb-16">
      <SeoHead 
        title="قائمة المفضلة" 
        description="المنتجات والعروض التي قمت بحفظها في صفوة العروض للرجوع إليها في أي وقت."
      />

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-bold mb-2">
            <Heart size={14} className="fill-current" />
            <span>منتجاتك المحفوظة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            قائمة المفضلة الخاصة بك ❤️
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            تابع التغيرات في الأسعار والعروض للمنتجات التي تنوي شراءها لاحقاً.
          </p>
        </div>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-500 flex items-center justify-center mx-auto">
            <Heart size={32} />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
            قائمة المفضلة فارغة حالياً
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            انقر على أيقونة القلب ❤️ الموجودة على أي بطاقة منتج لإضافته هنا مباشرة.
          </p>
          <button
            onClick={() => navigate('products')}
            className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/20"
          >
            استكشف المنتجات الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};
