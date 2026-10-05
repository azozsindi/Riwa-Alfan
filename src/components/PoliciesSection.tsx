import React from 'react';
import { ShieldCheck, Ship, GraduationCap, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { POLICIES_DATA } from '../data/policiesData';

export const PoliciesSection: React.FC = () => {
  const { language, isRtl } = useLanguage();

  const renderIcon = (type: 'ship' | 'graduation' | 'shield') => {
    switch (type) {
      case 'ship':
        return <Ship className="w-6 h-6" />;
      case 'graduation':
        return <GraduationCap className="w-6 h-6" />;
      case 'shield':
        return <AlertTriangle className="w-6 h-6" />;
    }
  };

  const renderRuleIcon = (variant: 'emerald' | 'amber' | 'blue') => {
    switch (variant) {
      case 'emerald':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'amber':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'blue':
        return <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <section id="policies" className="py-14 sm:py-20 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`space-y-3 mb-10 sm:mb-12 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
            <FileText className="w-3.5 h-3.5" />
            <span>{isRtl ? 'اللوائح والسياسات الرسمية' : 'Official Center Regulations'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-brand-arabic">
            {isRtl ? 'سياسة الحجوزات، الاسترداد، والتدريب والسلامة' : 'Booking, Refund & Safety Policy'}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
            {isRtl 
              ? 'نحرص في رواء الفن على الشفافية التامة لضمان حقوق المتدربين والعملاء وأعلى درجات الأمان في البحر الأحمر وفق أنظمة المملكة العربية السعودية ومعايير منظمة PADI الدولية.'
              : 'At Riwa Alfan, we prioritize total transparency to safeguard student rights and deliver the highest Red Sea safety standards under Saudi Arabian consumer regulations.'}
          </p>
        </div>

        {/* 3 Core Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {POLICIES_DATA.map((policy) => (
            <div 
              key={policy.id}
              className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  policy.iconType === 'shield' 
                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' 
                    : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                }`}>
                  {renderIcon(policy.iconType)}
                </div>

                <h3 className="text-lg font-bold text-white font-brand-arabic">
                  {policy.title[language]}
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                  {policy.rules.map((rule) => (
                    <li key={rule.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                      <span className={`font-bold block flex items-center gap-1.5 ${
                        rule.variant === 'emerald' ? 'text-emerald-400' : rule.variant === 'amber' ? 'text-amber-400' : 'text-sky-400'
                      }`}>
                        {renderRuleIcon(rule.variant)}
                        {rule.label[language]}
                      </span>
                      <p className="text-slate-300 leading-relaxed">{rule.description[language]}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`pt-2 text-[11px] font-medium ${
                policy.iconType === 'shield' ? 'text-amber-400' : 'text-blue-400'
              }`}>
                {policy.badgeNote[language]}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
