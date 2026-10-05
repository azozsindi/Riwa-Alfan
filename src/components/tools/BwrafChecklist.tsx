import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../data/translations';

export const BwrafChecklist: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const t = translations[language];
  const [checklist, setChecklist] = useState({
    b: false, // BCD
    w: false, // Weights
    r: false, // Releases
    a: false, // Air
    f: false, // Final OK
  });

  const completedChecks = Object.values(checklist).filter(Boolean).length;
  const isBwrafComplete = completedChecks === 5;

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetBwraf = () => {
    setChecklist({ b: false, w: false, r: false, a: false, f: false });
  };

  return (
    <div className={`space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">{t.bwrafTitle}</h3>
          <p className="text-xs text-slate-400 mt-1">
            {t.bwrafDesc}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#E0BA84] font-bold">
            {t.bwrafProgress(completedChecks)}
          </span>
          <button
            onClick={resetBwraf}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset Checklist"
            aria-label="Reset Checklist"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#C59B5F] to-[#E0BA84] transition-all duration-300"
          style={{ width: `${(completedChecks / 5) * 100}%` }}
        />
      </div>

      {/* Interactive items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* B: BCD */}
        <div
          onClick={() => toggleCheck('b')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
            checklist.b
              ? 'bg-[#C59B5F]/15 border-[#C59B5F]/50 text-slate-100'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="space-y-1">
            <div className="font-bold text-white text-sm">{t.bwrafB_Title}</div>
            <p className="text-xs text-slate-300">{t.bwrafB_Desc}</p>
          </div>
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
            checklist.b ? 'bg-[#C59B5F] border-[#C59B5F] text-slate-950 font-bold' : 'border-slate-700'
          }`}>
            {checklist.b && <CheckCircle2 className="w-4 h-4 text-slate-950" />}
          </div>
        </div>

        {/* W: Weights */}
        <div
          onClick={() => toggleCheck('w')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
            checklist.w
              ? 'bg-[#C59B5F]/15 border-[#C59B5F]/50 text-slate-100'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="space-y-1">
            <div className="font-bold text-white text-sm">{t.bwrafW_Title}</div>
            <p className="text-xs text-slate-300">{t.bwrafW_Desc}</p>
          </div>
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
            checklist.w ? 'bg-[#C59B5F] border-[#C59B5F] text-slate-950 font-bold' : 'border-slate-700'
          }`}>
            {checklist.w && <CheckCircle2 className="w-4 h-4 text-slate-950" />}
          </div>
        </div>

        {/* R: Releases */}
        <div
          onClick={() => toggleCheck('r')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
            checklist.r
              ? 'bg-[#C59B5F]/15 border-[#C59B5F]/50 text-slate-100'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="space-y-1">
            <div className="font-bold text-white text-sm">{t.bwrafR_Title}</div>
            <p className="text-xs text-slate-300">{t.bwrafR_Desc}</p>
          </div>
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
            checklist.r ? 'bg-[#C59B5F] border-[#C59B5F] text-slate-950 font-bold' : 'border-slate-700'
          }`}>
            {checklist.r && <CheckCircle2 className="w-4 h-4 text-slate-950" />}
          </div>
        </div>

        {/* A: Air */}
        <div
          onClick={() => toggleCheck('a')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
            checklist.a
              ? 'bg-[#C59B5F]/15 border-[#C59B5F]/50 text-slate-100'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="space-y-1">
            <div className="font-bold text-white text-sm">{t.bwrafA_Title}</div>
            <p className="text-xs text-slate-300">{t.bwrafA_Desc}</p>
          </div>
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
            checklist.a ? 'bg-[#C59B5F] border-[#C59B5F] text-slate-950 font-bold' : 'border-slate-700'
          }`}>
            {checklist.a && <CheckCircle2 className="w-4 h-4 text-slate-950" />}
          </div>
        </div>

        {/* F: Final OK */}
        <div
          onClick={() => toggleCheck('f')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 md:col-span-2 ${
            checklist.f
              ? 'bg-[#C59B5F]/15 border-[#C59B5F]/50 text-slate-100'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="space-y-1">
            <div className="font-bold text-white text-sm">{t.bwrafF_Title}</div>
            <p className="text-xs text-slate-300">{t.bwrafF_Desc}</p>
          </div>
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
            checklist.f ? 'bg-[#C59B5F] border-[#C59B5F] text-slate-950 font-bold' : 'border-slate-700'
          }`}>
            {checklist.f && <CheckCircle2 className="w-4 h-4 text-slate-950" />}
          </div>
        </div>

      </div>

      {/* Completion Banner */}
      {isBwrafComplete && (
        <div className="p-4 rounded-2xl bg-[#C59B5F]/15 border border-[#C59B5F]/40 flex items-center justify-between text-xs sm:text-sm text-[#E0BA84] animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C59B5F]" />
            <span className="font-bold">{t.bwrafDoneBanner}</span>
          </div>
        </div>
      )}
    </div>
  );
};
