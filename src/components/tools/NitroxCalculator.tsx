import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../data/translations';

export const NitroxCalculator: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const t = translations[language];
  const [o2Percent, setO2Percent] = useState<number>(32);
  const [po2Limit, setPo2Limit] = useState<number>(1.4);

  // Calculations for Nitrox MOD and EAD
  const fo2 = o2Percent / 100;
  const pAmbientMax = po2Limit / fo2;
  const modMeters = Math.max(0, Math.floor((pAmbientMax - 1) * 10));
  const modFeet = Math.round(modMeters * 3.28084);
  
  // Equivalent Air Depth (EAD) calculation at MOD
  const fn2 = 1 - fo2;
  const eadMeters = Math.max(0, Math.round(((fn2 / 0.79) * (modMeters / 10 + 1) - 1) * 10));

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isRtl ? 'text-right' : 'text-left'}`}>
      
      {/* Inputs */}
      <div className="lg:col-span-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white">{t.nitroxTitle}</h3>
          <p className="text-xs text-slate-400 mt-1">
            {t.nitroxDesc}
          </p>
        </div>

        {/* Oxygen slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{t.o2PercentLabel}</span>
            <span className="font-mono text-[#E0BA84] font-bold text-base">{o2Percent}% EANx</span>
          </div>
          <input
            type="range"
            min="21"
            max="40"
            step="1"
            value={o2Percent}
            onChange={(e) => setO2Percent(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#C59B5F]"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>{t.airStandard}</span>
            <span>{t.ean32}</span>
            <span>{t.ean36}</span>
            <span>{t.ean40}</span>
          </div>
        </div>

        {/* PO2 Selector */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400 block">{t.po2Label}</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPo2Limit(1.4)}
              className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                po2Limit === 1.4
                  ? 'border-[#C59B5F] bg-[#C59B5F]/15 text-[#E0BA84]'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              <span className="block font-bold">{t.po2_14}</span>
              <span className="text-[11px] text-slate-400 font-normal">{t.po2_14_sub}</span>
            </button>

            <button
              type="button"
              onClick={() => setPo2Limit(1.6)}
              className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                po2Limit === 1.6
                  ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              <span className="block font-bold">{t.po2_16}</span>
              <span className="text-[11px] text-slate-400 font-normal">{t.po2_16_sub}</span>
            </button>
          </div>
        </div>

        {/* Safety notice */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
          <AlertCircle className="w-4 h-4 text-[#C59B5F] shrink-0 mt-0.5" />
          <span>{t.nitroxAlert}</span>
        </div>
      </div>

      {/* Visual Result Display Gauge */}
      <div className="lg:col-span-6">
        <div className="rounded-2xl bg-gradient-to-b from-slate-950 via-slate-950 to-[#162E52]/40 border border-[#C59B5F]/35 p-6 sm:p-8 text-center space-y-6">
          
          <div className="text-xs font-semibold text-slate-400">
            {t.modResultTitle}
          </div>

          <div className="py-2">
            <span className="text-5xl sm:text-6xl font-black text-[#E0BA84] font-mono tracking-tight tabular-nums">
              {modMeters}
            </span>
            <span className="text-2xl font-bold text-white mx-2">{t.metersLabel}</span>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              ({modFeet} {t.feetLabel})
            </div>
          </div>

          {/* Secondary stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-center">
            <div>
              <span className="text-xs text-slate-500 block">{t.eadLabel}</span>
              <span className="text-lg font-bold text-white font-mono">{eadMeters} {t.metersLabel}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">{t.po2ResultLabel}</span>
              <span className="text-lg font-bold text-blue-300 font-mono">{po2Limit} bar</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            {t.nitroxSummaryText(o2Percent, modMeters)}
          </div>

        </div>
      </div>

    </div>
  );
};
