import React, { useState } from 'react';
import Papa from 'papaparse';
import { useApp } from '../context/AppContext';
import { SeoHead } from '../components/SeoHead';
import { Product } from '../types';
import { generateSitemapXml } from '../utils/sitemapGenerator';
import { CheckCircle2, Store, Save, FileCode, Download, Upload, FileSpreadsheet, AlertCircle, Sparkles, Loader2, Tag, ListChecks, Wand2, Link2, Globe, Award } from 'lucide-react';

function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let current = '';
  let insideQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (insideQuote && next === '"') {
        current += '"';
        i++;
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      row.push(current.trim());
      current = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && next === '\n') {
        i++;
      }
      row.push(current.trim());
      if (row.some(cell => cell.length > 0)) {
        lines.push(row);
      }
      row = [];
      current = '';
    } else {
      current += char;
    }
  }
  if (current.length > 0 || row.length > 0) {
    row.push(current.trim());
    if (row.some(cell => cell.length > 0)) {
      lines.push(row);
    }
  }

  return lines;
}

function parseStockVal(val: string | undefined): boolean {
  if (!val || val.trim() === '') return true;
  const normalized = val.trim().toLowerCase();
  if (['false', '0', 'no', 'out of stock', 'outofstock', 'unavailable', 'لا', 'غير متوفر'].includes(normalized)) {
    return false;
  }
  return true;
}

