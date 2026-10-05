import React, { useState } from 'react';
import { 
  ShieldCheck, Ship, GraduationCap, AlertTriangle, 
  FileText, CheckCircle2, ChevronRight, ChevronLeft, 
  ExternalLink 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { POLICIES_DATA } from '../data/policiesData';

interface PoliciesSectionProps {
  onOpenFullModal?: () => void;
}

export const PoliciesSection: React.FC<PoliciesSectionProps> = ({ onOpenFullModal }) => {
  const { language, isRtl } = useLanguage();
  const [activeTabId, setActiveTabId] = useState<'trips' | 'courses' | 'safety'>('trips');

  const activePolicy = POLICIES_DATA.find(p => p.id === activeTabId) || POLICIES_DATA[0];

  const renderTabIcon = (id: string) => {
    switch (id) {
      case 'trips':
        return <Ship className="w-4 h-4 text-cyan-400" />;
      case 'courses':
        return <GraduationCap className="w-4 h-4 text-blue-400" />;
      case 'safety':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const renderRuleIcon = (variant: 'emerald' | 'amber' | 'blue') => {
    switch (variant) {
      case 'emerald':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />;
      case 'amber':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />;
      case 'blue':
        return <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />;
    }
  };

  return (
    <section id="policies" className="py-10 sm:py-14 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>{isRtl ? 'اللوائح والسياسات الرسمية' : 'Official Policies & Regulations'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-brand-arabic">
              {isRtl ? 'سياسة الحجوزات، الاسترداد، والتدريب والسلامة' : 'Booking, Refund & Safety Policy'}
            </h2>
          </div>

          {onOpenFullModal && (
            <button
              type="button"
              onClick={onOpenFullModal}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E0BA84] hover:text-white bg-slate-900 hover:bg-slate-850 px-3.5 py-1.5 rounded-xl border border-[#C59B5F]/30 hover:border-[#C59B5F] transition-all cursor-pointer w-fit self-start sm:self-auto"
            >
              <span>{isRtl ? 'عرض الوثيقة الكاملة 📜' : 'View Full Document 📜'}</span>
              <ExternalLink className="w-3 h-3 text-[#C59B5F]" />
            </button>
          )}
        </div>

        {/* Compact Segmented Tabs (Takes 1/3 of previous space) */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-x-auto">
          {POLICIES_DATA.map((policy) => {
            const isActive = policy.id === activeTabId;
            return (
              <button
                key={policy.id}
                type="button"
                onClick={() => setActiveTabId(policy.id as any)}
                className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#DDB67E] via-[#C59B5F] to-[#A4783B] text-slate-950 shadow-md shadow-[#C59B5F]/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>{renderTabIcon(policy.id)}</span>
                <span>{policy.title[language]}</span>
              </button>
            );
          })}
        </div>

        {/* Compact Single Tab Content (Horizontal Grid) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800/70 pb-3">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-brand-arabic">
              <span>{renderTabIcon(activePolicy.id)}</span>
              <span>{activePolicy.title[language]}</span>
            </h3>
            <span className="text-[11px] font-semibold text-[#E0BA84] px-2.5 py-0.5 rounded-full bg-[#C59B5F]/10 border border-[#C59B5F]/20">
              {activePolicy.badgeNote[language]}
            </span>
          </div>

          {/* 3 Rule cards side by side on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activePolicy.rules.map((rule) => (
              <div
                key={rule.id}
                className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-1.5 flex flex-col justify-start"
              >
                <div className="flex items-start gap-1.5">
                  {renderRuleIcon(rule.variant)}
                  <strong className="text-xs sm:text-sm font-bold text-white leading-tight">
                    {rule.label[language]}
                  </strong>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed ps-5">
                  {rule.description[language]}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>
              {isRtl 
                ? 'وفق أنظمة المملكة العربية السعودية ومعايير منظمة PADI الدولية.' 
                : 'Compliant with Saudi Consumer Laws & PADI International Standards.'}
            </span>
            {onOpenFullModal && (
              <button
                type="button"
                onClick={onOpenFullModal}
                className="text-[#C59B5F] hover:text-[#E0BA84] font-bold underline cursor-pointer transition-colors"
              >
                {isRtl ? 'التفاصيل النظامية' : 'Full Legal Terms'}
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
