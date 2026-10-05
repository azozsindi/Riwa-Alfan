import React, { useState } from 'react';
import { Gauge, ShieldCheck, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { NitroxCalculator } from './tools/NitroxCalculator';
import { BwrafChecklist } from './tools/BwrafChecklist';
import { SacCalculator } from './tools/SacCalculator';

type ToolType = 'nitrox' | 'bwraf' | 'sac';

export const DiverToolsSection: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const t = translations[language];
  const [activeTool, setActiveTool] = useState<ToolType>('nitrox');

  return (
    <section id="diver-tools" className="py-16 sm:py-24 bg-slate-950 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`max-w-3xl mb-10 sm:mb-12 space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="text-xs font-semibold text-[#C59B5F] tracking-wider">
            {t.toolsKicker}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-brand-arabic">
            {t.toolsTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.toolsDesc}
          </p>
        </div>

        {/* Tool Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl w-fit mb-8 max-w-full overflow-x-auto">
          <button
            onClick={() => setActiveTool('nitrox')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTool === 'nitrox'
                ? 'gold-gradient-btn'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>{t.tabNitrox}</span>
          </button>

          <button
            onClick={() => setActiveTool('bwraf')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTool === 'bwraf'
                ? 'gold-gradient-btn'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t.tabBwraf}</span>
          </button>

          <button
            onClick={() => setActiveTool('sac')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTool === 'sac'
                ? 'gold-gradient-btn'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{t.tabSac}</span>
          </button>
        </div>

        {/* Active Tool Container */}
        <div className="rounded-3xl bg-slate-900 border border-[#C59B5F]/20 p-6 sm:p-8">
          {activeTool === 'nitrox' && <NitroxCalculator />}
          {activeTool === 'bwraf' && <BwrafChecklist />}
          {activeTool === 'sac' && <SacCalculator />}
        </div>

      </div>
    </section>
  );
};
