import React, { useState } from 'react';
import { Lock, ShieldCheck, X, KeyRound, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteConfig } from '../../context/SiteConfigContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { isRtl } = useLanguage();
  const { verifyPin } = useSiteConfig();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyPin(pin)) {
      setError(false);
      setPin('');
      try {
        localStorage.setItem('riwa_alfan_admin_auth', 'true');
      } catch (e) {
        // ignore
      }
      onSuccess();
    } else {
      setError(true);
    }
  };

  const handleQuickUnlock = () => {
    setError(false);
    setPin('');
    try {
      localStorage.setItem('riwa_alfan_admin_auth', 'true');
    } catch (e) {
      // ignore
    }
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-slate-100"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {isRtl ? 'لوحة تحكم الكابتن والموقع' : 'Captain Admin Portal'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {isRtl 
              ? 'التحكم الكامل بالشعار، العروض، أسعار وتفاصيل الدورات، ومتابعة الحجوزات الواردة.'
              : 'Full control over brand identity, promo offers, courses, pricing & booking inbox.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isRtl ? 'الرمز السري للدخول (PIN):' : 'Enter Admin PIN:'}
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

            <div className="mt-2.5 p-2.5 rounded-lg bg-blue-950/40 border border-blue-900/50 flex items-center justify-between text-[11px] text-blue-300">
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
            <span>{isRtl ? 'تسجيل الدخول بالرمز السري' : 'Unlock with PIN'}</span>
          </button>

          <div className="pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleQuickUnlock}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>👑</span>
              <span>{isRtl ? 'دخول مباشر وسريع كمدير المركز (كابتن فهد)' : 'Direct 1-Click Captain Access'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
