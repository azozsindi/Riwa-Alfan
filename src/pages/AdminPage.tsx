import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { FahadsLogo } from '../components/FahadsLogo';
import { Lock, ShieldCheck, Mail, KeyRound, AlertCircle, ArrowLeft, ArrowRight, Globe, LogIn, Sparkles, Loader2 } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { language, isRtl, toggleLanguage } = useLanguage();
  const { config } = useSiteConfig();
  const { navigate } = useRouter();
  const { 
    user, 
    isAdminUser, 
    isLoading, 
    authError, 
    setAuthError, 
    signInWithGoogle, 
    signInWithEmail, 
    logout 
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ArrowBackIcon = isRtl ? ArrowRight : ArrowLeft;
  const brandName = language === 'ar' ? config.brand.centerNameAr : config.brand.centerNameEn;

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    await signInWithGoogle();
    setIsSubmitting(false);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    await signInWithEmail(email, password);
    setIsSubmitting(false);
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
        </div>
        <p className="text-xs text-slate-400 font-medium">
          {isRtl ? 'جارِ التحقق من الصلاحيات وأمان Firebase...' : 'Verifying Firebase security credentials...'}
        </p>
      </div>
    );
  }

  // 2. Fully Authenticated and Authorized Admin -> Render Control Panel
  if (user && isAdminUser) {
    return (
      <AdminDashboard
        isOpen={true}
        onClose={() => navigate('/')}
        isStandalonePage={true}
      />
    );
  }

  // 3. Login & Authentication Screen
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
          <span>{isRtl ? 'الرجوع للموقع الرئيسي' : 'Return to Public Site'}</span>
        </button>

        <button
          onClick={toggleLanguage}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>{language === 'ar' ? 'English' : 'عربي'}</span>
        </button>
      </header>

      {/* Main Authentication Box */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/40 relative">
          
          {/* Header branding */}
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

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isRtl ? 'بوابة إدارة الموقع المؤمنة سحابياً' : 'Protected Firebase Admin Portal'}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {brandName}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              {isRtl 
                ? 'الدخول محصور بحسابات المدراء المصرح لهم فقط عبر Firebase Authentication.' 
                : 'Access restricted to authorized administrators via Firebase Authentication.'}
            </p>
          </div>

          {/* Security Alert if not authorized */}
          {authError && (
            <div className="mb-5 p-4 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{isRtl ? 'تنبيه أمني - تم رفض الوصول' : 'Access Denied'}</span>
              </div>
              <p className="leading-relaxed text-[11px] text-red-300/90">{authError}</p>
            </div>
          )}

          <div className="space-y-4">
            
            {/* 1-Click Official Google Sign-In */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/60 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-3 cursor-pointer transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isRtl ? 'تسجيل الدخول بحساب Google المعتمد' : 'Sign in with Google Account'}</span>
            </button>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800" />
              <span className="flex-shrink mx-3 text-[11px] text-slate-500 font-semibold uppercase">
                {isRtl ? 'أو بالبريد وكلمة المرور' : 'Or Email & Password'}
              </span>
              <div className="flex-grow border-t border-slate-800" />
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">
                  {isRtl ? 'البريد الإلكتروني:' : 'Email Address:'}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setAuthError(null);
                    }}
                    placeholder="admin@riwaalfan.com"
                    required
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none ps-9"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">
                  {isRtl ? 'كلمة المرور:' : 'Password:'}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setAuthError(null);
                    }}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none ps-9 font-mono"
                  />
                  <KeyRound className="w-4 h-4 text-slate-500 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl gold-gradient-btn text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-[#C59B5F]/20 active:scale-95 disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <LogIn className="w-4 h-4 text-slate-950" />
                )}
                <span>{isSubmitting ? (isRtl ? 'جارِ التحقق...' : 'Verifying...') : (isRtl ? 'دخول لوحة التحكم' : 'Sign In')}</span>
              </button>
            </form>

          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 text-center space-y-1">
            <p className="flex items-center justify-center gap-1 text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isRtl ? 'بيانات الاعتماد محمية بواسطة بروتوكول Firebase Auth' : 'Protected by Firebase Authentication'}</span>
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-800/60">
        <p>{brandName} · {isRtl ? 'نظام التحكم السحابي المحمي' : 'Secure Cloud Control System'}</p>
      </footer>
    </div>
  );
};
