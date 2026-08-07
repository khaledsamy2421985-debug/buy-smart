import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';
import { GitCompare, X, ArrowLeft, Trash2 } from 'lucide-react';

export const CompareDrawer: React.FC = () => {
  const { compareList, products, navigate, toggleCompare, clearCompare } = useApp();

  if (compareList.length === 0) return null;

  const comparedProducts = products.filter(p => compareList.includes(p.id));

  return (
    <div className="fixed bottom-4 right-4 left-4 md:right-8 md:left-auto md:max-w-xl z-40 bg-slate-950/95 text-white backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-800 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <GitCompare size={18} />
          </div>
          <div>
            <h4 className="font-black text-xs sm:text-sm text-white flex items-center gap-1.5">
              <span>شريط المقارنة الذكي</span>
              <span className="text-[10px] font-black text-indigo-300 bg-indigo-900/80 px-2 py-0.5 rounded-full">
                {comparedProducts.length}/4
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 font-medium">قارن بين الأسعار والمواصفات جنبًا إلى جنب</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearCompare}
            className="text-xs text-slate-400 hover:text-rose-400 font-bold px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
          >
            <Trash2 size={13} />
            <span className="hidden sm:inline">إفراغ</span>
          </button>
          <button
            onClick={() => navigate('compare')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <span>قارن الآن</span>
            <ArrowLeft size={14} />
          </button>
        </div>
      </div>

      {/* Selected Products Thumbnails */}
      <div className="grid grid-cols-4 gap-2 pt-3">
        {comparedProducts.map(prod => (
          <div key={prod.id} className="relative group bg-slate-900 rounded-xl p-1.5 border border-slate-800 text-center">
            <button
              onClick={() => toggleCompare(prod.id)}
              className="absolute -top-1.5 -right-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-0.5 hover:scale-110 transition-transform shadow-md"
              title="إزالة من المقارنة"
            >
              <X size={12} />
            </button>
            <img src={prod.image} alt={prod.name} className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg mx-auto mb-1 bg-slate-800" />
            <span className="text-[10px] font-bold text-slate-200 line-clamp-1 block">
              {prod.name}
            </span>
            <span className="text-[10px] text-amber-400 font-black block">
              {formatCurrency(prod.price)}
            </span>
          </div>
        ))}

        {Array.from({ length: 4 - comparedProducts.length }).map((_, i) => (
          <div key={i} className="border-2 border-dashed border-slate-800/80 rounded-xl flex flex-col items-center justify-center p-2 text-slate-500 text-[10px] font-semibold">
            <span>اختر منتجاً</span>
          </div>
        ))}
      </div>
    </div>
  );
};
