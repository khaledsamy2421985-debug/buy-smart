import React, { useEffect } from 'react';
import { Product, Category } from '../types';

interface SeoHeadProps {
  title?: string;
  description?: string;
  product?: Product | null;
  category?: Category | null;
  canonicalUrl?: string;
  imageUrl?: string;
  type?: 'website' | 'product' | 'article';
}

const SITE_NAME = 'صفوة العروض';
const DEFAULT_SITE_TITLE = 'صفوة العروض - أفضل عروض وتخفيضات الأفلييت والتسوق الذكي';
const DEFAULT_DESC = 'موقع صفوة العروض يقدم لك مراجعات دقيقة وأفضل الصفقات والتخفيضات اليومية عبر روابط التسوق المباشرة للمتاجر المختلفة.';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop';
const BASE_URL = 'https://safwadeals.com';

function setMetaTag(attribute: 'name' | 'property', attrValue: string, contentValue: string) {
  let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', contentValue);
}

function setCanonicalLink(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  product,
  category,
  canonicalUrl,
  imageUrl,
  type = 'website'
}) => {
  useEffect(() => {
    // 1. Determine Title
    let pageTitle = DEFAULT_SITE_TITLE;
    if (product) {
      pageTitle = `${product.name} - مقارنة الأسعار وأفضل عروض المتاجر | ${SITE_NAME}`;
    } else if (category) {
      pageTitle = `عروض قسم ${category.name} (${category.nameEn}) | ${SITE_NAME}`;
    } else if (title) {
      pageTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    }
    document.title = pageTitle;

    // 2. Determine Description
    let pageDesc = DEFAULT_DESC;
    if (product) {
      pageDesc = product.description 
        ? `${product.name}: ${product.description.slice(0, 150)}... قارن بين أسعار المتاجر المختلفة وفر في صفوة العروض.`
        : `اشترِ ${product.name} بأفضل سعر متاح. قارن بين أسعار المتاجر والمخزون والشحن في صفوة العروض.`;
    } else if (category) {
      pageDesc = `استكشف أحدث عروض وتخفيضات قسم ${category.name} في صفوة العروض. أفضل الصفقات والمنتجات بأسعار تنافسية.`;
    } else if (description) {
      pageDesc = description;
    }

    setMetaTag('name', 'description', pageDesc);

    // 3. Determine Image URL
    const pageImage = imageUrl || product?.image || DEFAULT_IMAGE;

    // 4. Determine Canonical URL
    const currentHash = window.location.hash || '#/';
    let computedCanonical = canonicalUrl || `${BASE_URL}/${currentHash}`;
    if (product) {
      computedCanonical = `${BASE_URL}/#/product/${product.id}`;
    } else if (category) {
      computedCanonical = `${BASE_URL}/#/products?category=${category.id}`;
    }
    setCanonicalLink(computedCanonical);

    // 5. Open Graph Meta Tags
    const pageType = product ? 'product' : type;
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:locale', 'ar_SA');
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDesc);
    setMetaTag('property', 'og:image', pageImage);
    setMetaTag('property', 'og:url', computedCanonical);
    setMetaTag('property', 'og:type', pageType);

    // 6. Twitter Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDesc);
    setMetaTag('name', 'twitter:image', pageImage);

    // 7. Schema.org JSON-LD Structured Data
    let scriptTag = document.getElementById('schema-jsonld') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    if (product) {
      // Build Offers List or Single Offer for Schema
      const offersData = (product.stores && product.stores.length > 0)
        ? product.stores.map(st => ({
            '@type': 'Offer',
            'name': st.storeName,
            'url': st.affiliateUrl || product.affiliateUrl,
            'priceCurrency': 'EGP',
            'price': st.price || product.price,
            'priceValidUntil': '2027-12-31',
            'itemCondition': 'https://schema.org/NewCondition',
            'availability': st.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            'seller': {
              '@type': 'Organization',
              'name': st.storeName
            }
          }))
        : {
            '@type': 'Offer',
            'url': product.affiliateUrl,
            'priceCurrency': 'EGP',
            'price': product.price,
            'priceValidUntil': '2027-12-31',
            'itemCondition': 'https://schema.org/NewCondition',
            'availability': product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
          };

      const productSchema = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        'name': product.name,
        'image': [product.image, ...(product.gallery || [])],
        'description': product.description,
        'sku': product.id,
        'brand': {
          '@type': 'Brand',
          'name': product.store || 'صفوة العروض'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': product.rating || 4.8,
          'reviewCount': product.reviewsCount || 10
        },
        'offers': offersData
      };
      scriptTag.text = JSON.stringify(productSchema);
    } else if (category) {
      const categorySchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': category.name,
        'description': pageDesc,
        'url': computedCanonical,
        'isPartOf': {
          '@type': 'WebSite',
          'name': SITE_NAME,
          'url': BASE_URL
        }
      };
      scriptTag.text = JSON.stringify(categorySchema);
    } else {
      const generalSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': SITE_NAME,
        'url': BASE_URL,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${BASE_URL}/#/products?search={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      };
      scriptTag.text = JSON.stringify(generalSchema);
    }

  }, [title, description, product, category, canonicalUrl, imageUrl, type]);

  return null;
};
