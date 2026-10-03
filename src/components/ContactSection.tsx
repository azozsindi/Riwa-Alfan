import React from 'react';
import { Mail, MapPin, MessageSquare, Calendar, ShieldCheck, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';

interface ContactSectionProps {
  onOpenBooking: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenBooking }) => {
  const { language, isRtl } = useLanguage();
  const { config } = useSiteConfig();
  const t = UI_TRANSLATIONS[language];

  const phone = config.brand.phone || '+966530549675';
  const whatsappNumber = config.brand.whatsappNumber || '966530549675';
  const email = config.brand.email || 'Riwaalfan@gmail.com';

  const whatsAppText = isRtl
    ? `السلام عليكم كابتن فهد، أود الاستفسار عن تفاصيل التدريب بجدة`
    : `Hello Captain Fahad, I would like to inquire about certified scuba training in Jeddah.`;

  return (
    <section id="contact" className="py-24 bg-slate-950 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className={`rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 relative overflow-hidden ${
          isRtl ? 'text-right' : 'text-left'
        }`}>
          
          {/* Subtle logo blue glow effect */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 blur-[110px] pointer-events-none rounded-full" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Info */}
            <div className="lg:col-span-7 space-y-5">
              <div className="text-xs font-semibold text-blue-400 tracking-wider">
                {t.contactKicker}
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {t.contactTitle}
              </h2>

              <p className="text-base text-slate-300 leading-relaxed max-w-xl">
                {t.contactDesc}
              </p>

              {/* Direct Contact Links */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsAppText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">{t.directWhatsApp}</span>
                    <span className="font-semibold text-white group-hover:text-emerald-300 font-mono">
                      {phone}
                    </span>
                  </div>
                </a>

                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">{isRtl ? 'اتصال مباشر:' : 'Direct Call:'}</span>
                    <span className="font-semibold text-white group-hover:text-blue-300 font-mono">
                      {phone}
                    </span>
                  </div>
                </a>

                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">{t.emailLabel}</span>
                    <span className="font-semibold text-white group-hover:text-blue-300 font-mono text-xs">
                      {email}
                    </span>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">{t.regionsLabel}</span>
                    <span className="font-semibold text-white text-xs">
                      {t.regionsText}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">{t.certAgencyLabel}</span>
                    <span className="font-semibold text-white text-xs">
                      {t.certAgencyText}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Action Card */}
            <div className="lg:col-span-5 text-center p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4">
              <h3 className="text-xl font-bold text-white">{t.contactCardTitle}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.contactCardDesc}
              </p>

              <button
                onClick={onOpenBooking}
                className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-xl shadow-blue-600/30 cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                <span>{t.contactCardBtn}</span>
              </button>

              <div className="text-[11px] text-slate-500">
                {t.availableDaily}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
