import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';
import { 
  Search, 
  Sun, 
  Moon, 
  Heart, 
  GitCompare, 
  Menu, 
  X, 
  SlidersHorizontal,
  Settings,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Flame,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentRoute, 
    navigate, 
    darkMode, 
    toggleDarkMode, 
    wishlist, 
    compareList, 
    products, 
    categories 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search results dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products for search autocomplete
  const searchResults = searchQuery.trim()
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      navigate(`products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isLinkActive = (route: string) => {
    if (route === 'home' && (currentRoute === 'home' || currentRoute === '')) return true;
    return currentRoute.startsWith(route);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 shadow-sm">
      
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white text-xs py-2 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shrink-0 animate-pulse">
              جديد اليوم
            </span>
            <span className="hidden sm:inline-block truncate">
              🔥 أحدث صفقات وكوبونات التخفيض في مصر والسعودية - قارن الأسعار واشترِ بأفضل قيمة
            </span>
            <span className="sm:hidden text-center truncate">
              🔥 أقوى خصومات وتخفيضات التسوق اليومية
            </span>
          </div>

          <a 
            href="#affiliate-disclosure"
            className="hidden md:inline-flex items-center gap-1 text-indigo-200 hover:text-white transition-colors text-[11px] shrink-0"
          >
            <ShieldCheck size={13} className="text-amber-400" />
            <span>إفصاح روابط التسوق</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-6">
          
          {/* Brand Logo */}
          <button 
            onClick={() => navigate('home')} 
            className="flex items-center gap-3 text-right group focus:outline-none shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                صفوة العروض
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                  الصفوة
                </span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block -mt-1">
                مقارنة أسعار وروابط تسوق موثوقة
              </span>
            </div>
          </button>

          {/* Search Bar (Desktop & Laptop) */}
          <div className="hidden md:block flex-1 max-w-lg relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="ابحث عن هاتف، لابتوب، جهاز منزلي، أو متجر..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm rounded-2xl py-3 pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all border border-slate-200/80 dark:border-slate-700/80 font-medium shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Instant Search Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full right-0 left-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-bold flex items-center justify-between">
                  <span>نتائج البحث الاقتراحية ({searchResults.length})</span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">اضغط عينة للمعاينة</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-80 overflow-y-auto">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchQuery('');
                        navigate(`product/${product.id}`);
                      }}
                      className="w-full text-right p-3 hover:bg-indigo-50/60 dark:hover:bg-slate-700/60 transition-colors flex items-center gap-3"
                    >
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-12 h-12 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-50" 
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                            {formatCurrency(product.price)}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-[10px] text-slate-400 line-through">
                              {formatCurrency(product.originalPrice)}
                            </span>
                          )}
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md mr-auto">
                            {product.store || 'المتجر الرسمي'}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSearchSubmit}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>عرض جميع نتائج البحث لـ "{searchQuery}"</span>
                  <Search size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Nav Right Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-5 text-xs font-extrabold">
            <button 
              onClick={() => navigate('home')}
              className={`py-2 px-3 rounded-xl transition-all ${
                isLinkActive('home') 
                  ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              الرئيسية
            </button>

            {/* Categories Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className="py-2 px-3 rounded-xl flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <span>الأقسام</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoriesDropdownOpen && (
                <div 
                  className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setCategoriesDropdownOpen(false)}
                >
                  <button
                    onClick={() => {
                      setCategoriesDropdownOpen(false);
                      navigate('categories');
                    }}
                    className="w-full text-right px-4 py-2.5 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700/80 flex items-center justify-between"
                  >
                    <span>جميع الأقسام</span>
                    <SlidersHorizontal size={14} />
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategoriesDropdownOpen(false);
                        navigate(`products?category=${cat.id}`);
                      }}
                      className="w-full text-right px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 font-medium transition-colors"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => navigate('products')}
              className={`py-2 px-3 rounded-xl transition-all ${
                isLinkActive('products') 
                  ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              جميع المنتجات
            </button>

            <button 
              onClick={() => navigate('about')}
              className={`py-2 px-3 rounded-xl transition-all ${
                isLinkActive('about') 
                  ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              من نحن
            </button>

            <button 
              onClick={() => navigate('contact')}
              className={`py-2 px-3 rounded-xl transition-all ${
                isLinkActive('contact') 
                  ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              اتصل بنا
            </button>
          </div>

          {/* Icon Actions */}
          <div className="flex items-center gap-2">
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center cursor-pointer active:scale-95"
              title={darkMode ? "التحويل للوضع الفاتح (Light Mode)" : "التحويل للوضع الداكن (Dark Mode)"}
              aria-label="تبديل الوضع الداكن والفاتح"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              )}
            </button>

            {/* Compare Badge */}
            <button
              onClick={() => navigate('compare')}
              className="p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors relative border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title="أداة مقارنة المنتجات"
              aria-label="جدول المقارنة"
            >
              <GitCompare className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Wishlist Badge */}
            <button
              onClick={() => navigate('wishlist')}
              className="p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors relative border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title="قائمة المفضلة"
              aria-label="قائمة المفضلة"
            >
              <Heart className="w-5 h-5 text-rose-500" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Admin Panel Trigger */}
            <button
              onClick={() => navigate('admin')}
              className="px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 transition-all flex items-center gap-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700"
              title="لوحة تحكم المنتجات"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">لوحة التحكم</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              aria-label="القائمة الجانبية"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Categories Bar Pills (Desktop & Tablet) */}
        <div className="hidden sm:flex items-center gap-2 py-2.5 overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-slate-800/80 text-xs font-bold">
          <button
            onClick={() => navigate('products')}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white shadow-sm shrink-0 hover:bg-indigo-700 transition-colors"
          >
            جميع صفقات اليوم 🔥
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`products?category=${cat.id}`)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 shrink-0 transition-all font-semibold"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-4 pb-8 space-y-4 animate-in slide-in-from-top-4 duration-200">
          
          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="ابحث عن أي منتج أو قسم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-2xl py-3 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
          </form>

          <nav className="flex flex-col space-y-1.5 font-bold text-xs">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('home');
              }}
              className="text-right p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              الرئيسية
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('products');
              }}
              className="text-right p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              جميع المنتجات والعروض
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('categories');
              }}
              className="text-right p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              تصفح الأقسام
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('compare');
              }}
              className="text-right p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between"
            >
              <span>مقارنة المنتجات</span>
              <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{compareList.length}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('wishlist');
              }}
              className="text-right p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between"
            >
              <span>المفضلة</span>
              <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{wishlist.length}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('about');
              }}
              className="text-right p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              من نحن
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('contact');
              }}
              className="text-right p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              اتصل بنا
            </button>

            <button
              onClick={() => {
                toggleDarkMode();
              }}
              className="text-right p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between font-bold"
            >
              <div className="flex items-center gap-2">
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                <span>{darkMode ? 'الوضع الفاتح (نهار)' : 'الوضع الداكن (ليل)'}</span>
              </div>
              <span className="text-[10px] bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-md">
                {darkMode ? 'مفعّل 🌙' : 'مفعّل ☀️'}
              </span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('affiliate-disclosure');
              }}
              className="text-right p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold"
            >
              إفصاح روابط الأفلييت ⚖️
            </button>
          </nav>

          {/* Categories Quick Links Mobile */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-black text-slate-400 block mb-2">تصفح حسب القسم:</span>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(`products?category=${cat.id}`);
                  }}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-right text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
