import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../data/translations';

export const SacCalculator: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const t = translations[language];
  const [tankVolume, setTankVolume] = useState<number>(12); // 12 Liter tank
  const [startBar, setStartBar] = useState<number>(200);
  const [endBar, setEndBar] = useState<number>(50);
  const [avgDepth, setAvgDepth] = useState<number>(18);
  const [diveTime, setDiveTime] = useState<number>(45);

  // SAC Rate calculation
  const totalGasConsumed = Math.max(0, (startBar - endBar) * tankVolume);
  const ata = (avgDepth / 10) + 1;
  const sacRate = diveTime > 0 ? (totalGasConsumed / (ata * diveTime)).toFixed(1) : '0';

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isRtl ? 'text-right' : 'text-left'}`}>
      
      <div className="lg:col-span-7 space-y-5">
        <div>
          <h3 className="text-xl font-bold text-white">{t.sacTitle}</h3>
          <p className="text-xs text-slate-400 mt-1">
            {t.sacDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">{t.tankSizeLabel}</label>
            <select
              value={tankVolume}
              onChange={(e) => setTankVolume(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
            >
              <option value="10">{t.tank10}</option>
              <option value="12">{t.tank12}</option>
              <option value="15">{t.tank15}</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">{t.avgDepthLabel}</label>
            <input
              type="number"
              min="5"
              max="40"
              value={avgDepth}
              onChange={(e) => setAvgDepth(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">{t.startBarLabel}</label>
            <input
              type="number"
              value={startBar}
              onChange={(e) => setStartBar(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">{t.endBarLabel}</label>
            <input
              type="number"
              value={endBar}
              onChange={(e) => setEndBar(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">{t.diveTimeLabel}</label>
          <input
            type="number"
            value={diveTime}
            onChange={(e) => setDiveTime(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-xs"
          />
        </div>
      </div>

      {/* SAC Result Display */}
      <div className="lg:col-span-5">
        <div className="rounded-2xl bg-slate-950 border border-[#C59B5F]/35 p-6 sm:p-8 text-center space-y-4">
          <div className="text-xs text-slate-400">{t.sacResultTitle}</div>
          <div>
            <span className="text-5xl font-black text-[#E0BA84] font-mono tabular-nums">{sacRate}</span>
            <span className="text-base text-slate-300 mx-2">{t.literPerMin}</span>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
            <p>{t.sacIdeal}</p>
            <p>{t.sacAvg}</p>
            <p>{t.sacHigh}</p>
          </div>
        </div>
      </div>

    </div>
  );
};
