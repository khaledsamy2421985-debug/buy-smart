import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API Route: AI Product Generator
app.post("/api/generate-product", async (req, res) => {
  try {
    const { productName, categories } = req.body;

    if (!productName || typeof productName !== "string" || !productName.trim()) {
      return res.status(400).json({ error: "اسم المنتج مطلوب (Product name is required)" });
    }

    const categoryList = Array.isArray(categories) && categories.length > 0
      ? categories.map((c: any) => `${c.id} (${c.name} / ${c.nameEn || ''})`).join(', ')
      : 'electronics, home-kitchen, health-fitness, audio-gaming, fashion, beauty-care';

    const prompt = `أنت خبير تسويق إلكتروني وسيو (SEO) محترف. قم بتوليد بيانات منتج تسويقية وسيو متكاملة باللغة العربية لمنتج باسم: "${productName.trim()}".

الأقسام المتاحة بالمنصة اختر الأنسب منها فقط:
${categoryList}

قم بتوليد استجابة JSON تحتوي بالضبط على الحقول التالية:
1. shortDescription: وصف تسويقي مختصر وجذاب للمنتج باللغة العربية (2-3 جمل تشرح قيمة المنتج وأبرز فوائده).
2. keyFeatures: مصفوفة تحتوي بالضبط على 5 نقاط رئيسية لمميزات المنتج الأكثر أهمية للمشتري (5 bullet points مفصلة ودقيقة).
3. category: معرّف القسم الأنسب تماماً من الأقسام المتاحة أعلاه (مثال: electronics أو home-kitchen أو health-fitness أو audio-gaming أو fashion أو beauty-care).
4. seoTitle: عنوان سيو احترافي ومحسّن لمحركات البحث (أقل من 60 حرف، يضم اسم المنتج والكلمة المفتاحية).
5. seoMetaDescription: وصف سيو ميتا جذاب للضغط (CTR) ومحسن لنتائج البحث (120-150 حرف).
6. tags: مصفوفة من الكلمات المفتاحية والوسوم الأكثر بحثاً عن هذا المنتج (5 إلى 8 كلمات).

تنبيهات هامة جداً:
- لا تقم بتوليد أي أسعار إطلاقاً.
- لا تقم بتوليد أي روابط أفلييت أو متاجر إطلاقاً.
- اكتب المحتوى باللغة العربية بأسلوب راقٍ وجذاب.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            shortDescription: { type: Type.STRING },
            keyFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            category: { type: Type.STRING },
            seoTitle: { type: Type.STRING },
            seoMetaDescription: { type: Type.STRING },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["shortDescription", "keyFeatures", "category", "seoTitle", "seoMetaDescription", "tags"],
        },
      },
    });

    const textOutput = response.text?.trim() || "";
    if (!textOutput) {
      throw new Error("لم يتم إرجاع استجابة من نموذج الذكاء الاصطناعي");
    }

    const parsed = JSON.parse(textOutput);
    return res.json(parsed);
  } catch (err: any) {
    console.error("Gemini Product Generator Error:", err);
    return res.status(500).json({
      error: err.message || "حدث خطأ أثناء توليد بيانات المنتج بالذكاء الاصطناعي",
    });
  }
});

// API Route: AI Product Generator From URL
app.post("/api/generate-product-from-url", async (req, res) => {
  try {
    const { url, categories } = req.body;

    if (!url || typeof url !== "string" || !url.trim()) {
      return res.status(400).json({ error: "رابط المنتج مطلوب (Product URL is required)" });
    }

    const trimmedUrl = url.trim();

    // Extract ASIN from Amazon URLs (e.g. amazon.eg, amazon.com, etc.)
    const asinMatch = trimmedUrl.match(/(?:dp|gp\/product|exec\/obidos\/ASIN|o\/ASIN|product-reviews|aw\/d)\/([A-Z0-9]{10})/i)
      || (trimmedUrl.toLowerCase().includes('amazon') ? trimmedUrl.match(/\/([B][A-Z0-9]{9})(?:[/?#]|$)/i) : null);

    const extractedAsin = asinMatch && asinMatch[1] ? asinMatch[1].toUpperCase() : null;
    const isAmazon = trimmedUrl.toLowerCase().includes('amazon') || trimmedUrl.toLowerCase().includes('amzn');
    const isJumia = trimmedUrl.toLowerCase().includes('jumia');
    const isNoon = trimmedUrl.toLowerCase().includes('noon');

    const categoryList = Array.isArray(categories) && categories.length > 0
      ? categories.map((c: any) => `${c.id} (${c.name} / ${c.nameEn || ''})`).join(', ')
      : 'electronics, home-kitchen, health-fitness, audio-gaming, fashion, beauty-care';

    const prompt = `أنت خبير تسويق إلكتروني وسيو (SEO) محترف في تحليل المنتجات للمتاجر المصرية مثل أمازون مصر (Amazon Egypt)، جوميا مصر (Jumia Egypt)، ونون مصر (Noon Egypt).

قام المستخدم بإدخال رابط المنتج التالي من أحد هذه المتاجر:
"${trimmedUrl}"
${extractedAsin ? `رقم معرّف المنتج بمتجر أمازون (ASIN): "${extractedAsin}"` : ''}

المطلوب: تحليل الرابط واستخراج/توليد بيانات هذا المنتج باللغة العربية بدقة عالية:

الأقسام المتاحة بالمنصة اختر الأنسب منها فقط:
${categoryList}

قم بتوليد استجابة JSON تحتوي بالضبط على الحقول التالية:
1. productName: اسم المنتج التجاري بدقة وبأسلوب جذاب باللغة العربية (يشمل الموديل والسعة أو المواصفة البارزة إن وجدت بالرابط).
2. shortDescription: وصف تسويقي احترافي ومختصر للمنتج باللغة العربية (2-3 جمل تشرح الفائدة والفوائد الرئيسية للمشتري).
3. category: معرّف القسم الأنسب تماماً من الأقسام المتاحة أعلاه (مثال: electronics أو home-kitchen أو health-fitness...).
4. brand: اسم الماركة أو العلامة التجارية للمنتج (مثل: Samsung, Apple, Sony, Philips, Nike, Xiaomi, LG, DeLonghi...).
5. mainImage: رابط صورة توضيحية فائقة الجودة للمنتج (رابط صورة Unsplash مباشر واقعي مناسب تماماً لهذا المنتج).
6. keyFeatures: مصفوفة تحتوي بالضبط على 5 نقاط رئيسية لمميزات المنتج الأكثر أهمية للمشتري (5 bullet points دقيقة وتفصيلية).
7. tags: مصفوفة من الكلمات المفتاحية والوسوم الأكثر بحثاً عن هذا المنتج (5 إلى 8 كلمات).
8. seoTitle: عنوان سيو احترافي ومحسّن لمحركات البحث (أقل من 60 حرف، يضم اسم المنتج والكلمة المفتاحية الرئيسية).
9. seoMetaDescription: وصف سيو ميتا جذاب للضغط (CTR) ومحسن لنتائج البحث (120-150 حرف).

تنبيهات صارمة جداً:
- لا تقم بتوليد أي أسعار وهمية إطلاقاً.
- لا تقم بتوليد أي روابط أفلييت أو تغيير رابط الأفلييت الخاص بالمستخدم إطلاقاً.
- اكتب جميع النصوص العربية بأسلوب راقٍ واحترافي.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            shortDescription: { type: Type.STRING },
            category: { type: Type.STRING },
            brand: { type: Type.STRING },
            mainImage: { type: Type.STRING },
            keyFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            seoTitle: { type: Type.STRING },
            seoMetaDescription: { type: Type.STRING },
          },
          required: [
            "productName",
            "shortDescription",
            "category",
            "brand",
            "mainImage",
            "keyFeatures",
            "tags",
            "seoTitle",
            "seoMetaDescription",
          ],
        },
      },
    });

    const textOutput = response.text?.trim() || "";
    if (!textOutput) {
      throw new Error("لم يتم إرجاع استجابة من نموذج الذكاء الاصطناعي");
    }

    const parsed = JSON.parse(textOutput);

    return res.json({
      ...parsed,
      asin: extractedAsin,
      isAmazon,
      isJumia,
      isNoon,
      userUrl: trimmedUrl,
      paapiNote: isAmazon && !process.env.AMAZON_PAAPI_ACCESS_KEY
        ? "ملاحظة: لاستخدام جلب الأسعار والمخزون المباشر من Amazon PA-API بشكل لحظي ومستقر، يلزم توفير مفاتيح Amazon PA-API الرسمية في متغيرات البيئة."
        : undefined
    });
  } catch (err: any) {
    console.error("Gemini Product From URL Generator Error:", err);
    return res.status(500).json({
      error: err.message || "حدث خطأ أثناء استخراج بيانات المنتج من الرابط بالذكاء الاصطناعي",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