export const AdminPage: React.FC = () => {
  const { categories, products, addProduct, addProductsBulk, showToast } = useApp();

  const isMountedRef = React.useRef(true);
  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Basic Product Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || 'electronics');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');

  // AI Product Generator State
  const [aiProductName, setAiProductName] = useState('');
  const [productUrlInput, setProductUrlInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState(false);

  // Additional Generated Product Fields
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoMetaDescription, setSeoMetaDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Stores Fields
  const [amazonPrice, setAmazonPrice] = useState<string>('');
  const [amazonUrl, setAmazonUrl] = useState<string>('');
  const [amazonInStock, setAmazonInStock] = useState<boolean>(true);

  const [jumiaPrice, setJumiaPrice] = useState<string>('');
  const [jumiaUrl, setJumiaUrl] = useState<string>('');
  const [jumiaInStock, setJumiaInStock] = useState<boolean>(true);

  const [noonPrice, setNoonPrice] = useState<string>('');
  const [noonUrl, setNoonUrl] = useState<string>('');
  const [noonInStock, setNoonInStock] = useState<boolean>(true);

  const [submitted, setSubmitted] = useState(false);

  // CSV Import state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvImportResult, setCsvImportResult] = useState<{
    importedCount: number;
    skippedCount: number;
  } | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<number>(0);
  const [importStatusMessage, setImportStatusMessage] = useState<string>('');

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('STEP 1: File selected', file.name, 'Size:', file.size, 'bytes');
      setCsvFile(file);
      setCsvImportResult(null);
      setImportProgress(0);
      setImportStatusMessage('');
    }
  };

  const processCsvImport = async () => {
    if (!csvFile) {
      showToast('الرجاء اختيار ملف CSV أولاً', 'error');
      return;
    }

    console.log('STEP 1: File selected - Starting import process for:', csvFile.name);
    setIsImporting(true);
    setImportProgress(0);
    setImportStatusMessage('جاري قراءة الملف...');
    setCsvImportResult(null);

    try {
      console.log('STEP 2: FileReader started');
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve((e.target?.result as string) || '');
        };
        reader.onerror = (err) => {
          console.error('FileReader error event:', err);
          reject(new Error('حدث خطأ أثناء قراءة ملف CSV من جهازك'));
        };
        reader.readAsText(csvFile, 'UTF-8');
      });

      const cleanText = text.replace(/^\uFEFF/, '').trim();
      if (!cleanText) {
        throw new Error('ملف CSV فارغ أو لا يحتوي على بيانات');
      }

      setImportStatusMessage('جاري تحليل محتوى الملف بواسطة PapaParse...');
      
      // Use PapaParse to safely parse all rows without hanging on unbalanced quotes
      const parsed = Papa.parse<string[]>(cleanText, {
        skipEmptyLines: 'greedy',
      });

      if (parsed.errors && parsed.errors.length > 0) {
        console.warn('PapaParse warnings/errors during parsing:', parsed.errors);
      }

      console.log('STEP 3: CSV parsed', { rowsParsed: parsed.data ? parsed.data.length : 0 });
      const rows = (parsed.data || []) as string[][];

      console.log('STEP 4: Rows count', rows.length);

      if (rows.length === 0) {
        throw new Error('لم يتم العثور على أسطر صالحة داخل ملف CSV');
      }

      // Headers analysis
      const rawHeaders = rows[0].map(h => (h || '').trim().toLowerCase());
      const hasHeader = rawHeaders.some(h => 
        h.includes('name') || h.includes('title') || h.includes('category') || 
        h.includes('amazon') || h.includes('jumia') || h.includes('noon') || 
        h.includes('اسم') || h.includes('وصف') || h.includes('صورة') || h.includes('قسم')
      );

      const dataRows = hasHeader ? rows.slice(1) : rows;

      if (dataRows.length === 0) {
        throw new Error('ملف CSV يحتوي على العناوين فقط ولا توجد صفوف منتجات');
      }

      // Default positional indices
      let nameIdx = 0;
      let catIdx = 1;
      let imgIdx = 2;
      let descIdx = 3;
      let amazonPriceIdx = 4;
      let amazonUrlIdx = 5;
      let amazonStockIdx = 6;
      let jumiaPriceIdx = 7;
      let jumiaUrlIdx = 8;
      let jumiaStockIdx = 9;
      let noonPriceIdx = 10;
      let noonUrlIdx = 11;
      let noonStockIdx = 12;

      if (hasHeader) {
        rawHeaders.forEach((h, idx) => {
          if (h === 'name' || h.includes('name') || h.includes('title') || h === 'اسم' || h === 'اسم المنتج' || h === 'الاسم') {
            nameIdx = idx;
          } else if (h === 'category' || h.includes('category') || h === 'قسم' || h === 'التصنيف' || h === 'فئة') {
            catIdx = idx;
          } else if (h === 'image' || h.includes('image') || h === 'صورة' || h === 'الصورة' || h === 'رابط الصورة') {
            imgIdx = idx;
          } else if (h === 'description' || h.includes('desc') || h === 'وصف' || h === 'الوصف' || h === 'تفاصيل') {
            descIdx = idx;
          } else if ((h.includes('amazon') || h.includes('امازون')) && h.includes('price')) {
            amazonPriceIdx = idx;
          } else if ((h.includes('amazon') || h.includes('امازون')) && h.includes('url')) {
            amazonUrlIdx = idx;
          } else if ((h.includes('amazon') || h.includes('امازون')) && (h.includes('stock') || h.includes('in_stock') || h.includes('مخزون'))) {
            amazonStockIdx = idx;
          } else if ((h.includes('jumia') || h.includes('جوميا')) && h.includes('price')) {
            jumiaPriceIdx = idx;
          } else if ((h.includes('jumia') || h.includes('جوميا')) && h.includes('url')) {
            jumiaUrlIdx = idx;
          } else if ((h.includes('jumia') || h.includes('جوميا')) && (h.includes('stock') || h.includes('in_stock') || h.includes('مخزون'))) {
            jumiaStockIdx = idx;
          } else if ((h.includes('noon') || h.includes('نون')) && h.includes('price')) {
            noonPriceIdx = idx;
          } else if ((h.includes('noon') || h.includes('نون')) && h.includes('url')) {
            noonUrlIdx = idx;
          } else if ((h.includes('noon') || h.includes('نون')) && (h.includes('stock') || h.includes('in_stock') || h.includes('مخزون'))) {
            noonStockIdx = idx;
          }
        });
      }

      const newProductsList: Product[] = [];
      let importedCount = 0;
      let skippedCount = 0;
      const totalRows = dataRows.length;

      for (let i = 0; i < totalRows; i++) {
        const row = dataRows[i];

        // Yield control every 25 rows for smooth UI updates
        if (i % 25 === 0) {
          const progressPercent = Math.round(((i + 1) / totalRows) * 100);
          if (isMountedRef.current) {
            setImportProgress(progressPercent);
            setImportStatusMessage(`جاري معالجة الصف ${i + 1} من أصل ${totalRows}...`);
          }
          await new Promise((r) => setTimeout(r, 0));
        }

        const rowName = row[nameIdx]?.trim();
        if (!rowName) {
          skippedCount++;
          continue;
        }

        const rawCategory = row[catIdx]?.trim() || '';
        let matchedCategory = categories[0]?.id || 'electronics';
        if (rawCategory) {
          const found = categories.find(c =>
            c.id.toLowerCase() === rawCategory.toLowerCase() ||
            c.name.toLowerCase() === rawCategory.toLowerCase() ||
            c.nameEn.toLowerCase() === rawCategory.toLowerCase() ||
            c.slug.toLowerCase() === rawCategory.toLowerCase()
          );
          if (found) {
            matchedCategory = found.id;
          } else {
            matchedCategory = rawCategory.toLowerCase().replace(/\s+/g, '-');
          }
        }

        const rowImage = row[imgIdx]?.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop';
        const rowDesc = row[descIdx]?.trim() || '';

        const amzPriceRaw = (row[amazonPriceIdx] || '').replace(/[^0-9.]/g, '');
        const amzPrice = parseFloat(amzPriceRaw) || 0;
        const amzUrl = row[amazonUrlIdx]?.trim() || '';
        const amzStock = parseStockVal(row[amazonStockIdx]);

        const jumPriceRaw = (row[jumiaPriceIdx] || '').replace(/[^0-9.]/g, '');
        const jumPrice = parseFloat(jumPriceRaw) || 0;
        const jumUrl = row[jumiaUrlIdx]?.trim() || '';
        const jumStock = parseStockVal(row[jumiaStockIdx]);

        const noonPriceRaw = (row[noonPriceIdx] || '').replace(/[^0-9.]/g, '');
        const nPrice = parseFloat(noonPriceRaw) || 0;
        const nUrl = row[noonUrlIdx]?.trim() || '';
        const nStock = parseStockVal(row[noonStockIdx]);

        const validPrices = [amzPrice, jumPrice, nPrice].filter(p => p > 0);
        const mainPrice = validPrices.length > 0 ? Math.min(...validPrices) : 100;

        const newProduct: Product = {
          id: `prod-csv-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          name: rowName,
          description: rowDesc,
          category: matchedCategory,
          image: rowImage,
          price: mainPrice,
          originalPrice: Math.round(mainPrice * 1.2),
          discountPercent: 15,
          rating: 4.8,
          reviewsCount: 1,
          store: amzPrice > 0 ? 'Amazon' : jumPrice > 0 ? 'Jumia' : 'Noon',
          affiliateUrl: amzUrl || jumUrl || nUrl || '',
          inStock: amzStock || jumStock || nStock,
          stores: [
            {
              storeName: 'Amazon',
              price: amzPrice,
              affiliateUrl: amzUrl,
              inStock: amzStock,
              shippingText: 'شحن مجاني (Free Shipping)',
              lastUpdated: new Date().toISOString().slice(0, 10)
            },
            {
              storeName: 'Jumia',
              price: jumPrice,
              affiliateUrl: jumUrl,
              inStock: jumStock,
              shippingText: 'تطبق رسوم الشحن (Shipping fees apply)',
              lastUpdated: new Date().toISOString().slice(0, 10)
            },
            {
              storeName: 'Noon',
              price: nPrice,
              affiliateUrl: nUrl,
              inStock: nStock,
              shippingText: 'توصيل اكسبرس (Express Delivery)',
              lastUpdated: new Date().toISOString().slice(0, 10)
            }
          ]
        };

        newProductsList.push(newProduct);
        importedCount++;
      }

      console.log('STEP 5: Products mapped', { newProductsCount: newProductsList.length, skippedCount });

      if (importedCount > 0) {
        console.log('STEP 6: addProductsBulk started', newProductsList.length);
        addProductsBulk(newProductsList);
      }

      setImportProgress(100);
      setCsvImportResult({
        importedCount,
        skippedCount
      });

      if (importedCount > 0) {
        showToast(
          `تم استيراد ${importedCount} منتج بنجاح!${skippedCount > 0 ? ` (تم تخطي ${skippedCount} صفوف غير صالحة)` : ''}`,
          'success'
        );
      } else {
        showToast(`لم يتم استيراد أي منتجات. تم تخطي ${skippedCount} صفوف غير صالحة.`, 'info');
      }

      console.log('STEP 9: Import finished');
    } catch (err: any) {
      console.error('CSV Import stopped due to exception:', err);
      if (err && err.stack) {
        console.error('Stack Trace:', err.stack);
      }
      const errMsg = err?.message || 'حدث خطأ غير متوقع أثناء استيراد ملف CSV';
      showToast(errMsg, 'error');
    } finally {
      setIsImporting(false);
      setImportStatusMessage('');
    }
  };

  const downloadSampleCsv = () => {
    const sampleHeaders = [
      'Name',
      'Category',
      'Image',
      'Description',
      'Amazon Price',
      'Amazon URL',
      'Amazon Stock',
      'Jumia Price',
      'Jumia URL',
      'Jumia Stock',
      'Noon Price',
      'Noon URL',
      'Noon Stock'
    ];

    const sampleRows = [
      [
        'شاشة سامسونج 55 بوصة Smart 4K UHD',
        'electronics',
        'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=800',
        'شاشة سامسونج سمارت 55 بوصة بدقة 4K فائقة الوضوح مع تقنية HDR ومحرك كريستال.',
        '18499',
        'https://www.amazon.eg/dp/B0CX123456?tag=safwadeals-20',
        'true',
        '18999',
        'https://www.jumia.com.eg/samsung-55-4k-tv.html',
        'true',
        '18299',
        'https://www.noon.com/egypt-ar/samsung-55-4k/N12345678A/p/',
        'true'
      ]
    ];

    const csvContent = [
      sampleHeaders.join(','),
      ...sampleRows.map(r => r.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_products.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateProduct = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetName = aiProductName.trim() || name.trim();
    if (!targetName) {
      setGenerateError('الرجاء إدخال اسم المنتج أولاً للتوليد بالذكاء الاصطناعي (Please enter product name)');
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);
    setGenerateSuccess(false);

    try {
      const response = await fetch('/api/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: targetName,
          categories
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'فشل توليد البيانات بالذكاء الاصطناعي');
      }

      const data = await response.json();

      // Automatically fill the existing form:
      setName(targetName);
      if (data.shortDescription) {
        setDescription(data.shortDescription);
      }
      if (Array.isArray(data.keyFeatures) && data.keyFeatures.length > 0) {
        setKeyFeatures(data.keyFeatures);
      }
      if (data.category) {
        const foundCategory = categories.find(c => 
          c.id.toLowerCase() === data.category.toLowerCase() ||
          c.slug.toLowerCase() === data.category.toLowerCase()
        );
        if (foundCategory) {
          setCategory(foundCategory.id);
        } else if (categories.some(c => c.id === data.category)) {
          setCategory(data.category);
        }
      }
      if (data.seoTitle) {
        setSeoTitle(data.seoTitle);
      }
      if (data.seoMetaDescription) {
        setSeoMetaDescription(data.seoMetaDescription);
      }
      if (Array.isArray(data.tags)) {
        setTagsInput(data.tags.join(', '));
      }

      setGenerateSuccess(true);
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      setGenerateError(err.message || 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateProductFromUrl = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetUrl = productUrlInput.trim();
    if (!targetUrl) {
      setGenerateError('الرجاء إدخال رابط منتج من (أمازون مصر، جوميا مصر، أو نون مصر) أولاً');
      return;
    }

    setIsGeneratingUrl(true);
    setGenerateError(null);
    setGenerateSuccess(false);

    try {
      const response = await fetch('/api/generate-product-from-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          categories
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'فشل استخراج وتوليد بيانات المنتج من الرابط');
      }

      const data = await response.json();

      // Automatically fill the existing form:
      if (data.productName) {
        setName(data.productName);
        setAiProductName(data.productName);
      }
      if (data.shortDescription) {
        setDescription(data.shortDescription);
      }
      if (data.brand) {
        setBrand(data.brand);
      }
      if (data.mainImage) {
        setImage(data.mainImage);
      }
      if (Array.isArray(data.keyFeatures) && data.keyFeatures.length > 0) {
        setKeyFeatures(data.keyFeatures);
      }
      if (data.category) {
        const foundCategory = categories.find(c => 
          c.id.toLowerCase() === data.category.toLowerCase() ||
          c.slug.toLowerCase() === data.category.toLowerCase()
        );
        if (foundCategory) {
          setCategory(foundCategory.id);
        } else if (categories.some(c => c.id === data.category)) {
          setCategory(data.category);
        }
      }
      if (data.seoTitle) {
        setSeoTitle(data.seoTitle);
      }
      if (data.seoMetaDescription) {
        setSeoMetaDescription(data.seoMetaDescription);
      }
      if (Array.isArray(data.tags)) {
        setTagsInput(data.tags.join(', '));
      }

      // Preserve the user's affiliate URL in the appropriate store field
      if (data.isAmazon || targetUrl.toLowerCase().includes('amazon')) {
        setAmazonUrl(targetUrl);
      } else if (data.isJumia || targetUrl.toLowerCase().includes('jumia')) {
        setJumiaUrl(targetUrl);
      } else if (data.isNoon || targetUrl.toLowerCase().includes('noon')) {
        setNoonUrl(targetUrl);
      } else {
        setAmazonUrl(targetUrl);
      }

      if (data.asin) {
        showToast(`تم استخراج ASIN للمنتج بنجاح: ${data.asin}`, 'success');
      }

      setGenerateSuccess(true);
    } catch (err: any) {
      console.error("AI URL Generation Error:", err);
      setGenerateError(err.message || 'حدث خطأ أثناء تحليل الرابط بالذكاء الاصطناعي');
    } finally {
      setIsGeneratingUrl(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amazonP = parseFloat(amazonPrice) || 0;
    const jumiaP = parseFloat(jumiaPrice) || 0;
    const noonP = parseFloat(noonPrice) || 0;

    // Pick main price as the lowest non-zero or first available store price
    const validPrices = [amazonP, jumiaP, noonP].filter(p => p > 0);
    const mainPrice = validPrices.length > 0 ? Math.min(...validPrices) : 100;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: name.trim() || 'منتج جديد',
      description: description.trim(),
      category: category,
      image: image.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
      price: mainPrice,
      originalPrice: Math.round(mainPrice * 1.2),
      discountPercent: 15,
      rating: 4.8,
      reviewsCount: 1,
      store: 'Amazon',
      affiliateUrl: amazonUrl || jumiaUrl || noonUrl || '',
      inStock: amazonInStock || jumiaInStock || noonInStock,
      brand: brand.trim() || undefined,
      pros: keyFeatures.length > 0 ? keyFeatures : undefined,
      features: keyFeatures.length > 0 ? keyFeatures : undefined,
      seoTitle: seoTitle.trim() || undefined,
      seoMetaDescription: seoMetaDescription.trim() || undefined,
      tags: tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      stores: [
        {
          storeName: 'Amazon',
          price: amazonP,
          affiliateUrl: amazonUrl.trim(),
          inStock: amazonInStock,
          shippingText: 'شحن مجاني (Free Shipping)',
          lastUpdated: new Date().toISOString().slice(0, 10)
        },
        {
          storeName: 'Jumia',
          price: jumiaP,
          affiliateUrl: jumiaUrl.trim(),
          inStock: jumiaInStock,
          shippingText: 'تطبق رسوم الشحن (Shipping fees apply)',
          lastUpdated: new Date().toISOString().slice(0, 10)
        },
        {
          storeName: 'Noon',
          price: noonP,
          affiliateUrl: noonUrl.trim(),
          inStock: noonInStock,
          shippingText: 'توصيل اكسبرس (Express Delivery)',
          lastUpdated: new Date().toISOString().slice(0, 10)
        }
      ]
    };

    addProduct(newProduct);
    setSubmitted(true);

    // Reset Form
    setName('');
    setDescription('');
    setImage('');
    setBrand('');
    setAiProductName('');
    setProductUrlInput('');
    setKeyFeatures([]);
    setSeoTitle('');
    setSeoMetaDescription('');
    setTagsInput('');
    setGenerateSuccess(false);
    setGenerateError(null);
    setAmazonPrice('');
    setAmazonUrl('');
    setAmazonInStock(true);
    setJumiaPrice('');
    setJumiaUrl('');
    setJumiaInStock(true);
    setNoonPrice('');
    setNoonUrl('');
    setNoonInStock(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <>
      <SeoHead
        title="إضافة منتج جديد - لوحة التحكم"
        description="صفحة إضافة منتج جديد ومقارنة أسعار المتاجر"
      />

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Import CSV Section */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <FileSpreadsheet size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                  استيراد منتجات عبر CSV (Import CSV)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  ارفع ملف CSV يحتوي على تفاصيل المنتجات وأسعار المتاجر لإضافتها دفعة واحدة
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={downloadSampleCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shrink-0"
            >
              <Download size={14} className="text-indigo-500" />
              <span>تحميل قالب نموذجي (Sample CSV)</span>
            </button>
          </div>

          {/* Expected Columns Info */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="font-bold text-slate-800 dark:text-slate-200">الأعمدة المطلوبة (Columns):</div>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px] ltr" dir="ltr">
              {['Name', 'Category', 'Image', 'Description', 'Amazon Price', 'Amazon URL', 'Amazon Stock', 'Jumia Price', 'Jumia URL', 'Jumia Stock', 'Noon Price', 'Noon URL', 'Noon Stock'].map(col => (
                <span key={col} className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300">
                  {col}
                </span>
              ))}
            </div>
          </div>

          {/* Upload Drop Zone / Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="flex-1 w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-900/40 cursor-pointer transition-all">
              <Upload size={20} className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                {csvFile ? csvFile.name : 'اختر أو اسحب ملف CSV هنا (Upload CSV file)'}
              </span>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleCsvUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              disabled={!csvFile || isImporting}
              onClick={processCsvImport}
              className={`w-full sm:w-auto px-6 py-4 rounded-2xl font-black text-xs text-white shadow-md transition-all flex items-center justify-center gap-2 shrink-0 ${
                !csvFile || isImporting
                  ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-60'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-600/20'
              }`}
            >
              {isImporting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>جاري المعالجة ({importProgress}%)...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet size={16} />
                  <span>بدء الاستيراد (Start Import)</span>
                </>
              )}
            </button>
          </div>

          {/* Import Progress Bar */}
          {isImporting && (
            <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-200">
                <span>{importStatusMessage || 'جاري المعالجة...'}</span>
                <span>{importProgress}%</span>
              </div>
              <div className="w-full bg-indigo-200 dark:bg-indigo-900 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 dark:bg-indigo-400 h-full transition-all duration-200 rounded-full"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Results Display */}
          {csvImportResult && (
            <div className="p-4 rounded-2xl border bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-bold space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-extrabold text-base">
                <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                <span>تمت معالجة ملف CSV بنجاح!</span>
              </div>
              <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-3 text-slate-800 dark:text-slate-200 font-bold">
                <span className="bg-emerald-100 dark:bg-emerald-900/80 px-3 py-1.5 rounded-xl text-emerald-800 dark:text-emerald-200">
                  Imported successfully: {csvImportResult.importedCount} products
                </span>
                <span className="bg-amber-100 dark:bg-amber-900/80 px-3 py-1.5 rounded-xl text-amber-800 dark:text-amber-200">
                  Skipped: {csvImportResult.skippedCount} rows
                </span>
              </div>
            </div>
          )}
        </div>

        {/* AI Product Generator Section */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-8 border border-indigo-800/60 shadow-xl space-y-6">
          <div className="flex items-center justify-between gap-4 border-b border-indigo-800/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center shrink-0">
                <Sparkles size={22} className="text-amber-300 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <span>مولد بيانات المنتج بالذكاء الاصطناعي</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 font-bold">AI Powered</span>
                </h2>
                <p className="text-xs text-indigo-200 mt-0.5">
                  ضع رابط المنتج من (أمازون مصر / جوميا مصر / نون مصر) أو أدخل اسم المنتج لاستخراج وتوليد بياناته تلقائياً
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* 1. Generate From URL */}
            <form onSubmit={handleGenerateProductFromUrl} className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
                  <Link2 size={16} className="text-amber-400" />
                  <span>توليد من رابط المتجر (Amazon Egypt / Jumia Egypt / Noon Egypt)</span>
                </label>
                <span className="text-[11px] text-amber-300/80 font-medium">أمازون - جوميا - نون مصر</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  value={productUrlInput}
                  onChange={(e) => setProductUrlInput(e.target.value)}
                  placeholder="https://www.amazon.eg/dp/... أو https://www.jumia.com.eg/... أو https://www.noon.com/egypt-ar/..."
                  className="flex-1 px-4 py-3.5 rounded-2xl bg-indigo-950/80 border border-indigo-700/80 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm font-medium ltr"
                  dir="ltr"
                />

                <button
                  type="submit"
                  disabled={isGeneratingUrl || !productUrlInput.trim()}
                  className={`px-6 py-3.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shrink-0 ${
                    isGeneratingUrl || !productUrlInput.trim()
                      ? 'bg-indigo-800/60 text-indigo-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95'
                  }`}
                >
                  {isGeneratingUrl ? (
                    <>
                      <Loader2 size={18} className="animate-spin text-slate-950" />
                      <span>جاري الاستخراج بالذكاء الاصطناعي...</span>
                    </>
                  ) : (
                    <>
                      <Globe size={18} className="text-slate-950" />
                      <span>Generate Product From URL</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-indigo-800/60"></div>
              <span className="flex-shrink mx-4 text-[11px] font-bold text-indigo-300/70 bg-indigo-950/90 px-3 py-1 rounded-full border border-indigo-800/50">أو توليد من اسم المنتج</span>
              <div className="flex-grow border-t border-indigo-800/60"></div>
            </div>

            {/* 2. Generate From Name */}
            <form onSubmit={handleGenerateProduct} className="space-y-3">
              <label className="block text-xs font-bold text-indigo-200">
                توليد بواسطة اسم المنتج فقط (Product Name)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={aiProductName}
                  onChange={(e) => {
                    setAiProductName(e.target.value);
                    if (!name) setName(e.target.value);
                  }}
                  placeholder="مثال: ايفون 16 بروماكس 256 جيجا أو شاشة ال جي 65 بوصة OLED"
                  className="flex-1 px-4 py-3.5 rounded-2xl bg-indigo-950/80 border border-indigo-700/80 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm font-medium"
                />

                <button
                  type="submit"
                  disabled={isGenerating || (!aiProductName.trim() && !name.trim())}
                  className={`px-6 py-3.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shrink-0 ${
                    isGenerating || (!aiProductName.trim() && !name.trim())
                      ? 'bg-indigo-800/60 text-indigo-400 cursor-not-allowed'
                      : 'bg-indigo-800/80 hover:bg-indigo-700 text-indigo-100 border border-indigo-600/80 active:scale-95'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={18} className="animate-spin text-amber-300" />
                      <span>جاري التوليد...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 size={18} className="text-amber-300" />
                      <span>توليد من اسم المنتج</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Error or Success feedback */}
            {generateError && (
              <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-800/80 text-red-200 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <span>{generateError}</span>
              </div>
            )}

            {generateSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>تم استخراج وتوليد بيانات المنتج وتعبئة نموذج الإضافة تلقائياً بنجاح!</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="mb-8 border-b border-slate-100 dark:border-slate-700 pb-6">
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <Store className="text-indigo-600 dark:text-indigo-400" size={28} />
              <span>إضافة منتج جديد (Add Product)</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              قم بملء بيانات المنتج وأسعار المتاجر المختلفة للمقارنة
            </p>
          </div>

          {submitted && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-2xl flex items-center gap-3 text-sm font-bold">
              <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
              <span>تم حفظ المنتج بنجاح وإضافته إلى المتاجر المحلية!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* General Product Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-700">
                تفاصيل المنتج الأساسية
              </h2>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  اسم المنتج (Product Name) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!aiProductName) setAiProductName(e.target.value);
                    }}
                    placeholder="مثال: سماعة سوني لاسلكية WH-1000XM5"
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => handleGenerateProduct()}
                    disabled={isGenerating || !name.trim()}
                    className="px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                  >
                    {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="text-amber-500" />}
                    <span>توليد بالذكاء الاصطناعي</span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  الوصف القصير (Short Description)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب وصفاً مختصراً للمنتج..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium resize-y"
                />
              </div>

              {/* Key Features (5 Bullet Points) */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <ListChecks size={16} className="text-indigo-500" />
                  <span>المميزات الرئيسية (Key Features - 5 نقاط)</span>
                </label>
                <div className="space-y-2">
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={keyFeatures[idx] || ''}
                      onChange={(e) => {
                        const updated = [...keyFeatures];
                        updated[idx] = e.target.value;
                        setKeyFeatures(updated);
                      }}
                      placeholder={`ميزة ${idx + 1}...`}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
                    />
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  الفئة (Product Category)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Award size={16} className="text-indigo-500" />
                  <span>الماركة / العلامة التجارية (Brand)</span>
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="مثال: Samsung, Apple, Sony, Philips, Nike..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                />
              </div>

              {/* SEO Title */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <FileCode size={16} className="text-indigo-500" />
                  <span>عنوان SEO (SEO Title)</span>
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="عنوان محركات البحث المحسن..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                />
              </div>

              {/* SEO Meta Description */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <FileCode size={16} className="text-indigo-500" />
                  <span>وصف SEO الميتا (SEO Meta Description)</span>
                </label>
                <textarea
                  rows={2}
                  value={seoMetaDescription}
                  onChange={(e) => setSeoMetaDescription(e.target.value)}
                  placeholder="وصف ميتا مخصص لمحركات البحث (120-150 حرف)..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium resize-y"
                />
              </div>

              {/* Product Tags */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Tag size={16} className="text-indigo-500" />
                  <span>الوسوم والكلمات المفتاحية (Product Tags)</span>
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="مفصولة بفاصلة: أجهزة منزلية، تخفيضات، ذكي..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  رابط الصورة (Image URL)
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium ltr"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Stores Section */}
            <div className="space-y-6 pt-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-700">
                قسم المتاجر (Stores Section)
              </h2>

              {/* Amazon */}
              <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/10 space-y-4">
                <div className="flex items-center gap-2 font-black text-amber-800 dark:text-amber-400">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span>متجر أمازون (Amazon)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      السعر (Price)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={amazonPrice}
                      onChange={(e) => setAmazonPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      رابط الافلييت (Affiliate URL)
                    </label>
                    <input
                      type="url"
                      value={amazonUrl}
                      onChange={(e) => setAmazonUrl(e.target.value)}
                      placeholder="https://amazon.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium ltr"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="amazonInStock"
                    checked={amazonInStock}
                    onChange={(e) => setAmazonInStock(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="amazonInStock" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    متوفر بالمخزون (In Stock)
                  </label>
                </div>
              </div>

              {/* Jumia */}
              <div className="p-5 rounded-2xl border border-orange-200 dark:border-orange-900/40 bg-orange-50/40 dark:bg-orange-950/10 space-y-4">
                <div className="flex items-center gap-2 font-black text-orange-800 dark:text-orange-400">
                  <span className="w-3 h-3 rounded-full bg-orange-500" />
                  <span>متجر جوميا (Jumia)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      السعر (Price)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={jumiaPrice}
                      onChange={(e) => setJumiaPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      رابط الافلييت (Affiliate URL)
                    </label>
                    <input
                      type="url"
                      value={jumiaUrl}
                      onChange={(e) => setJumiaUrl(e.target.value)}
                      placeholder="https://jumia.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium ltr"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="jumiaInStock"
                    checked={jumiaInStock}
                    onChange={(e) => setJumiaInStock(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="jumiaInStock" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    متوفر بالمخزون (In Stock)
                  </label>
                </div>
              </div>

              {/* Noon */}
              <div className="p-5 rounded-2xl border border-yellow-200 dark:border-yellow-900/40 bg-yellow-50/40 dark:bg-yellow-950/10 space-y-4">
                <div className="flex items-center gap-2 font-black text-yellow-800 dark:text-yellow-400">
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span>متجر نون (Noon)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      السعر (Price)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={noonPrice}
                      onChange={(e) => setNoonPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      رابط الافلييت (Affiliate URL)
                    </label>
                    <input
                      type="url"
                      value={noonUrl}
                      onChange={(e) => setNoonUrl(e.target.value)}
                      placeholder="https://noon.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium ltr"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="noonInStock"
                    checked={noonInStock}
                    onChange={(e) => setNoonInStock(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="noonInStock" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    متوفر بالمخزون (In Stock)
                  </label>
                </div>
              </div>
            </div>

            {/* Save Product Button */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 text-base"
              >
                <Save size={20} />
                <span>حفظ المنتج (Save Product)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const xml = generateSitemapXml(products, categories);
                  const blob = new Blob([xml], { type: 'text/xml' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'sitemap.xml';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-xs"
              >
                <FileCode size={16} className="text-emerald-500" />
                <span>توليد وتنزيل sitemap.xml تلقائياً</span>
                <Download size={14} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
