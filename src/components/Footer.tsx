import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ShieldCheck, Globe, ShoppingBag } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, categories } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-10 border-t border-slate-800 transition-colors duration-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Affiliate Disclosure */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <Sparkles size={20} className="text-amber-300" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                صفوة العروض
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              منصة صفوة العروض توفر لك مقارنة دقيقة للأسعار ومراجعات محايدة لأحدث المنتجات في مصر والسعودية مع روابط شراء موثوقة ومباشرة.
            </p>

            {/* FTC / Transparency Badge */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-amber-300/90 flex items-start gap-2.5">
              <ShieldCheck size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">
                <strong className="text-amber-300 block mb-0.5">إفصاح الشفافية والتسويق:</strong>
                قد نتقاضى عمولة أفلييت بسيطة عند الشراء من الروابط الموجودة، دون أي رسوم أو زيادات في السعر عليك.
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider text-indigo-400">
              التنقل السريع
            </h4>
            <ul className="space-y-2 text-xs font-bold">
              <li>
                <button onClick={() => navigate('home')} className="hover:text-indigo-400 transition-colors text-slate-300">
                  الصفحة الرئيسية
                </button>
              </li>
              <li>
                <button onClick={() => navigate('products')} className="hover:text-indigo-400 transition-colors text-slate-300">
                  جميع المنتجات والصفقات
                </button>
              </li>
              <li>
                <button onClick={() => navigate('categories')} className="hover:text-indigo-400 transition-colors text-slate-300">
                  تصفح الأقسام
                </button>
              </li>
              <li>
                <button onClick={() => navigate('compare')} className="hover:text-indigo-400 transition-colors text-slate-300">
                  أداة مقارنة المنتجات
                </button>
              </li>
              <li>
                <button onClick={() => navigate('wishlist')} className="hover:text-indigo-400 transition-colors text-slate-300">
                  قائمة المفضلة
                </button>
              </li>
              <li>
                <button onClick={() => navigate('admin')} className="hover:text-amber-400 transition-colors text-amber-300 font-extrabold flex items-center gap-1">
                  <span>لوحة التحكم وتحديث JSON</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Featured Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider text-indigo-400">
              الأقسام الأكثر طلباً
            </h4>
            <ul className="space-y-2 text-xs font-bold">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button 
                    onClick={() => navigate(`products?category=${cat.id}`)}
                    className="hover:text-indigo-400 transition-colors text-slate-300"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Supported Stores & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider text-indigo-400">
              المتاجر المعتمدة والسياسات
            </h4>

            {/* Supported Store Pills */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30">
                أمازون مصر 🇪🇬
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-yellow-500/20 text-yellow-300 text-[10px] font-black border border-yellow-500/30">
                نون مصر 🇪🇬
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-orange-500/20 text-orange-300 text-[10px] font-black border border-orange-500/30">
                جوميا مصر 🇪🇬
              </span>
            </div>

            <ul className="space-y-2 text-xs font-bold">
              <li>
                <button onClick={() => navigate('about')} className="hover:text-indigo-400 transition-colors text-slate-300">
                  من نحن
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-indigo-400 transition-colors text-slate-300">
                  اتصل بنا
                </button>
              </li>
              <li>
                <button onClick={() => navigate('privacy')} className="hover:text-indigo-400 transition-colors text-slate-300">
                  سياسة الخصوصية
                </button>
              </li>
              <li>
                <button onClick={() => navigate('terms')} className="hover:text-indigo-400 transition-colors text-slate-300">
                  الشروط والأحكام
                </button>
              </li>
              <li>
                <button onClick={() => navigate('affiliate-disclosure')} className="hover:text-indigo-400 transition-colors text-amber-400 font-extrabold">
                  إفصاح الأفلييت والشفافية
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="font-medium text-center sm:text-right">
            © {new Date().getFullYear()} <strong className="text-slate-300">صفوة العروض</strong>. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4 text-[11px] font-bold">
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <Globe size={13} className="text-indigo-400" />
              منصة مقارنة الأسعار والصفقات الذكية
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
