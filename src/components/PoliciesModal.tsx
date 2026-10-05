import React from 'react';
import { X, ShieldCheck, Ship, GraduationCap, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { POLICIES_DATA } from '../data/policiesData';

interface PoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PoliciesModal: React.FC<PoliciesModalProps> = ({ isOpen, onClose }) => {
  const { language, isRtl } = useLanguage();

  if (!isOpen) return null;

  const renderIcon = (type: 'ship' | 'graduation' | 'shield') => {
    switch (type) {
      case 'ship':
        return <Ship className="w-4 h-4 text-blue-400" />;
      case 'graduation':
        return <GraduationCap className="w-4 h-4 text-blue-400" />;
      case 'shield':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }
  };

  const renderRuleIcon = (variant: 'emerald' | 'amber' | 'blue') => {
    switch (variant) {
      case 'emerald':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
      case 'amber':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />;
      case 'blue':
        return <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 my-6 max-h-[90vh] overflow-y-auto"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>{isRtl ? 'اللوائح التنظيمية والسياسات الرسمية' : 'Official Center Policies'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-brand-arabic">
              {isRtl ? 'سياسة الحجوزات، الاسترداد، والتدريب والسلامة' : 'Booking, Refund, Training & Safety Policy'}
            </h2>
            <p className="text-xs text-slate-400">
              {isRtl 
                ? 'مركز رواء الفن للغوص بجدة · وفقاً لمعايير PADI وأنظمة حماية المستهلك بالمملكة العربية السعودية'
                : 'Riwa Alfan Dive Center · Jeddah · Compliant with PADI standards & Saudi regulations'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer shrink-0"
            aria-label="إغلاق / Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 3 Core Policy Cards */}
        <div className="space-y-5 text-sm">
          {POLICIES_DATA.map((policy) => (
            <div 
              key={policy.id}
              className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3.5 hover:border-blue-500/40 transition-colors"
            >
              <div className="flex items-center gap-2.5 text-blue-400 font-bold text-base">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  {renderIcon(policy.iconType)}
                </div>
                <span className="font-brand-arabic">{policy.title[language]}</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 pt-1">
                {policy.rules.map((rule) => (
                  <div key={rule.id} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                    {renderRuleIcon(rule.variant)}
                    <div>
                      <strong className="text-white block font-semibold text-xs sm:text-sm">
                        {rule.label[language]}
                      </strong>
                      <span className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {rule.description[language]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isRtl ? 'معتمدة وموثقة لمركز رواء الفن للغوص' : 'Certified & Enforced at Riwa Alfan'}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            {isRtl ? 'حسناً، فهمت السياسة' : 'Got it, Understood'}
          </button>
        </div>

      </div>
    </div>
  );
};
