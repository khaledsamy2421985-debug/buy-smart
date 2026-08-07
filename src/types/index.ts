export interface StoreOffer {
  storeName: string;
  price: number;
  affiliateUrl: string;
  inStock: boolean;
  shippingText?: string;
  lastUpdated?: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  gallery?: string[];
  description: string;
  longDescription?: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  affiliateUrl: string;
  category: string;
  featured?: boolean;
  inStock?: boolean;
  store?: string;
  stores?: StoreOffer[];
  brand?: string;
  badge?: string;
  specs?: Record<string, string>;
  pros?: string[];
  cons?: string[];
  features?: string[];
  seoTitle?: string;
  seoMetaDescription?: string;
  tags?: string[];
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  image: string;
  description: string;
  count?: number;
}

export interface FilterOptions {
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  minDiscount: number;
  searchQuery: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount' | 'newest';
  selectedStore?: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  currency: string;
  currencySymbol: string;
  affiliateDisclaimer: string;
  contactEmail: string;
  contactPhone: string;
}
