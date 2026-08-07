import React, { useState } from 'react';
import { SeoHead } from '../components/SeoHead';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'استفسار عام', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'استفسار عام', message: '' });
      setTimeout(() => setSubmitted(false), 8000);
    }
  };

  return (
    <div className="space-y-12 pb-16 max-w-4xl mx-auto">
      <SeoHead 
        title="اتصل بنا - صفوة العروض" 
        description="تواصل مع فريق منصة صفوة العروض لأي استفسار أو اقتراح أو إضافة منتج جديد."
      />

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <MessageSquare size={28} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">
          تواصل معنا 📞
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          يسعدنا استقبال آرائك، اقتراحاتك، أو استفساراتك حول المنتجات المراجعة والصفقات المتاحة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Contact Info (4 Cols) */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">معلومات التواصل المباشر</h3>
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                <Mail size={18} />
              </div>
              <div>
                <span className="text-slate-400 block font-medium">البريد الإلكتروني</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 dir-ltr">support@safwadeals.com</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <Phone size={18} />
              </div>
              <div>
                <span className="text-slate-400 block font-medium">الهاتف والدعم</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 dir-ltr">+966 50 000 0000</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                <MapPin size={18} />
              </div>
              <div>
                <span className="text-slate-400 block font-medium">المقر</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (8 Cols) */}
        <div className="md:col-span-8 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          {submitted ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
              <CheckCircle2 size={36} className="text-emerald-500 mx-auto" />
              <h3 className="font-black text-lg text-emerald-900 dark:text-emerald-200">تم إرسال رسالتك بنجاح!</h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">سيتواصل معك فريق صفوة العروض في أقرب وقت ممكن.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1.5">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  placeholder="أدخل اسمك الكريم..."
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1.5">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1.5">موضوع الرسالة</label>
                <select
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                >
                  <option value="استفسار عام">استفسار عام حول منتج</option>
                  <option value="اقتراح منتج">اقتراح إضافة منتج جديد</option>
                  <option value="شراكة أو إعلان">شراكة أفلييت أو متجر</option>
                  <option value="بلاغ رابط">الإبلاغ عن رابط غير يعمل</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1.5">تفاصيل الرسالة</label>
                <textarea
                  rows={4}
                  required
                  placeholder="اكتب رسالتك أو استفسارك بالتفصيل..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/20 transition-transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>إرسال الرسالة الآن</span>
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
