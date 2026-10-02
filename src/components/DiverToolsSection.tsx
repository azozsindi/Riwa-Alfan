import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Gauge, AlertCircle, RefreshCw, Sparkles, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UI_TRANSLATIONS } from '../data/translations';

export const DiverToolsSection: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'nitrox' | 'bwraf' | 'sac'>('nitrox');
  const { language, isRtl } = useLanguage();
  const t = UI_TRANSLATIONS[language];

  // Nitrox Calculator State
  const [o2Percent, setO2Percent] = useState<number>(32); // EAN32 standard
  const [po2Limit, setPo2Limit] = useState<number>(1.4); // 1.4 recreational max

  // BWRAF Checklist State
  const [checklist, setChecklist] = useState({
    b: false, // BCD
    w: false, // Weights
    r: false, // Releases
    a: false, // Air
    f: false  // Final OK
  });

  // SAC Rate Calculator State
  const [tankVolume, setTankVolume] = useState<number>(12); // 12 Liter tank
  const [startBar, setStartBar] = useState<number>(200);
  const [endBar, setEndBar] = useState<number>(50);
  const [avgDepth, setAvgDepth] = useState<number>(18);
  const [diveTime, setDiveTime] = useState<number>(45);

  // Calculations for Nitrox
  const fo2 = o2Percent / 100;
  const pAmbientMax = po2Limit / fo2;
  const modMeters = Math.max(0, Math.floor((pAmbientMax - 1) * 10));
  const modFeet = Math.round(modMeters * 3.28084);
  
  // Equivalent Air Depth (EAD) calculation at MOD
  const fn2 = 1 - fo2;
  const eadMeters = Math.max(0, Math.round(((fn2 / 0.79) * (modMeters / 10 + 1) - 1) * 10));

  // BWRAF completion calculation
  const completedChecks = Object.values(checklist).filter(Boolean).length;
  const isBwrafComplete = completedChecks === 5;

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetBwraf = () => {
    setChecklist({ b: false, w: false, r: false, a: false, f: false });
  };

  // SAC Rate calculation
  const totalGasConsumed = Math.max(0, (startBar - endBar) * tankVolume);
  const ata = (avgDepth / 10) + 1;
  const sacRate = diveTime > 0 ? (totalGasConsumed / (ata * diveTime)).toFixed(1) : '0';

  return (
    <section id="diver-tools" className="py-24 bg-slate-950 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`max-w-3xl mb-12 space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="text-xs font-semibold text-blue-400 tracking-wider">
            {t.toolsKicker}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.toolsTitle}
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            {t.toolsDesc}
          </p>
        </div>

        {/* Tool Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl w-fit mb-8 max-w-full overflow-x-auto">
          <button
            onClick={() => setActiveTool('nitrox')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTool === 'nitrox'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>{t.tabNitrox}</span>
          </button>

          <button
            onClick={() => setActiveTool('bwraf')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTool === 'bwraf'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t.tabBwraf}</span>
          </button>

          <button
            onClick={() => setActiveTool('sac')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTool === 'sac'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{t.tabSac}</span>
          </button>
        </div>

        {/* Tool Container */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8">
          
          {/* TOOL 1: NITROX CALCULATOR */}
          {activeTool === 'nitrox' && (
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
                    <span className="font-mono text-blue-400 font-bold text-base">{o2Percent}% EANx</span>
                  </div>
                  <input
                    type="range"
                    min="21"
                    max="40"
                    step="1"
                    value={o2Percent}
                    onChange={(e) => setO2Percent(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
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
                          ? 'border-blue-500 bg-blue-600/15 text-blue-300'
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
                  <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>{t.nitroxAlert}</span>
                </div>
              </div>

              {/* Visual Result Display Gauge with Logo Blue */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl bg-gradient-to-b from-slate-950 via-slate-950 to-blue-950/40 border border-blue-500/30 p-6 sm:p-8 text-center space-y-6">
                  
                  <div className="text-xs font-semibold text-slate-400">
                    {t.modResultTitle}
                  </div>

                  <div className="py-2">
                    <span className="text-5xl sm:text-6xl font-black text-blue-400 font-mono tracking-tight tabular-nums">
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
          )}

          {/* TOOL 2: BWRAF PRE-DIVE CHECKLIST */}
          {activeTool === 'bwraf' && (
            <div className={`space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{t.bwrafTitle}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {t.bwrafDesc}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-blue-400 font-bold">
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
                  className="h-full bg-gradient-to-r from-blue-500 to-sky-400 transition-all duration-300"
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
                      ? 'bg-blue-600/15 border-blue-500/50 text-slate-100'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{t.bwrafB_Title}</div>
                    <p className="text-xs text-slate-300">{t.bwrafB_Desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
                    checklist.b ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-700'
                  }`}>
                    {checklist.b && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>

                {/* W: Weights */}
                <div
                  onClick={() => toggleCheck('w')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    checklist.w
                      ? 'bg-blue-600/15 border-blue-500/50 text-slate-100'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{t.bwrafW_Title}</div>
                    <p className="text-xs text-slate-300">{t.bwrafW_Desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
                    checklist.w ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-700'
                  }`}>
                    {checklist.w && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>

                {/* R: Releases */}
                <div
                  onClick={() => toggleCheck('r')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    checklist.r
                      ? 'bg-blue-600/15 border-blue-500/50 text-slate-100'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{t.bwrafR_Title}</div>
                    <p className="text-xs text-slate-300">{t.bwrafR_Desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
                    checklist.r ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-700'
                  }`}>
                    {checklist.r && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>

                {/* A: Air */}
                <div
                  onClick={() => toggleCheck('a')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    checklist.a
                      ? 'bg-blue-600/15 border-blue-500/50 text-slate-100'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{t.bwrafA_Title}</div>
                    <p className="text-xs text-slate-300">{t.bwrafA_Desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
                    checklist.a ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-700'
                  }`}>
                    {checklist.a && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>

                {/* F: Final OK */}
                <div
                  onClick={() => toggleCheck('f')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 md:col-span-2 ${
                    checklist.f
                      ? 'bg-blue-600/15 border-blue-500/50 text-slate-100'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{t.bwrafF_Title}</div>
                    <p className="text-xs text-slate-300">{t.bwrafF_Desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
                    checklist.f ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-700'
                  }`}>
                    {checklist.f && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>

              </div>

              {/* Completion Banner */}
              {isBwrafComplete && (
                <div className="p-4 rounded-2xl bg-blue-600/15 border border-blue-500/40 flex items-center justify-between text-xs sm:text-sm text-blue-300 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <span className="font-bold">{t.bwrafDoneBanner}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TOOL 3: SAC RATE ESTIMATOR */}
          {activeTool === 'sac' && (
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

              {/* SAC Result */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-slate-950 border border-blue-500/30 p-6 sm:p-8 text-center space-y-4">
                  <div className="text-xs text-slate-400">{t.sacResultTitle}</div>
                  <div>
                    <span className="text-5xl font-black text-blue-400 font-mono tabular-nums">{sacRate}</span>
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
          )}

        </div>

      </div>
    </section>
  );
};
