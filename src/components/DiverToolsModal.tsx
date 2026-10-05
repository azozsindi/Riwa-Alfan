import React, { useState } from 'react';
import { X, Gauge, ShieldCheck, Activity, Calculator } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { NitroxCalculator } from './tools/NitroxCalculator';
import { BwrafChecklist } from './tools/BwrafChecklist';
import { SacCalculator } from './tools/SacCalculator';

interface DiverToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ToolType = 'nitrox' | 'bwraf' | 'sac';

export const DiverToolsModal: React.FC<DiverToolsModalProps> = ({ isOpen, onClose }) => {
  const { language, isRtl } = useLanguage();
  const t = translations[language];
  const [activeTool, setActiveTool] = useState<ToolType>('nitrox');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 my-6 max-h-[92vh] overflow-y-auto"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#E0BA84] text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-[#C59B5F]" />
              <span>{isRtl ? 'أدوات وحاسبات الغوص التفاعلية' : 'Interactive Diver Calculators'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-brand-arabic">
              {t.toolsTitle}
            </h2>
            <p className="text-xs text-slate-400">
              {t.toolsDesc}
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

        {/* Tool Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-950 border border-slate-800 rounded-2xl w-fit max-w-full overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTool('nitrox')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTool === 'nitrox'
                ? 'gold-gradient-btn'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>{t.tabNitrox}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('bwraf')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTool === 'bwraf'
                ? 'gold-gradient-btn'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t.tabBwraf}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('sac')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTool === 'sac'
                ? 'gold-gradient-btn'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{t.tabSac}</span>
          </button>
        </div>

        {/* Tool Content Container */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-4 sm:p-6">
          {activeTool === 'nitrox' && <NitroxCalculator />}
          {activeTool === 'bwraf' && <BwrafChecklist />}
          {activeTool === 'sac' && <SacCalculator />}
        </div>
      </div>
    </div>
  );
};
