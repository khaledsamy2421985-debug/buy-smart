import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { CompareDrawer } from './components/CompareDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { ToastNotification } from './components/ToastNotification';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ComparePage } from './pages/ComparePage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AffiliateDisclosurePage } from './pages/AffiliateDisclosurePage';
import { AdminPage } from './pages/AdminPage';

const MainContent: React.FC = () => {
  const { currentRoute } = useApp();

  const renderRoute = () => {
    if (currentRoute.startsWith('product/')) {
      return <ProductDetailPage />;
    }

    if (currentRoute.startsWith('products')) {
      return <ProductsPage />;
    }

    switch (currentRoute) {
      case 'categories':
        return <CategoriesPage />;
      case 'compare':
        return <ComparePage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
        return <TermsPage />;
      case 'affiliate-disclosure':
        return <AffiliateDisclosurePage />;
      case 'admin':
        return <AdminPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-200 dir-rtl">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderRoute()}
      </main>

      <Footer />

      {/* Floating Utilities */}
      <CompareDrawer />
      <QuickViewModal />
      <ToastNotification />
      <ScrollToTop />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

