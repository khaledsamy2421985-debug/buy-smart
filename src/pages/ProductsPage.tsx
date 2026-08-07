import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ProductFilter } from '../components/ProductFilter';
import { SeoHead } from '../components/SeoHead';
import { Product } from '../types';
import { LayoutGrid, List, SlidersHorizontal, ChevronRight, ChevronLeft, Search } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { products, categories, currentRoute, filters, setFilters } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const activeCategoryObj = useMemo(() => {
    return categories.find(c => c.id === filters.category);
  }, [categories, filters.category]);

  // Extract query param e.g. products?category=electronics or products?search=sony
  useEffect(() => {
    if (currentRoute.includes('?')) {
      const queryString = currentRoute.split('?')[1];
      const params = new URLSearchParams(queryString);
      
      const categoryParam = params.get('category');
      if (categoryParam) {
        setFilters(prev => ({ ...prev, category: categoryParam }));
      }

      const searchParam = params.get('search');
      if (searchParam) {
        setFilters(prev => ({ ...prev, searchQuery: searchParam }));
      }
    }
  }, [currentRoute, setFilters]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category Filter
      if (filters.category !== 'all' && p.category !== filters.category) {
        return false;
      }
      // Max Price Filter
      if (p.price > filters.maxPrice) {
        return false;
      }
      // Min Discount Filter
      if (p.discountPercent < filters.minDiscount) {
        return false;
      }
      // Min Rating Filter
      if (p.rating < filters.minRating) {
        return false;
      }
      // Selected Store Filter
      if (filters.selectedStore && filters.selectedStore !== 'all') {
        const targetStore = filters.selectedStore.toLowerCase();
        const availableInStore = p.stores && p.stores.some(
          s => s.storeName.toLowerCase() === targetStore && s.inStock
        );
        if (!availableInStore) return false;
      }
      // Search Query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }
      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'discount':
          return b.discountPercent - a.discountPercent;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (b.id || '').localeCompare(a.id || '');
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
  }, [products, filters]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Pagination Math
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <div className="space-y-8 pb-12">
      <SeoHead 
        category={activeCategoryObj}
        title={activeCategoryObj ? `عروض قسم ${activeCategoryObj.name}` : "جميع المنتجات والعروض"} 
        description={activeCategoryObj ? `تصفح أفضل صفقات وعروض قسم ${activeCategoryObj.name} (${activeCategoryObj.nameEn}) في صفوة العروض وقارن الأسعار التنافسية.` : "تصفح جميع المنتجات والصفقات المتوفرة في صفوة العروض وقارن الأسعار والخصومات الآن."}
      />

      {/* Page Title & Breadcrumb */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            كتالوج جميع المنتجات والعروض 🛍️
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            اعثر على أفضل صفقات التخفيضات اليومية مع خيارات التصفية والمقارنة الفورية
          </p>
        </div>

        {/* Search Bar inside Page Header */}
        <div className="w-full md:w-72 relative">
          <input
            type="text"
            placeholder="تصفية بالاسم..."
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-xl py-2.5 pr-9 pl-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left/Sidebar Filter Component */}
        <div className="lg:col-span-3">
          <ProductFilter 
            filters={filters} 
            setFilters={setFilters} 
            totalProductsCount={filteredProducts.length}
          />
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Top Bar Info & Grid View Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-slate-600 dark:text-slate-400 shrink-0">
                تم العثور على <strong className="text-indigo-600 dark:text-indigo-400">{filteredProducts.length}</strong> منتج
              </span>

              {/* Quick Store Filter Pills */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                {[
                  { id: 'all', name: 'جميع المتاجر' },
                  { id: 'Amazon', name: 'أمازون' },
                  { id: 'Jumia', name: 'جوميا' },
                  { id: 'Noon', name: 'نون' }
                ].map(st => (
                  <button
                    key={st.id}
                    onClick={() => setFilters(prev => ({ ...prev, selectedStore: st.id }))}
                    className={`px-2.5 py-1 rounded-lg transition-all text-xs font-extrabold ${
                      (filters.selectedStore || 'all') === st.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {st.name}
                  </button>
                ))}
              </div>
            </div>

            {/* View Grid vs List toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="عرض شبكي"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="عرض قائمة"
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Product Items Display */}
          {paginatedProducts.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-500 flex items-center justify-center mx-auto">
                <Search size={28} />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                لم نجد أي منتجات تطابق خيارات الفلترة الحالية
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                جرّب تعديل السعر أو إلغاء فلتر الخصم والبحث لمشاهدة باقي العروض.
              </p>
              <button
                onClick={() => setFilters({
                  category: 'all',
                  minPrice: 0,
                  maxPrice: 10000,
                  minRating: 0,
                  minDiscount: 0,
                  searchQuery: '',
                  sortBy: 'featured'
                })}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
              >
                عرض كل المنتجات
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                aria-label="الصفحة السابقة"
              >
                <ChevronRight size={18} />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                      currentPage === pageNum
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                aria-label="الصفحة التالية"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
