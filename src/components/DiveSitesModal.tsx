import React, { useState } from 'react';
import { X, MapPin, Compass, Anchor, Fish, Ship, Waves } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';

interface DiveSitesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTrip: (siteName: string) => void;
}

export const DiveSitesModal: React.FC<DiveSitesModalProps> = ({ isOpen, onClose, onBookTrip }) => {
  const { language, isRtl } = useLanguage();
  const { config } = useSiteConfig();
  const t = UI_TRANSLATIONS[language];

  const sites = config.diveSites || [];
  const [selectedSiteId, setSelectedSiteId] = useState<string>(sites[0]?.id || '');

  if (!isOpen) return null;

  const activeSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  const handleBook = (siteName: string) => {
    onClose();
    onBookTrip(siteName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 my-6 max-h-[92vh] overflow-y-auto"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Waves className="w-4 h-4 text-cyan-400" />
              <span>{isRtl ? 'رحلات وأعماق البحر الأحمر' : 'Red Sea Dive Safaris'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-brand-arabic">
              {t.sitesTitle}
            </h2>
            <p className="text-xs text-slate-400">
              {t.sitesDesc}
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

        {/* Sites Selector (Tabs on mobile / Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Sites List */}
          <div className="md:col-span-5 space-y-2.5 max-h-[50vh] overflow-y-auto pe-1">
            {sites.map((site) => {
              const isSelected = activeSite?.id === site.id;
              return (
                <button
                  key={site.id}
                  type="button"
                  onClick={() => setSelectedSiteId(site.id)}
                  className={`w-full p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isRtl ? 'text-right' : 'text-left'
                  } ${
                    isSelected
                      ? 'bg-slate-950 border-cyan-500/70 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <h3 className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {site.name[language]}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{site.location[language]}</span>
                      <span>·</span>
                      <span className="font-mono text-cyan-400 shrink-0">{site.depth[language]}</span>
                    </div>
                  </div>

                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border text-xs ${
                    isSelected
                      ? 'bg-cyan-500 border-cyan-500 text-slate-950'
                      : 'border-slate-800 text-slate-500'
                  }`}>
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Site Details */}
          {activeSite && (
            <div className="md:col-span-7 rounded-2xl bg-slate-950/90 border border-slate-800/90 p-5 sm:p-6 space-y-5">
              <div className="space-y-2 border-b border-slate-800/80 pb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    {activeSite.level[language]}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{activeSite.location[language]}</span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white font-brand-arabic">
                  {activeSite.name[language]}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeSite.description[language]}
              </p>

              {/* Site Specifications Grid */}
              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <div>
                  <span className="text-slate-500 text-[10px] sm:text-xs block mb-0.5">{t.depthWord}</span>
                  <span className="text-xs sm:text-sm font-bold text-white font-mono">{activeSite.depth[language]}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] sm:text-xs block mb-0.5">{t.visWord}</span>
                  <span className="text-xs sm:text-sm font-bold text-cyan-400 font-mono">{activeSite.visibility[language]}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] sm:text-xs block mb-0.5">{t.currentWord}</span>
                  <span className="text-xs sm:text-sm font-bold text-sky-400">{activeSite.current[language]}</span>
                </div>
              </div>

              {/* Marine Wildlife Encounter */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <Fish className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.wildlifeExpected}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs text-slate-300">
                  {activeSite.marineLife[language].map((animal, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px]"
                    >
                      {animal}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Book Trip */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleBook(activeSite.name[language])}
                  className="gold-gradient-btn w-full py-3 px-4 rounded-xl text-center text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95 shadow-lg shadow-[#C59B5F]/20 text-slate-950 flex items-center justify-center gap-2"
                >
                  <Ship className="w-4 h-4 text-slate-950" />
                  <span>{isRtl ? `احجز رحلة بحرية إلى (${activeSite.name[language]})` : `Book Safari to ${activeSite.name[language]}`}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
