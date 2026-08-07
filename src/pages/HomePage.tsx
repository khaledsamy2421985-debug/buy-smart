import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { HeroSlider } from '../components/HeroSlider';
import { ProductCard } from '../components/ProductCard';
import { NewsletterSection } from '../components/NewsletterSection';
import { SeoHead } from '../components/SeoHead';
import { 
  Flame, 
  Sparkles, 
  Star, 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Zap,
  ShoppingBag,
  SlidersHorizontal,
  ThumbsUp
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, categories, navigate } = useApp();

  // Selected Category filter on home page
  const [selectedHomeCategory, setSelectedHomeCategory] = useState<string>('all');

  // Flash Sale Timer State (Counts down 12 hours)
  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashDeals = products.filter(p => p.discountPercent >= 15).slice(0, 4);
  const topRatedProducts = products.filter(p => p.rating >= 4.7).slice(0, 8);

  const filteredDeals = selectedHomeCategory === 'all'
    ? products.slice(0, 8)
    : products.filter(p => p.category === selectedHomeCategory).slice(0, 8);

  return (
    <div className="space-y-12 pb-12">
      <SeoHead 
        title="الصفحة الرئيسية - أفضل عروض وتخفيضات الأفلييت والمقارنات الذكية" 
        description="صفوة العروض دليل الشراء الموثوق لأقوى صفقات التسوق الإلكتروني في مصر والسعودية."
      />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Flash Sale Section with Countdown Timer */}
      <section className="bg-gradient-to-br from-rose-500/10 via-amber-500/10 to-indigo-500/10 dark:from-rose-950/40 dark:via-amber-950/30 dark:to-indigo-950/40 rounded-3xl p-6 sm:p-8 border border-rose-200/80 dark:border-rose-900/50 shadow-sm relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 shrink-0">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>عروض وخصومات خاطفة 🔥</span>
                <span className="text-[11px] font-black text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/80 px-3 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                  محدودة الكمية
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                تخفيضات استثنائية تصل إلى 50% على أشهر المنتجات والأجهزة
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-rose-200/80 dark:border-slate-700 shadow-md self-start md:self-auto">
            <Clock size={16} className="text-rose-500 animate-spin" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">ينتهي العرض خلال:</span>
            <div className="flex items-center gap-1 font-black text-xs text-rose-600 dark:text-rose-400 dir-ltr">
              <span className="bg-rose-50 dark:bg-rose-950/80 px-2 py-1 rounded-lg border border-rose-200 dark:border-rose-900">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-rose-50 dark:bg-rose-950/80 px-2 py-1 rounded-lg border border-rose-200 dark:border-rose-900">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-rose-50 dark:bg-rose-950/80 px-2 py-1 rounded-lg border border-rose-200 dark:border-rose-900">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Flash Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashDeals.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Browse Categories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>تصفح حسب الأقسام</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              اختر الفئة للاطلاع على كافة المنتجات والمقارنات المتوفرة
            </p>
          </div>
          <button
            onClick={() => navigate('categories')}
            className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-2 rounded-xl transition-colors"
          >
            <span>عرض جميع الأقسام</span>
            <ArrowLeft size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const count = products.filter(p => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`products?category=${cat.id}`)}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-indigo-500 dark:hover:border-indigo-500 transition-all text-center flex flex-col items-center justify-center gap-3 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700 relative group-hover:scale-110 transition-transform">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                    {count} منتج متوفر
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filterable Best Deals Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>أحدث صفقات وتخفيضات السوق</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              محدثة فورياً بأحدث الأسعار من أمازون ونون وجوميا
            </p>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs font-bold">
            <button
              onClick={() => setSelectedHomeCategory('all')}
              className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                selectedHomeCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              الكل ({products.length})
            </button>
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedHomeCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                  selectedHomeCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDeals.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => navigate('products')}
            className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all inline-flex items-center gap-2"
          >
            <span>استكشف جميع الـ 106 صفقات في الدليل</span>
            <ArrowLeft size={16} />
          </button>
        </div>
      </section>

      {/* Top Rated Products Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-500 flex items-center justify-center font-bold">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                المنتجات الأعلى تقييماً 👍
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                حصلت على أعلى مراجعات محايدة وتقييمات إيجابية من المشترين
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('products')}
            className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>عرض الكل</span>
            <ArrowLeft size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topRatedProducts.slice(0, 4).map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Trust & Transparency Feature Cards */}
      <section className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200/90 dark:border-slate-700/80 shadow-sm my-12">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            لماذا تثق بمنصة صفوة العروض؟ 🛡️
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            نحن منصة أفلييت ومقارنة أسعار مستقلة تهدف لخدمة المستهلك العربي بأقصى درجة من الشفافية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-3 text-right">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
              روابط أفلييت آمنة ومعتمدة
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              نقوم بإحالتك مباشرة إلى المتاجر الرسمية (أمازون مصر، نون، جوميا) عبر روابط آمنة وتأمين مشترياتك 100%.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-3 text-right">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <TrendingUp size={20} />
            </div>
            <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
              مقارنة أسعار حقيقية ومستقلة
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              مقارنة فورية بين أسعار المتاجر المختلفة لنفس المنتج لتضمن الشراء بأقل سعر متوفر في السوق.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-3 text-right">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
              شفافية مطلقة بدون رسوم خفية
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              لا نقوم بإضافة أي رسوم على الشراء؛ عمولتنا بسيطة تدفعها المتاجر دون أي زيادة في سعر المنتج عليك.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <NewsletterSection />
    </div>
  );
};
