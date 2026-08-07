import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, FilterOptions } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { CATEGORIES } from '../data/categories';

export interface ToastData {
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  products: Product[];
  categories: Category[];
  wishlist: string[];
  compareList: string[];
  darkMode: boolean;
  currentRoute: string;
  selectedProduct: Product | null;
  quickViewProduct: Product | null;
  filters: FilterOptions;
  toast: ToastData | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  hideToast: () => void;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  toggleWishlist: (id: string) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  toggleDarkMode: () => void;
  navigate: (route: string) => void;
  setQuickViewProduct: (product: Product | null) => void;
  addProduct: (product: Product) => void;
  addProductsBulk: (newProds: Product[]) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  importProductsFromJson: (jsonStr: string) => boolean;
  resetProductsToDefault: () => void;
  exportProductsJson: () => string;
}

const defaultFilters: FilterOptions = {
  category: 'all',
  minPrice: 0,
  maxPrice: 10000,
  minRating: 0,
  minDiscount: 0,
  searchQuery: '',
  sortBy: 'featured',
  selectedStore: 'all'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products from localStorage or default
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('safwa_products');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved products', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('safwa_wishlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Compare List
  const [compareList, setCompareList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('safwa_compare');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('safwa_theme');
      if (saved !== null) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  });

  // Route state (Hash-based routing for 100% compatibility with Netlify & GitHub Pages)
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });

  // Filters state
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  // Toast state
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  // Quick view product modal state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Save products to localStorage
  useEffect(() => {
    try {
      console.log('STEP 7: localStorage save started', { totalProducts: products.length });
      localStorage.setItem('safwa_products', JSON.stringify(products));
      console.log('localStorage saved successfully');
    } catch (e) {
      console.error('Failed to save products to localStorage (Quota or storage error):', e);
    }
  }, [products]);

  // Save wishlist
  useEffect(() => {
    try {
      localStorage.setItem('safwa_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Save compare
  useEffect(() => {
    try {
      localStorage.setItem('safwa_compare', JSON.stringify(compareList));
    } catch (e) {
      console.error(e);
    }
  }, [compareList]);

  // Handle dark mode class on HTML root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('safwa_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('safwa_theme', 'light');
    }
  }, [darkMode]);

  // Hash route listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentRoute(hash || 'home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const exists = prev.includes(id);
      const targetProd = products.find(p => p.id === id);
      const prodName = targetProd ? targetProd.name : 'المنتج';
      if (exists) {
        showToast(`تمت إزالة "${prodName}" من قائمة المفضلة`, 'info');
        return prev.filter(item => item !== id);
      } else {
        showToast(`تمت إضافة "${prodName}" إلى قائمة المفضلة ❤️`, 'success');
        return [...prev, id];
      }
    });
  };

  const toggleCompare = (id: string) => {
    const targetProd = products.find(p => p.id === id);
    const prodName = targetProd ? targetProd.name : 'المنتج';
    setCompareList(prev => {
      if (prev.includes(id)) {
        showToast(`تمت إزالة "${prodName}" من المقارنة`, 'info');
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 4) {
        showToast('يمكنك مقارنة 4 منتجات كحد أقصى في نفس الوقت', 'error');
        return prev;
      }
      showToast(`تمت إضافة "${prodName}" إلى أداة المقارنة ⚖️`, 'success');
      return [...prev, id];
    });
  };

  const clearCompare = () => {
    setCompareList([]);
    showToast('تم إفراغ قائمة المقارنة بنجاح', 'info');
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const nextMode = !prev;
      if (nextMode) {
        showToast('تم تفعيل الوضع الداكن 🌙', 'info');
      } else {
        showToast('تم تفعيل الوضع الفاتح ☀️', 'info');
      }
      return nextMode;
    });
  };

  // Compute selected product if route is product detail, e.g. "product/prod-001"
  const selectedProduct = React.useMemo(() => {
    if (currentRoute.startsWith('product/')) {
      const id = currentRoute.replace('product/', '');
      return products.find(p => p.id === id) || null;
    }
    return null;
  }, [currentRoute, products]);

  // Admin Actions
  const addProduct = (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
  };

  const addProductsBulk = (newProds: Product[]) => {
    if (!newProds || newProds.length === 0) return;
    setProducts(prev => {
      console.log('STEP 8: State updated', { added: newProds.length, total: prev.length + newProds.length });
      return [...newProds, ...prev];
    });
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setWishlist(prev => prev.filter(wId => wId !== id));
    setCompareList(prev => prev.filter(cId => cId !== id));
  };

  const importProductsFromJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) {
        setProducts(parsed);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const resetProductsToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem('safwa_products');
  };

  const exportProductsJson = () => {
    return JSON.stringify(products, null, 2);
  };

  return (
    <AppContext.Provider value={{
      products,
      categories: CATEGORIES,
      wishlist,
      compareList,
      darkMode,
      currentRoute,
      selectedProduct,
      quickViewProduct,
      filters,
      toast,
      showToast,
      hideToast,
      setFilters,
      toggleWishlist,
      toggleCompare,
      clearCompare,
      toggleDarkMode,
      navigate,
      setQuickViewProduct,
      addProduct,
      addProductsBulk,
      updateProduct,
      deleteProduct,
      importProductsFromJson,
      resetProductsToDefault,
      exportProductsJson
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
