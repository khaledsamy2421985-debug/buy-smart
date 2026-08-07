import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';
import { FilterOptions } from '../types';
import { SlidersHorizontal, RotateCcw, Star, Percent, DollarSign, Tag } from 'lucide-react';

interface ProductFilterProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  totalProductsCount: number;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({ 
  filters, 
  setFilters,
  totalProductsCount
}) => {
  const { categories, products } = useApp();

  const handleCategoryChange = (catId: string) => {
    setFilters(prev => ({ ...prev, category: catId }));
  };

  const handlePriceMaxChange = (val: number) => {
    setFilters(prev => ({ ...prev, maxPrice: val }));
  };

  const handleDiscountChange = (discount: number) => {
    setFilters(prev => ({ ...prev, minDiscount: prev.minDiscount === discount ? 0 : discount }));
  };

  const handleRatingChange = (rating: number) => {
    setFilters(prev => ({ ...prev, minRating: prev.minRating === rating ? 0 : rating }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterOptions['sortBy'] }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      minPrice: 0,
      maxPrice: 10000,
      minRating: 0,
      minDiscount: 0,
      searchQuery: '',
      sortBy: 'featured',
      selectedStore: 'all'
    });
  };

  const handleStoreChange = (storeId: string) => {
    setFilters(prev => ({ ...prev, selectedStore: storeId }));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
      
      {/* Header & Clear */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
            فلترة وتصفية العروض
          </h3>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
        >
          <RotateCcw size={13} />
          <span>إعادة ضبط</span>
        </button>
      </div>

      {/* Sorting Dropdown */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
          ترتيب حسب
        </label>
        <select
          value={filters.sortBy}
          onChange={handleSortChange}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="featured">العروض المميزة والتخفيضات</option>
          <option value="price-asc">السعر: من الأقل للأعلى</option>
          <option value="price-desc">السعر: من الأعلى للأقل</option>
          <option value="discount">نسبة الخصم الأكثر</option>
          <option value="rating">الأعلى تقييماً ⭐</option>
          <option value="newest">الأحدث أضيفت مؤخراً</option>
        </select>
      </div>

      {/* Store Filter Section */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5">
          تصفية حسب المتجر (Filter by Store)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'all', name: 'جميع المتاجر' },
            { id: 'Amazon', name: 'أمازون (Amazon)' },
            { id: 'Jumia', name: 'جوميا (Jumia)' },
            { id: 'Noon', name: 'نون (Noon)' }
          ].map(st => {
            const isSelected = (filters.selectedStore || 'all') === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => handleStoreChange(st.id)}
                className={`py-2 px-2.5 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center text-center ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <span>{st.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category List */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5">
          الأقسام
        </label>
        <div className="space-y-1">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              filters.category === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
            }`}
          >
            <span>جميع الأقسام</span>
            <span className="text-[10px] opacity-80">({products.length})</span>
          </button>

          {categories.map(cat => {
            const count = products.filter(p => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  filters.category === cat.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-80">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Filter Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            الحد الأقصى للسعر
          </label>
          <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
            {formatCurrency(filters.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="10000"
          step="100"
          value={filters.maxPrice}
          onChange={(e) => handlePriceMaxChange(Number(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>{formatCurrency(100)}</span>
          <span>{formatCurrency(10000)}</span>
        </div>
      </div>

      {/* Minimum Discount Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
          حد أدنى للخصم
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[10, 20, 30].map(disc => (
            <button
              key={disc}
              onClick={() => handleDiscountChange(disc)}
              className={`py-2 rounded-xl text-xs font-extrabold border transition-all ${
                filters.minDiscount === disc
                  ? 'bg-rose-500 border-rose-500 text-white shadow-md'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              +{disc}% خصم
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
          التقييم الأدنى
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[4.0, 4.5].map(rating => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`py-2 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center gap-1 ${
                filters.minRating === rating
                  ? 'bg-amber-500 border-amber-500 text-white shadow-md'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Star size={12} className="fill-current text-amber-300" />
              <span>{rating}+ نجوم</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
