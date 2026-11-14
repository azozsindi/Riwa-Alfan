import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export const FloatingCartButton: React.FC = () => {
  const { totalCount, totalPrice, openCart } = useCart();
  const { isRtl, language } = useLanguage();

  if (totalCount === 0) return null;

  return (
    <button
      type="button"
      onClick={openCart}
      className={`fixed bottom-5 ${isRtl ? 'left-5' : 'right-5'} z-40 gold-gradient-btn px-4 py-3 rounded-2xl shadow-2xl shadow-[#C59B5F]/40 flex items-center gap-3 cursor-pointer active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-4 duration-300 border border-[#DDB67E] hover:scale-105`}
      aria-label={isRtl ? 'عرض سلة الطلبات' : 'View Cart'}
    >
      <div className="relative">
        <ShoppingBag className="w-5 h-5 text-slate-950" />
        <span className="absolute -top-2 -right-2 bg-red-600 text-white font-mono font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950">
          {totalCount}
        </span>
      </div>

      <div className="text-start leading-tight">
        <span className="text-[11px] font-bold text-slate-950 block">
          {isRtl ? 'سلة الطلب' : 'Cart'}
        </span>
        {totalPrice > 0 && (
          <span className="text-xs font-black text-slate-950 font-mono">
            {totalPrice.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} {language === 'ar' ? 'ر.س' : 'SAR'}
          </span>
        )}
      </div>
    </button>
  );
};
