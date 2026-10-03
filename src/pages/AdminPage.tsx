import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useRouter } from '../context/RouterContext';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { FahadsLogo } from '../components/FahadsLogo';
import { Lock, ShieldCheck, KeyRound, AlertCircle, ArrowLeft, ArrowRight, Globe } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { language, isRtl, toggleLanguage } = useLanguage();
  const { config, verifyPin } = useSiteConfig();
  const { navigate } = useRouter();

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('riwa_alfan_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const ArrowBackIcon = isRtl ? ArrowRight : ArrowLeft;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyPin(pin)) {
      setError(false);
      try {
        localStorage.setItem('riwa_alfan_admin_auth', 'true');
      } catch (e) {
        // ignore
      }
      setIsAuthenticated(true);
    } else {
      setError(true);
    }
  };

  const handleQuickCaptainUnlock = () => {
    try {
      localStorage.setItem('riwa_alfan_admin_auth', 'true');
    } catch (e) {
      // ignore
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('riwa_alfan_admin_auth');
    } catch (e) {
      // ignore
    }
    setIsAuthenticated(false);
  };

  const brandName = language === 'ar' ? config.brand.centerNameAr : config.brand.centerNameEn;

  // If authenticated, render full dedicated Admin Dashboard
  if (isAuthenticated) {
    return (
      <AdminDashboard
        isOpen={true}
        onClose={() => navigate('/')}
        isStandalonePage={true}
      />
    );
  }

  // Dedicated Login Screen for /admin
  return (
    <div 
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-800 transition-colors cursor-pointer"
        >
          <ArrowBackIcon className="w-4 h-4 text-blue-400" />
          <span>{isRtl ? 'الرجوع للموقع الرئيسي' : 'Return to Website'}</span>
        </button>

        <button
          onClick={toggleLanguage}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>{language === 'ar' ? 'English' : 'عربي'}</span>
        </button>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/40 relative">
          
          <div className="flex flex-col items-center text-center mb-6">
            <div className="p-2 rounded-2xl bg-slate-950 border border-slate-800 mb-4 shadow-inner">
              <FahadsLogo 
                size="md" 
                theme="dark" 
                customImageUrl={config.brand.logoType === 'custom-image' ? config.brand.customLogoUrl : undefined}
                customTitle={config.brand.logoText}
                customSubtext={config.brand.logoSubtext}
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-2">
              <span>👑</span>
              <span>{isRtl ? 'بوابة إدارة الموقع الرسمية' : 'Official Admin Portal'}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {brandName}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              {isRtl 
                ? 'لوحة التحكم المركزية والشاملة لإدارة الدورات والأسعار والعروض والحجوزات' 
                : 'Central administration portal for courses, pricing, offers and student bookings'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                {isRtl ? 'الرمز السري للإدارة (PIN):' : 'Admin Security PIN:'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={8}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError(false);
                  }}
                  placeholder="••••"
                  autoFocus
                  className={`w-full px-4 py-3 bg-slate-950 border ${
                    error ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  } rounded-xl text-center text-xl font-mono tracking-widest text-white placeholder-slate-600 outline-none transition-all`}
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-xs text-red-400 mt-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{isRtl ? 'الرمز غير صحيح، حاول مجدداً' : 'Incorrect PIN, please try again'}</span>
                </div>
              )}

              <div className="mt-2.5 p-2.5 rounded-xl bg-blue-950/40 border border-blue-900/50 flex items-center justify-between text-[11px] text-blue-300">
                <span>{isRtl ? 'الرمز الافتراضي المبدئي:' : 'Default Demo PIN:'}</span>
                <button
                  type="button"
                  onClick={() => setPin('1234')}
                  className="font-mono font-bold bg-blue-900/80 hover:bg-blue-800 px-2 py-0.5 rounded text-white tracking-widest cursor-pointer transition-colors"
                  title={isRtl ? 'انقر للتعبئة التلقائية' : 'Click to fill'}
                >
                  1234
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isRtl ? 'تسجيل الدخول بالرمز السري' : 'Unlock Dashboard'}</span>
            </button>

            <div className="pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={handleQuickCaptainUnlock}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>👑</span>
                <span>{isRtl ? 'دخول مباشر وسريع كمدير المركز (كابتن فهد)' : 'Direct 1-Click Captain Access'}</span>
              </button>
            </div>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-800/60">
        <p>{brandName} · {isRtl ? 'نظام التحكم السحابي المحمي' : 'Secure Cloud Control System'}</p>
      </footer>
    </div>
  );
};
