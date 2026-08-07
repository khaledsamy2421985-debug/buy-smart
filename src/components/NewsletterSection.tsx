import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, Send } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 8000);
    }
  };

  return (
    <section className="my-16 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
          <Sparkles size={14} className="text-amber-400" />
          <span>لا تفوّت صفقات وتخفيضات اليوم</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
          اشترك في النشرة البريدية واحصل على التخفيضات السرية فور نزولها 💌
        </h2>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto font-medium">
          انضم لأكثر من 15,000 مشترك ليصلك تنبيه بأقوى الكوبونات وعروض الأفلييت الموثوقة قبل الجميع مباشرة على بريدك.
        </p>

        {subscribed ? (
          <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 p-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold animate-in zoom-in-95">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>شكراً لاشتراكك! سنرسل لك أفضل العروض فور توفرها.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="relative flex-1">
              <input
                type="email"
                required
                placeholder="أدخل بريدك الإلكتروني هنا..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 rounded-2xl py-3.5 pr-12 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
              <Mail className="w-5 h-5 text-slate-400 absolute right-4 top-3.5" />
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-900 font-extrabold text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>اشترك الآن</span>
              <Send size={16} />
            </button>
          </form>
        )}

        <p className="text-[11px] text-slate-400">
          🔒 نحترم خصوصيتك 100%. يمكنك إلغاء الاشتراك في أي وقت بضغطة زر واحدة.
        </p>
      </div>
    </section>
  );
};
