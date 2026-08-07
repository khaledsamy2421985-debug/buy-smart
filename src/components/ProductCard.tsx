import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';
import { Star, Heart, GitCompare, ExternalLink, Eye, ShoppingBag, Flame, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    navigate, 
    wishlist, 
    toggleWishlist, 
    compareList, 
    toggleCompare, 
    setQuickViewProduct 
  } = useApp();

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);

  // Helper to format store badge color
  const getStoreBadgeClass = (storeName?: string) => {
    if (!storeName) return 'bg-slate-900/90 text-white';
    if (storeName.includes('أمازون') || storeName.includes('Amazon')) {
      return 'bg-amber-500 text-slate-950 font-black';
    }
    if (storeName.includes('نون') || storeName.includes('Noon')) {
      return 'bg-yellow-400 text-slate-950 font-black';
    }
    if (storeName.includes('جوميا') || storeName.includes('Jumia')) {
      return 'bg-orange-500 text-white font-black';
    }
    return 'bg-indigo-600 text-white font-bold';
  };

  const savingsAmount = product.originalPrice > product.price 
    ? Math.round(product.originalPrice - product.price)
    : 0;

  return (
    <div className="group relative bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Top Badges Header */}
      <div className="absolute top-3 right-3 left-3 z-20 flex items-center justify-between pointer-events-none">
        
        {/* Discount Badge */}
        {product.discountPercent > 0 ? (
          <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white text-[11px] font-black shadow-md shadow-rose-600/20 flex items-center gap-1">
            <Flame size={12} className="fill-current text-amber-300" />
            <span>-{product.discountPercent}%</span>
          </span>
        ) : (
          <div />
        )}

        {/* Store & Special Badge */}
        <div className="flex items-center gap-1.5">
          {product.badge && (
            <span className="px-2 py-0.5 rounded-lg bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-extrabold shadow-sm">
              {product.badge}
            </span>
          )}
          {product.store && (
            <span className={`px-2 py-0.5 rounded-lg text-[10px] backdrop-blur-md shadow-sm ${getStoreBadgeClass(product.store)}`}>
              {product.store}
            </span>
          )}
        </div>
      </div>

      {/* Floating Wishlist Button (Always accessible) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute bottom-3 left-3 z-20 p-2.5 rounded-full shadow-lg transition-all duration-200 backdrop-blur-md ${
          isWishlisted 
            ? 'bg-rose-500 text-white scale-105' 
            : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-rose-500 hover:text-white'
        }`}
        title={isWishlisted ? "إزالة من المفضلة" : "إضافة للمفضلة"}
        aria-label="إضافة للمفضلة"
      >
        <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
      </button>

      {/* Image Container */}
      <div 
        className="relative aspect-[4/3] sm:aspect-square w-full bg-slate-50 dark:bg-slate-900 overflow-hidden cursor-pointer" 
        onClick={() => navigate(`product/${product.id}`)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Quick View & Compare Overlay */}
        <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5 pointer-events-none group-hover:pointer-events-auto">
          
          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="p-3 rounded-full bg-white text-slate-800 hover:bg-indigo-600 hover:text-white shadow-xl transition-all duration-200 transform scale-90 group-hover:scale-100"
            title="معاينة سريعة للمنتج"
          >
            <Eye size={18} />
          </button>

          {/* Compare Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(product.id);
            }}
            className={`p-3 rounded-full shadow-xl transition-all duration-200 transform scale-90 group-hover:scale-100 ${
              isCompared 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-slate-800 hover:bg-indigo-600 hover:text-white'
            }`}
            title={isCompared ? "إزالة من المقارنة" : "إضافة للمقارنة"}
          >
            <GitCompare size={18} />
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
              {product.category}
            </span>

            <div className="flex items-center gap-1">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                {product.rating}
              </span>
              <span className="text-slate-400 text-[10px]">
                ({product.reviewsCount})
              </span>
            </div>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => navigate(`product/${product.id}`)}
            className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer line-clamp-2 transition-colors leading-relaxed h-10"
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Savings */}
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            {savingsAmount > 0 && (
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 block mt-0.5">
                توفير {formatCurrency(savingsAmount)}!
              </span>
            )}
          </div>

          {isCompared && (
            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
              في المقارنة
            </span>
          )}
        </div>

        {/* Primary Affiliate Action Button */}
        <div className="grid grid-cols-1 gap-1.5 pt-1">
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/40 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ShoppingBag size={14} />
            <span>شراء عبر المتجر</span>
            <ExternalLink size={12} className="opacity-80" />
          </a>
        </div>

      </div>
    </div>
  );
};
