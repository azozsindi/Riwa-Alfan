import React, { useState } from 'react';
import { DiveSite } from '../data/divingData';
import { MapPin, Compass, Anchor, Fish } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';

interface DiveSitesSectionProps {
  onBookTrip: (siteName: string) => void;
}

export const DiveSitesSection: React.FC<DiveSitesSectionProps> = ({ onBookTrip }) => {
  const { language, isRtl } = useLanguage();
  const { config } = useSiteConfig();
  const t = UI_TRANSLATIONS[language];

  const sites = config.diveSites || [];
  const [selectedSiteId, setSelectedSiteId] = useState<string>(sites[0]?.id || '');

  const activeSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  if (!activeSite) return null;

  return (
    <section id="dive-sites" className="py-16 sm:py-24 bg-slate-900/40 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`max-w-3xl mb-10 sm:mb-12 space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="text-xs font-semibold text-blue-400 tracking-wider">
            {t.sitesKicker}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-brand-arabic">
            {t.sitesTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.sitesDesc}
          </p>
        </div>

        {/* Interactive Site Explorer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sites List Selector */}
          <div className="lg:col-span-5 space-y-3">
            {sites.map((site) => (
              <button
                key={site.id}
                onClick={() => setSelectedSiteId(site.id)}
                className={`w-full p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isRtl ? 'text-right' : 'text-left'
                } ${
                  activeSite.id === site.id
                    ? 'bg-slate-900 border-blue-500/60 shadow-lg shadow-blue-500/10'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="space-y-1">
                  <h3 className={`text-base font-bold ${activeSite.id === site.id ? 'text-white' : 'text-slate-300'}`}>
                    {site.name[language]}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{site.location[language]}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-blue-400">{site.depth[language]}</span>
                  </div>
                </div>

                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                  activeSite.id === site.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-800 text-slate-500'
                }`}>
                  <Compass className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Active Site Showcase */}
          <div className="lg:col-span-7">
            <div className={`rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 space-y-6 ${
              isRtl ? 'text-right' : 'text-left'
            }`}>
              
              {/* Site Header */}
              <div className="space-y-2 border-b border-slate-800/80 pb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-blue-400 font-semibold">{activeSite.level[language]}</span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>{activeSite.location[language]}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white">
                  {activeSite.name[language]}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {activeSite.description[language]}
              </p>

              {/* Site Specifications Grid */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <div>
                  <span className="text-slate-500 text-xs block mb-1">{t.depthWord}</span>
                  <span className="text-sm sm:text-base font-bold text-white font-mono">{activeSite.depth[language]}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block mb-1">{t.visWord}</span>
                  <span className="text-sm sm:text-base font-bold text-blue-400 font-mono">{activeSite.visibility[language]}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block mb-1">{t.currentWord}</span>
                  <span className="text-sm sm:text-base font-bold text-sky-400">{activeSite.current[language]}</span>
                </div>
              </div>

              {/* Marine Wildlife Encounter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Fish className="w-4 h-4 text-blue-400" />
                  <span>{t.wildlifeExpected}</span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                  {activeSite.marineLife[language].map((animal, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
                    >
                      {animal}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action to book trip to this site */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <span className="text-xs text-slate-400">
                  {t.weeklyTripsNote}
                </span>

                <button
                  onClick={() => onBookTrip(activeSite.name[language])}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors shadow-lg shadow-blue-600/30 cursor-pointer shrink-0"
                >
                  <Anchor className="w-4 h-4" />
                  <span>{t.bookSeat}</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
