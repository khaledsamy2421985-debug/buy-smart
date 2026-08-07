import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { SeoHead } from '../components/SeoHead';
import { BuySmartSummaryCard } from '../components/BuySmartSummaryCard';
import { formatCurrency } from '../utils/formatCurrency';
import { 
  Star, 
  ShoppingBag, 
  ExternalLink, 
  Heart, 
  GitCompare, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  ArrowRight,
  Truck,
  RotateCcw,
  Check,
  Store,
  Sparkles,
  Clock
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { 
    selectedProduct, 
    products, 
    navigate, 
    wishlist, 
    toggleWishlist, 
    compareList, 
    toggleCompare 
  } = useApp();

  const [activeImage, setActiveImage] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const cheapestAvailableStore = React.useMemo(() => {
    if (!selectedProduct?.stores || selectedProduct.stores.length === 0) return null;
    const inStockStores = selectedProduct.stores.filter(s => s.inStock && s.price > 0);
    if (inStockStores.length === 0) return null;
    return inStockStores.reduce((prev, curr) => (curr.price < prev.price ? curr : prev));
  }, [selectedProduct]);

  if (!selectedProduct) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">المنتج غير موجود</h2>
        <p className="text-slate-500 text-sm">عذراً، لم نتمكن من العثور على المنتج المطلوبة.</p>
        <button onClick={() => navigate('products')} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold">
          العودة للمنتجات
        </button>
      </div>
    );
  }

  const currentImg = activeImage || selectedProduct.image;
  const isWishlisted = wishlist.includes(selectedProduct.id);
  const isCompared = compareList.includes(selectedProduct.id);

  const relatedProducts = products
    .filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id)
    .slice(0, 4);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-12 pb-16">
      <SeoHead 
        title={selectedProduct.name} 
        description={selectedProduct.description}
        product={selectedProduct}
      />

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <button onClick={() => navigate('home')} className="hover:text-indigo-600">الرئيسية</button>
        <span>/</span>
        <button onClick={() => navigate('products')} className="hover:text-indigo-600">المنتجات</button>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 truncate max-w-xs">{selectedProduct.name}</span>
      </div>

      {/* Main Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-sm">
        
        {/* Gallery Images (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Main Large Zoom Image */}
          <div className="relative aspect-square rounded-2xl bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-700">
            <img 
              src={currentImg} 
              alt={selectedProduct.name}
              className="w-full h-full object-contain p-4 transition-all duration-300" 
            />
            {selectedProduct.discountPercent > 0 && (
              <span className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg">
                خصم {selectedProduct.discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {selectedProduct.gallery && selectedProduct.gallery.length > 0 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {[selectedProduct.image, ...selectedProduct.gallery].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 bg-slate-50 dark:bg-slate-900 transition-all ${
                    currentImg === img ? 'border-indigo-600 scale-105 shadow-md' : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions (7 Columns) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-4">
            
            {/* Store Badge & Star Rating */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold border border-indigo-200 dark:border-indigo-800">
                متوفر على متجر {selectedProduct.store || 'المتجر الرسمي'}
              </span>

              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < Math.floor(selectedProduct.rating) ? 'fill-current text-amber-400' : 'text-slate-300 dark:text-slate-600'} 
                    />
                  ))}
                </div>
                <span className="text-slate-700 dark:text-slate-200 mr-1">
                  {selectedProduct.rating} ({selectedProduct.reviewsCount} تقييم المشتريين)
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 leading-tight">
              {selectedProduct.name}
            </h1>

            {/* Short Description */}
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {selectedProduct.description}
            </p>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 font-bold block">السعر الحالي المتاح</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(selectedProduct.price)}
                  </span>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <span className="text-base text-slate-400 line-through font-bold">
                      {formatCurrency(selectedProduct.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {selectedProduct.discountPercent > 0 && (
                <div className="text-left">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">وفرت معنا</span>
                  <span className="text-base font-black text-rose-500">
                    {formatCurrency(selectedProduct.originalPrice - selectedProduct.price)}
                  </span>
                </div>
              )}
            </div>

            {/* Buy Smart Summary Card - Placed directly BELOW price box & BEFORE affiliate purchase button */}
            <BuySmartSummaryCard product={selectedProduct} />

            {/* Primary CTA Affiliate Button */}
            <div className="space-y-3 pt-2">
              <a
                href={selectedProduct.affiliateUrl}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-3 transition-transform active:scale-98"
              >
                <ShoppingBag size={20} />
                <span>اشترِ الآن عبر رابط المتجر المباشر</span>
                <ExternalLink size={16} />
              </a>

              {/* Secondary Actions (Wishlist, Compare, Share) */}
              <div className="grid grid-cols-3 gap-3">
                
                <button
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className={`py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    isWishlisted 
                      ? 'bg-rose-500 border-rose-500 text-white' 
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
                  <span>{isWishlisted ? 'في المفضلة' : 'حفظ بالمفضلة'}</span>
                </button>

                <button
                  onClick={() => toggleCompare(selectedProduct.id)}
                  className={`py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    isCompared 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <GitCompare size={16} />
                  <span>{isCompared ? 'في المقارنة' : 'إضافة لمقارنة'}</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} />}
                  <span>{copied ? 'تم النسخ' : 'مشاركة الصفحات'}</span>
                </button>
              </div>
            </div>

            {/* FTC Affiliate Transparency Box */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
              <ShieldAlert size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>إفصاح روابط التسوق:</strong> ينقلك زر "اشتر الآن" لمتجر البائع الأصلي مباشرة. نحصل على عمولة بسيطة دعم للموقع بدون أي سعر إضافي عليك.
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Best Available Offer Summary Box */}
      <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
            <Sparkles size={22} />
          </div>
          <div>
            <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 block">
              أفضل عرض متاح (Best available offer):
            </span>
            {cheapestAvailableStore ? (
              <div className="flex items-center gap-3 mt-1">
                <span className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                  {cheapestAvailableStore.storeName}
                </span>
                <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(cheapestAvailableStore.price)}
                </span>
              </div>
            ) : (
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 block">
                غير متوفر حالياً في أي متجر
              </span>
            )}
          </div>
        </div>
        {cheapestAvailableStore && cheapestAvailableStore.affiliateUrl && (
          <a
            href={cheapestAvailableStore.affiliateUrl}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all self-start sm:self-auto"
          >
            <ShoppingBag size={14} />
            <span>الشراء بأفضل سعر من {cheapestAvailableStore.storeName}</span>
            <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* Store Price Comparison Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Store className="text-indigo-600 dark:text-indigo-400" size={22} />
              <span>مقارنة الأسعار في المتاجر (Store Price Comparison)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              قارن بين أسعار المتاجر المختلفة للحصول على أفضل صفقة شراء متاحة حالياً
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800">
            {selectedProduct.stores?.length || 0} متاجر متاحة
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-extrabold">
                <th className="p-3.5 sm:p-4 min-w-[140px]">المتجر (Store)</th>
                <th className="p-3.5 sm:p-4 min-w-[110px]">السعر (Price)</th>
                <th className="p-3.5 sm:p-4 min-w-[130px]">التوافر (Availability)</th>
                <th className="p-3.5 sm:p-4 min-w-[150px]">الشحن (Shipping)</th>
                <th className="p-3.5 sm:p-4 min-w-[130px]">آخر تحديث (Last Updated)</th>
                <th className="p-3.5 sm:p-4 text-center min-w-[160px]">الشراء (Buy Button)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
              {selectedProduct.stores && selectedProduct.stores.length > 0 ? (
                selectedProduct.stores.map((storeOffer, idx) => {
                  const isLinkValid = Boolean(storeOffer.affiliateUrl && storeOffer.affiliateUrl.trim().length > 0);
                  const isBestPrice = cheapestAvailableStore &&
                    storeOffer.storeName === cheapestAvailableStore.storeName &&
                    storeOffer.price === cheapestAvailableStore.price &&
                    storeOffer.inStock;

                  const hasShippingInfo = Boolean(storeOffer.shippingText && storeOffer.shippingText.trim().length > 0);

                  return (
                    <tr key={idx} className={`hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors ${
                      isBestPrice ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                    }`}>
                      {/* Store Name & Best Price Badge */}
                      <td className="p-3.5 sm:p-4 font-black text-slate-900 dark:text-slate-100">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            storeOffer.storeName === 'Amazon' ? 'bg-amber-500' :
                            storeOffer.storeName === 'Jumia' ? 'bg-orange-500' :
                            storeOffer.storeName === 'Noon' ? 'bg-yellow-400' : 'bg-indigo-600'
                          }`} />
                          <span className="text-sm">{storeOffer.storeName}</span>
                          {isBestPrice && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow-sm shrink-0">
                              <Sparkles size={10} className="fill-current" />
                              <span>Best Price (أفضل سعر)</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="p-3.5 sm:p-4 font-black text-indigo-600 dark:text-indigo-400 text-base sm:text-lg">
                        {formatCurrency(storeOffer.price)}
                      </td>

                      {/* Availability */}
                      <td className="p-3.5 sm:p-4">
                        {storeOffer.inStock ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-xl text-xs border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            <span>متوفر بالمخزون</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-xl text-xs border border-rose-200 dark:border-rose-800">
                            <XCircle size={14} className="text-rose-500" />
                            <span>Out of Stock (غير متوفر)</span>
                          </span>
                        )}
                      </td>

                      {/* Shipping */}
                      <td className="p-3.5 sm:p-4">
                        {hasShippingInfo ? (
                          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold text-xs">
                            <Truck size={14} className="text-indigo-500 shrink-0" />
                            <span>{storeOffer.shippingText}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-xs italic font-medium">
                            See seller details
                          </span>
                        )}
                      </td>

                      {/* Last Updated */}
                      <td className="p-3.5 sm:p-4">
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium">
                          <Clock size={13} className="text-slate-400 shrink-0" />
                          <span>{storeOffer.lastUpdated || 'اليوم'}</span>
                        </div>
                      </td>

                      {/* Buy Button */}
                      <td className="p-3.5 sm:p-4 text-center">
                        {storeOffer.inStock && isLinkValid ? (
                          <a
                            href={storeOffer.affiliateUrl}
                            target="_blank"
                            rel="sponsored nofollow noopener"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                          >
                            <ShoppingBag size={14} />
                            <span>شراء من {storeOffer.storeName}</span>
                            <ExternalLink size={12} />
                          </a>
                        ) : (
                          <button
                            disabled
                            aria-disabled="true"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-400 dark:text-slate-500 font-bold text-xs cursor-not-allowed border border-slate-200 dark:border-slate-700 opacity-60"
                          >
                            <ShoppingBag size={14} />
                            <span>{!storeOffer.inStock ? 'Out of Stock (غير متوفر)' : 'الرابط غير متاح'}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400 font-medium">
                    لا توجد بيانات متاجر إضافية لهذا المنتج.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Specifications & Pros/Cons Detailed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Specs Table & Detailed Description (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-3">
              الوصف الكامل للمنتج
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {selectedProduct.longDescription || selectedProduct.description}
            </p>
          </div>

          {/* Technical Specs Table */}
          {selectedProduct.specs && (
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-4">
                المواصفات التقنية والفنية
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden text-xs">
                {Object.entries(selectedProduct.specs).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 p-3.5 bg-white dark:bg-slate-800 odd:bg-slate-50 dark:odd:bg-slate-900/50">
                    <span className="font-bold text-slate-500 dark:text-slate-400">{key}</span>
                    <span className="col-span-2 font-extrabold text-slate-900 dark:text-slate-100">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Pros & Cons (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Pros */}
          {selectedProduct.pros && selectedProduct.pros.length > 0 && (
            <div className="bg-emerald-50/50 dark:bg-emerald-950/30 rounded-3xl p-6 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
              <h3 className="text-base font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span>إيجابيات المنتج حسب مراجعات المستخدمين</span>
              </h3>
              <ul className="space-y-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                {selectedProduct.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-extrabold">✓</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cons */}
          {selectedProduct.cons && selectedProduct.cons.length > 0 && (
            <div className="bg-rose-50/50 dark:bg-rose-950/30 rounded-3xl p-6 border border-rose-200 dark:border-rose-900/50 space-y-3">
              <h3 className="text-base font-black text-rose-800 dark:text-rose-300 flex items-center gap-2">
                <XCircle size={18} className="text-rose-500" />
                <span>ملاحظات قد تهمك قبل الشراء</span>
              </h3>
              <ul className="space-y-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                {selectedProduct.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-500 font-extrabold">✗</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-8">
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
            منتجات ذات صلة في نفس القسم
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
