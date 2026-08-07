import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { Award, TrendingDown, PiggyBank, Sparkles, Target, Zap, ShieldCheck } from 'lucide-react';

interface BuySmartSummaryCardProps {
  product: Product;
}

export const BuySmartSummaryCard: React.FC<BuySmartSummaryCardProps> = ({ product }) => {
  const stores = product.stores || [];
  const inStockStores = stores.filter(s => s.inStock && s.price > 0);

  // 1. Best Price Store & Lowest Price
  const bestStore = inStockStores.length > 0
    ? inStockStores.reduce((prev, curr) => (curr.price < prev.price ? curr : prev))
    : null;

  const lowestPrice = bestStore ? bestStore.price : product.price;

  // 2. Highest Price and Money Saved
  const validPrices = stores.map(s => s.price).filter(p => p > 0);
  const highestPrice = validPrices.length > 0 
    ? Math.max(...validPrices) 
    : (product.originalPrice || product.price);
  
  const benchmarkPrice = Math.max(highestPrice, product.originalPrice || 0, lowestPrice);
  const moneySaved = benchmarkPrice > lowestPrice ? (benchmarkPrice - lowestPrice) : 0;

  // 3. Buy Smart Score Generation (0 - 10)
  // Factors: Price, Features, Brand reputation, Value for money
  let baseScore = 7.0;

  // Price & Discount factor
  if (moneySaved > 0) {
    const discountRatio = moneySaved / benchmarkPrice;
    if (discountRatio >= 0.25) baseScore += 1.2;
    else if (discountRatio >= 0.15) baseScore += 0.9;
    else if (discountRatio >= 0.05) baseScore += 0.6;
    else baseScore += 0.3;
  } else if (product.discountPercent && product.discountPercent > 0) {
    baseScore += Math.min(1.2, (product.discountPercent / 100) * 2);
  }

  // Rating & Value factor
  if (product.rating) {
    baseScore += (product.rating / 5) * 1.0;
  } else {
    baseScore += 0.8;
  }

  // Features factor
  const featureCount = (product.features?.length || 0) + (product.pros?.length || 0) + (product.specs ? Object.keys(product.specs).length : 0);
  if (featureCount >= 5) baseScore += 0.8;
  else if (featureCount >= 3) baseScore += 0.5;
  else if (featureCount >= 1) baseScore += 0.3;

  // Brand reputation factor
  const brandName = (product.brand || product.name || '').toLowerCase();
  const topBrands = ['apple', 'samsung', 'sony', 'lg', 'nike', 'dell', 'hp', 'lenovo', 'asus', 'xiaomi', 'philips', 'anker', 'bose', 'panasonic', 'canon', 'nikon', 'huawei'];
  const isTopBrand = topBrands.some(b => brandName.includes(b));
  if (isTopBrand) {
    baseScore += 0.5;
  } else if (product.rating >= 4.5) {
    baseScore += 0.3;
  }

  // Multiple stores competition factor
  if (inStockStores.length >= 3) baseScore += 0.5;
  else if (inStockStores.length >= 2) baseScore += 0.3;

  const score = Math.min(10.0, Math.max(6.5, Math.round(baseScore * 10) / 10));

  // 4. Best For determination
  const fullText = `${product.name} ${product.description || ''} ${product.category || ''} ${product.tags?.join(' ') || ''} ${product.features?.join(' ') || ''}`.toLowerCase();

  let bestFor = 'الاستخدام اليومي (Daily Use)';
  if (fullText.includes('ألعاب') || fullText.includes('العاب') || fullText.includes('gaming') || fullText.includes('بلايستيشن') || fullText.includes('ps5') || fullText.includes('قيمنق') || fullText.includes('كرت شاشة')) {
    bestFor = 'الألعاب والترفيه (Gaming & Entertainment)';
  } else if (fullText.includes('كاميرا') || fullText.includes('تصوير') || fullText.includes('camera') || fullText.includes('4k') || fullText.includes('oled') || fullText.includes('صنع محتوى')) {
    bestFor = 'التصوير وصُنّاع المحتوى (Photography & Content)';
  } else if (fullText.includes('دراسة') || fullText.includes('طالب') || fullText.includes('student') || fullText.includes('مدرسة') || fullText.includes('جامعة')) {
    bestFor = 'الطلاب والدراسة (Students & Study)';
  } else if (fullText.includes('أعمال') || fullText.includes('مكتب') || fullText.includes('business') || fullText.includes('لابتوب') || fullText.includes('ايفون') || fullText.includes('إنتاجية')) {
    bestFor = 'الأعمال والإنتاجية (Business & Productivity)';
  } else if (fullText.includes('منزل') || fullText.includes('مطبخ') || fullText.includes('غسالة') || fullText.includes('ثلاجة') || fullText.includes('شاشة') || fullText.includes('home') || fullText.includes('kitchen')) {
    bestFor = 'الاستخدام المنزلي (Home & Family)';
  } else if (product.category === 'health-fitness' || fullText.includes('رياضة') || fullText.includes('صحة') || fullText.includes('ساعة ذكية') || fullText.includes('لياقة')) {
    bestFor = 'اللياقة والصحة (Health & Fitness)';
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-800/60 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-800/60 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 font-black">
            <Zap size={24} className="fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                ملخص الشراء الذكي (Buy Smart Summary)
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300">
                <Sparkles size={12} />
                <span>AI Verified</span>
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-1 font-medium">
              تحليل شامل ومستقل للمنتج بناءً على السعر والمميزات وسمعة الماركة والقيمة مقابل السعر
            </p>
          </div>
        </div>

        {/* Buy Smart Score Badge */}
        <div className="flex items-center gap-3 bg-indigo-900/60 border border-indigo-700/80 rounded-2xl p-3 shrink-0 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] font-bold text-indigo-300 block uppercase tracking-wider">
              تقييم الشراء الذكي
            </span>
            <span className="text-xs text-amber-300 font-semibold">Buy Smart Score</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-2xl shadow-md flex items-center gap-1">
            <span>{score.toFixed(1)}</span>
            <span className="text-xs font-bold text-slate-800">/ 10</span>
          </div>
        </div>
      </div>

      {/* Grid Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* 1. Best Price Store */}
        <div className="bg-indigo-950/70 border border-indigo-800/60 rounded-2xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-indigo-300 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <Award size={16} className="text-amber-400" />
              <span>متجر أفضل سعر</span>
            </span>
            <span className="text-[10px] text-amber-300 font-extrabold uppercase">Best Store</span>
          </div>
          <div className="text-base sm:text-lg font-black text-white truncate">
            {bestStore ? bestStore.storeName : (product.store || 'المتجر الرسمي')}
          </div>
          <div className="text-[11px] text-indigo-200 font-medium">
            {bestStore?.inStock ? 'متوفر للتسليم المباشر' : 'المتجر صاحب الأقل سعراً'}
          </div>
        </div>

        {/* 2. Lowest Price */}
        <div className="bg-indigo-950/70 border border-indigo-800/60 rounded-2xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-indigo-300 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <TrendingDown size={16} className="text-emerald-400" />
              <span>أقل سعر متاح</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-extrabold uppercase">Lowest Price</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-400">
            {formatCurrency(lowestPrice)}
          </div>
          <div className="text-[11px] text-indigo-200 font-medium">
            شامل العروض والتخفيضات
          </div>
        </div>

        {/* 3. Money Saved */}
        <div className="bg-indigo-950/70 border border-indigo-800/60 rounded-2xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-indigo-300 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <PiggyBank size={16} className="text-rose-400" />
              <span>مبلغ التوفير</span>
            </span>
            <span className="text-[10px] text-rose-400 font-extrabold uppercase">Money Saved</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-rose-400">
            {moneySaved > 0 ? formatCurrency(moneySaved) : 'أفضل سعر أساسي'}
          </div>
          <div className="text-[11px] text-indigo-200 font-medium">
            {moneySaved > 0 ? 'مقارنة بأعلى سعر في السوق' : 'السعر متطابق مع القيمة السوقية'}
          </div>
        </div>

        {/* 4. Buy Smart Score Breakdown */}
        <div className="bg-indigo-950/70 border border-indigo-800/60 rounded-2xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-indigo-300 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-amber-400" />
              <span>معايير التقييم</span>
            </span>
            <span className="text-[10px] text-amber-300 font-extrabold uppercase">Score Factors</span>
          </div>
          <div className="text-xs font-extrabold text-amber-300 flex flex-wrap gap-1 pt-0.5">
            <span className="px-1.5 py-0.5 rounded bg-indigo-900/80 border border-indigo-700/60">السعر</span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-900/80 border border-indigo-700/60">المميزات</span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-900/80 border border-indigo-700/60">الماركة</span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-900/80 border border-indigo-700/60">القيمة</span>
          </div>
          <div className="text-[11px] text-indigo-200 font-medium">
            تقييم خوارزمي دقيق لضمان الجودة
          </div>
        </div>

        {/* 5. Best For */}
        <div className="bg-indigo-950/70 border border-indigo-800/60 rounded-2xl p-4 space-y-2 relative overflow-hidden sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-indigo-300 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <Target size={16} className="text-cyan-400" />
              <span>الأنسب لـ (Best For)</span>
            </span>
            <span className="text-[10px] text-cyan-400 font-extrabold uppercase">Use Case</span>
          </div>
          <div className="text-xs sm:text-sm font-black text-cyan-300 leading-snug">
            {bestFor}
          </div>
          <div className="text-[11px] text-indigo-200 font-medium">
            الفئة الأكثر استفادة من هذا المنتج
          </div>
        </div>

      </div>
    </div>
  );
};
