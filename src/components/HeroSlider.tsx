import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';
import { ChevronRight, ChevronLeft, ShoppingBag, ExternalLink, Flame, ShieldCheck } from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { products, navigate } = useApp();
  const featuredProducts = products.filter(p => p.featured || p.discountPercent >= 20).slice(0, 5);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play interval
  useEffect(() => {
    if (featuredProducts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % featuredProducts.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  if (featuredProducts.length === 0) return null;

  const currentProduct = featuredProducts[currentIndex];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % featuredProducts.length);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl mb-10 group border border-slate-800">
      
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
        <img 
          src={currentProduct.image} 
          alt={currentProduct.name}
          className="w-full h-full object-cover filter blur-xl scale-110 transition-all duration-700" 
        />
      </div>
      
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[420px]">
        
        {/* Text Details Column */}
        <div className="lg:col-span-7 space-y-5 text-right">
          
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white text-[11px] font-black shadow-lg shadow-rose-600/30 animate-pulse">
              <Flame size={14} className="fill-current text-amber-300" />
              صفقة اليوم الحصرية 🔥
            </span>

            {currentProduct.discountPercent > 0 && (
              <span className="px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-300 text-xs font-black">
                وفر {currentProduct.discountPercent}% اليوم
              </span>
            )}

            <span className="inline-flex items-center gap-1 text-[11px] text-slate-300 font-semibold mr-auto sm:mr-0">
              <ShieldCheck size={14} className="text-emerald-400" />
              رابط أفلييت موثوق
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black leading-snug tracking-tight text-white drop-shadow-md">
            {currentProduct.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-2xl font-medium leading-relaxed">
            {currentProduct.description}
          </p>

          <div className="flex items-baseline gap-3 pt-1">
            <span className="text-2xl sm:text-4xl font-black text-amber-400">
              {formatCurrency(currentProduct.price)}
            </span>
            {currentProduct.originalPrice > currentProduct.price && (
              <span className="text-base text-slate-400 line-through font-semibold">
                {formatCurrency(currentProduct.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            
            {/* Direct Affiliate Buy CTA */}
            <a
              href={currentProduct.affiliateUrl}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs shadow-xl shadow-emerald-600/30 hover:scale-102 active:scale-98 transition-all duration-200 flex items-center gap-2"
            >
              <ShoppingBag size={16} />
              <span>شراء عبر المتجر الرسمي</span>
              <ExternalLink size={13} />
            </a>

            {/* View Product Details */}
            <button
              onClick={() => navigate(`product/${currentProduct.id}`)}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-200"
            >
              تفاصيل ورأي المتخصصين
            </button>
          </div>
        </div>

        {/* Product Image Column */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative group/img cursor-pointer" onClick={() => navigate(`product/${currentProduct.id}`)}>
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-40 group-hover/img:opacity-70 transition-opacity duration-300" />
            <img 
              src={currentProduct.image} 
              alt={currentProduct.name}
              className="relative w-64 h-64 sm:w-72 sm:h-72 object-cover rounded-3xl shadow-2xl border-2 border-white/20 group-hover/img:scale-105 transition-transform duration-300 bg-slate-900" 
            />
            {currentProduct.store && (
              <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md text-amber-300 px-3 py-1.5 rounded-xl text-xs font-black border border-white/10 shadow-lg">
                متوفر على {currentProduct.store}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide Navigation */}
      {featuredProducts.length > 1 && (
        <div className="relative z-20 bg-slate-900/80 backdrop-blur-md px-6 py-3 border-t border-slate-800/80 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            {featuredProducts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`الشريحة ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="السابق"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="التالي"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
