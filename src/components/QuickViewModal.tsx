import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';
import { X, Star, ShoppingBag, ExternalLink, Heart, GitCompare, CheckCircle2, XCircle } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    wishlist, 
    toggleWishlist, 
    compareList, 
    toggleCompare,
    navigate 
  } = useApp();

  if (!quickViewProduct) return null;

  const isWishlisted = wishlist.includes(quickViewProduct.id);
  const isCompared = compareList.includes(quickViewProduct.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col md:flex-row max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
        >
          <X size={20} />
        </button>

        {/* Product Image */}
        <div className="w-full md:w-1/2 bg-slate-100 dark:bg-slate-900 p-6 flex items-center justify-center relative">
          <img
            src={quickViewProduct.image}
            alt={quickViewProduct.name}
            className="w-full max-h-72 object-contain rounded-2xl"
          />
          {quickViewProduct.discountPercent > 0 && (
            <span className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-extrabold px-3 py-1 rounded-xl shadow-md">
              خصم {quickViewProduct.discountPercent}%
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            
            {/* Store & Rating */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg">
                متوفر في {quickViewProduct.store || 'المتجر المعتمد'}
              </span>
              <div className="flex items-center text-amber-400 font-bold gap-1">
                <Star size={14} className="fill-current" />
                <span>{quickViewProduct.rating} ({quickViewProduct.reviewsCount} تقييم)</span>
              </div>
            </div>

            {/* Name */}
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 leading-snug">
              {quickViewProduct.name}
            </h2>

            {/* Description */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
              {quickViewProduct.description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {formatCurrency(quickViewProduct.price)}
              </span>
              {quickViewProduct.originalPrice > quickViewProduct.price && (
                <span className="text-sm text-slate-400 line-through font-semibold">
                  {formatCurrency(quickViewProduct.originalPrice)}
                </span>
              )}
            </div>

            {/* Key Specs Preview */}
            {quickViewProduct.specs && (
              <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl space-y-1 text-xs">
                {Object.entries(quickViewProduct.specs).slice(0, 3).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{key}:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-700">
            
            {/* Primary Buy Affiliate Button */}
            <a
              href={quickViewProduct.affiliateUrl}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <ShoppingBag size={16} />
              <span>انتقل لصفحة الشراء المباشرة</span>
              <ExternalLink size={14} />
            </a>

            {/* Secondary actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setQuickViewProduct(null);
                  navigate(`product/${quickViewProduct.id}`);
                }}
                className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors text-center"
              >
                عرض الصفحة الكاملة
              </button>

              <button
                onClick={() => toggleCompare(quickViewProduct.id)}
                className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                  isCompared 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
                }`}
              >
                <GitCompare size={14} />
                <span>{isCompared ? 'في المقارنة' : 'أضف للمقارنة'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
