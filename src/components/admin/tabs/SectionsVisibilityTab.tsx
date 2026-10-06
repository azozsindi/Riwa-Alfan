import React, { useState } from 'react';
import { 
  Eye, EyeOff, Layout, Sparkles, Check, Info, Shield, HelpCircle, Waves, 
  Calculator, MessageSquare, Anchor, Award, AlertTriangle, Hammer, MessageCircle as WhatsAppIcon, Save 
} from 'lucide-react';
import { VisibleSectionsConfig } from '../../../types/admin';
import { DEFAULT_VISIBLE_SECTIONS, DEFAULT_UNDER_CONSTRUCTION } from '../../../data/defaultConfig';
import { useLanguage } from '../../../context/LanguageContext';
import { useSiteConfig } from '../../../context/SiteConfigContext';

interface SectionsVisibilityTabProps {
  visibleSections?: VisibleSectionsConfig;
  onUpdate: (partial: Partial<VisibleSectionsConfig>) => void;
  showToast: (msg?: string) => void;
}

export const SectionsVisibilityTab: React.FC<SectionsVisibilityTabProps> = ({
  visibleSections = DEFAULT_VISIBLE_SECTIONS,
  onUpdate,
  showToast
}) => {
  const { isRtl } = useLanguage();
  const { config, updateUnderConstruction, toggleUnderConstruction } = useSiteConfig();

  const uc = config.underConstruction || DEFAULT_UNDER_CONSTRUCTION;
  const isUcEnabled = (uc.enabled ?? true) && (visibleSections.underConstructionBar !== false);

  const [badgeText, setBadgeText] = useState(uc.badgeAr || 'الموقع قيد الإنشاء والتحديث 🚧');
  const [msgText, setMsgText] = useState(uc.textAr || 'الموقع قيد التجهيز والتطوير حالياً · يسعدنا استقبال استفساراتكم وحجوزات دورات الغوص عبر الواتساب مباشرة');
  const [showWaBtn, setShowWaBtn] = useState(uc.showWhatsAppButton !== false);

  const toggle = (key: keyof VisibleSectionsConfig) => {
    const nextVal = !visibleSections[key];
    onUpdate({ [key]: nextVal });
    if (key === 'underConstructionBar') {
      updateUnderConstruction({ enabled: nextVal });
    }
    showToast(
      nextVal 
        ? (isRtl ? 'تم إظهار وتفعيل القسم بنجاح' : 'Section is now Visible')
        : (isRtl ? 'تم إخفاء القسم بنجاح من الموقع' : 'Section is now Hidden')
    );
  };

  const handleSaveUc = (e: React.FormEvent) => {
    e.preventDefault();
    updateUnderConstruction({
      enabled: isUcEnabled,
      badgeAr: badgeText.trim(),
      textAr: msgText.trim(),
      showWhatsAppButton: showWaBtn
    });
    showToast(isRtl ? 'تم حفظ نص وإعدادات شريط قيد الإنشاء!' : 'Under construction settings saved!');
  };

  const handleShowAll = () => {
    onUpdate({
      underConstructionBar: true,
      announcement: true,
      hero: true,
      instructor: true,
      femaleTraining: true,
      quoteBanner: true,
      courses: true,
      quickPortals: true,
      diveSitesModal: true,
      diverToolsModal: true,
      faqModal: true,
      testimonials: true,
      contact: true,
      footer: true,
    });
    updateUnderConstruction({ enabled: true });
    showToast(isRtl ? 'تم إظهار وتفعيل جميع أقسام الموقع! 👁️' : 'All sections are now visible!');
  };

  const handleCompactMode = () => {
    onUpdate({
      underConstructionBar: isUcEnabled,
      announcement: true,
      hero: true,
      instructor: true,
      femaleTraining: true,
      quoteBanner: false,
      courses: true,
      quickPortals: true,
      diveSitesModal: true,
      diverToolsModal: true,
      faqModal: true,
      testimonials: false,
      contact: true,
      footer: true,
    });
    showToast(isRtl ? 'تم تفعيل وضع الصفحة الرشيقة فائقة السرعة ⚡' : 'Compact mode activated!');
  };

  const sectionsList: Array<{
    key: keyof VisibleSectionsConfig;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    icon: React.ReactNode;
    category: 'page' | 'modal';
  }> = [
    {
      key: 'underConstructionBar',
      titleAr: 'شريط تنبيه الموقع قيد الإنشاء (أعلى الشاشة)',
      titleEn: 'Under Construction & Updates Top Banner',
      descAr: 'شريط تنبيهي أنيق أعلى الموقع يفيد بأن الموقع قيد التجهيز والتطوير حالياً مع زر واتساب مباشر.',
      descEn: 'Top banner stating the website is under development & updates with direct WhatsApp action.',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      category: 'page'
    },
    {
      key: 'announcement',
      titleAr: 'شريط العروض الترويجي العلوي',
      titleEn: 'Announcement & Offers Bar',
      descAr: 'الشريط المتحرك أعلى الموقع للإعلان عن الخصومات والحجوزات المبكرة.',
      descEn: 'Top announcement ribbon highlighting seasonal offers and discounts.',
      icon: <Sparkles className="w-5 h-5 text-blue-400" />,
      category: 'page'
    },
    {
      key: 'hero',
      titleAr: 'واجهة الترحيب والإحصائيات الرئيسية (Hero)',
      titleEn: 'Hero Header & Stats Section',
      descAr: 'العنوان الرئيسي الجذاب، أزرار الحجز، وإحصائيات الغوصات والمتدربين.',
      descEn: 'Main headline, call to actions, and live dive/student stats.',
      icon: <Anchor className="w-5 h-5 text-blue-400" />,
      category: 'page'
    },
    {
      key: 'instructor',
      titleAr: 'كرت كابتن فهد الهويملي (كبير المدربين)',
      titleEn: 'Capt. Fahad Al-Huwaimli Card',
      descAr: 'كرت كبير المدربين، رخص PADI، نبذة الخبرة، وأزرار الحجز والواتساب.',
      descEn: 'Lead instructor profile, PADI credentials, and direct booking buttons.',
      icon: <Award className="w-5 h-5 text-[#C59B5F]" />,
      category: 'page'
    },
    {
      key: 'femaleTraining',
      titleAr: 'كرت قسم التدريب النسائي الخاص (كابتن ريم)',
      titleEn: 'Women\'s Training Division (Capt. Reem)',
      descAr: 'كرت التدريب النسائي بمسابح مغلقة وخصوصية 100% وأزرار الحجز المباشر.',
      descEn: 'Private female-led diving in private indoor pools with 100% privacy.',
      icon: <span className="text-xl">🧕</span>,
      category: 'page'
    },
    {
      key: 'quoteBanner',
      titleAr: 'شريط حكمة وفلسفة البحر المقتبسة',
      titleEn: 'Captain\'s Philosophy Quote Banner',
      descAr: 'شريط فلسفة التدريب والهدوء والأمان بالبحر الأحمر.',
      descEn: 'Inspirational deep-sea ocean serenity quote.',
      icon: <Waves className="w-5 h-5 text-cyan-400" />,
      category: 'page'
    },
    {
      key: 'courses',
      titleAr: 'كتالوج دورات الغوص المعتمدة والأسعار',
      titleEn: 'Accredited Diving Courses Catalog',
      descAr: 'بطاقات الدورات (Open Water, Advanced, Rescue, Specialties) والأسعار.',
      descEn: 'PADI courses grid with syllabus, duration, prerequisites, and fees.',
      icon: <Layout className="w-5 h-5 text-emerald-400" />,
      category: 'page'
    },
    {
      key: 'quickPortals',
      titleAr: 'بوابات الوصول السريع التفاعلية',
      titleEn: 'Interactive Quick Action Portals',
      descAr: 'البوابات الثلاث السريعة لمواقع الغوص، الحاسبات، والأسئلة الشائعة.',
      descEn: 'Quick interactive gateways for Dive Sites, Diver Calculators & FAQs.',
      icon: <Sparkles className="w-5 h-5 text-[#C59B5F]" />,
      category: 'page'
    },
    {
      key: 'diveSitesModal',
      titleAr: 'دليل مواقع الغوص التفاعلي بجدة (Modal)',
      titleEn: 'Jeddah Dive Sites Interactive Explorer',
      descAr: 'نافذة استكشاف مواقع الغوص وشِعاب وحطام سفن جدة التاريخية.',
      descEn: 'Interactive popup directory of dive sites, depths, and wildlife.',
      icon: <Waves className="w-5 h-5 text-cyan-400" />,
      category: 'modal'
    },
    {
      key: 'diverToolsModal',
      titleAr: 'حاسبات وأدوات الغواصين الذكية (Modal)',
      titleEn: 'Smart Diver Calculators & Tools',
      descAr: 'حاسبة SAC Rate، استهلاك الهواء، وضغط الأعماق بوحدات بار ومتر.',
      descEn: 'Interactive diver tools: SAC rate, pressure, and air consumption.',
      icon: <Calculator className="w-5 h-5 text-amber-400" />,
      category: 'modal'
    },
    {
      key: 'faqModal',
      titleAr: 'بنك الأسئلة الشائعة وإجابات الكابتن (Modal)',
      titleEn: 'Captain\'s FAQ Answers Directory',
      descAr: 'نافذة إجابات الكابتن التفصيلية على أكثر الأسئلة تكراراً.',
      descEn: 'Common diving questions answered directly by Captain Fahad.',
      icon: <HelpCircle className="w-5 h-5 text-indigo-400" />,
      category: 'modal'
    },
    {
      key: 'testimonials',
      titleAr: 'تجارب وآراء خريجي الغوص الموثقة',
      titleEn: 'Verified Diver Testimonials',
      descAr: 'عرض قصص وتجارب المتدربين وتقييمات الـ 5 نجوم من غواصي رواء الفن.',
      descEn: 'Student reviews, 5-star ratings, and transformation stories.',
      icon: <MessageSquare className="w-5 h-5 text-pink-400" />,
      category: 'page'
    },
    {
      key: 'contact',
      titleAr: 'قسم التواصل المباشر ونموذج الاستشارة',
      titleEn: 'Direct Contact & Consultation Form',
      descAr: 'نموذج إرسال الطلبات، أرقام الواتساب، والاتصال المباشر مع الكابتن.',
      descEn: 'Consultation form, direct phone, and WhatsApp action buttons.',
      icon: <MessageSquare className="w-5 h-5 text-emerald-400" />,
      category: 'page'
    },
    {
      key: 'footer',
      titleAr: 'تذييل الصفحة ومعلومات رواء الفن (Footer)',
      titleEn: 'Website Footer & Navigation',
      descAr: 'الفوتر الكامل مع بيانات التوثيق، روابط الصفحات، وإخلاء المسؤولية.',
      descEn: 'Complete footer with legal accreditation, quick links, and disclaimer.',
      icon: <Shield className="w-5 h-5 text-slate-400" />,
      category: 'page'
    }
  ];

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Eye className="w-4 h-4" />
              <span>{isRtl ? 'صلاحيات الظهور والإخفاء الفوري' : 'Live Section Visibility Manager'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-brand-arabic">
              {isRtl ? 'التحكم في ظهور وإخفاء أقسام الموقع' : 'Show / Hide Website Sections'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {isRtl 
                ? 'تحكم بنقرة واحدة في إظهار أو إخفاء أي قسم أو شريط في الموقع لتخصيص الواجهة حسب رغبتك.'
                : 'Instantly toggle any section, banner, or popup on the website with a single click.'}
            </p>
          </div>

          {/* Quick Action Presets */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleShowAll}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>{isRtl ? 'إظهار الكل 👁️' : 'Show All'}</span>
            </button>

            <button
              type="button"
              onClick={handleCompactMode}
              className="px-4 py-2.5 rounded-xl gold-gradient-btn text-slate-950 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-[#C59B5F]/20"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{isRtl ? 'وضع الصفحة الرشيقة ⚡' : 'Compact Mode'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            {isRtl 
              ? 'ملاحظة: التغييرات تُطبق فوراً لحظياً في الموقع دون الحاجة لإعادة تحميل الصفحة.'
              : 'Notice: All changes are synced and applied immediately to the public website.'}
          </span>
        </div>
      </div>

      {/* Featured Under Construction Control Card */}
      <form onSubmit={handleSaveUc} className="p-6 rounded-3xl bg-slate-950 border-2 border-amber-500/40 shadow-xl shadow-amber-950/20 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-extrabold text-white">
                  {isRtl ? 'شريط تنبيه: الموقع قيد الإنشاء (أعلى الشاشة)' : 'Top Under Construction Banner'}
                </h4>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  isUcEnabled 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {isUcEnabled ? (isRtl ? 'ظاهر للزوار 🟢' : 'Visible 🟢') : (isRtl ? 'مخفي حالياً ⚪' : 'Hidden ⚪')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isRtl 
                  ? 'شريط مميز في قمة الموقع يُعلم الزوار بأن المنصة قيد التجهيز مع توفير زر واتساب للتواصل.'
                  : 'Notice banner at the very top of the page informing visitors that the site is in progress.'}
              </p>
            </div>
          </div>

          {/* Big ON / OFF Switch */}
          <button
            type="button"
            onClick={() => toggle('underConstructionBar')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isUcEnabled
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {isUcEnabled ? (
              <>
                <Eye className="w-4 h-4 text-slate-950" />
                <span>{isRtl ? 'مفعل (اضغط للإخفاء) 🟢' : 'Active (Click to Hide)'}</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 text-slate-400" />
                <span>{isRtl ? 'معطل ومخفي (اضغط للتشغيل) ⚪' : 'Hidden (Click to Show)'}</span>
              </>
            )}
          </button>
        </div>

        {/* Text Customizer Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              {isRtl ? 'شارة التنبيه (Badge):' : 'Banner Badge:'}
            </label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="الموقع قيد الإنشاء والتحديث 🚧"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>{isRtl ? 'زر التواصل السريع عبر واتساب:' : 'Direct WhatsApp Action:'}</span>
              <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showWaBtn}
                  onChange={(e) => setShowWaBtn(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-emerald-500"
                />
                <span>{isRtl ? 'إظهار الزر' : 'Show Button'}</span>
              </label>
            </label>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <WhatsAppIcon className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isRtl ? 'يربط مباشرة برقم واتساب كابتن فهد المعتمد' : 'Directly links to Captain Fahad\'s WhatsApp'}</span>
            </div>
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              {isRtl ? 'نص رسالة التنبيه المعروضة للزوار:' : 'Notice Message Text:'}
            </label>
            <textarea
              rows={2}
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-md shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            <span>{isRtl ? 'حفظ نص شريط قيد الإنشاء' : 'Save Notice Content'}</span>
          </button>
        </div>
      </form>

      {/* Grid of All Sections */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
          <Layout className="w-4 h-4 text-blue-400" />
          <span>{isRtl ? 'قائمة كامل أقسام الموقع وصفحاته' : 'All Website Sections & Features'}</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectionsList.map((sec) => {
            const isVisible = visibleSections[sec.key] !== false;
            return (
              <div 
                key={sec.key}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  isVisible
                    ? 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                    {sec.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-white block truncate">
                        {isRtl ? sec.titleAr : sec.titleEn}
                      </span>
                      {sec.category === 'modal' && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 border border-blue-500/30 text-blue-400 shrink-0">
                          نافذة
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block line-clamp-1 mt-0.5">
                      {isRtl ? sec.descAr : sec.descEn}
                    </span>
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggle(sec.key)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    isVisible
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 hover:bg-blue-600/30'
                      : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                  }`}
                  title={isVisible ? (isRtl ? 'إخفاء القسم' : 'Hide') : (isRtl ? 'إظهار القسم' : 'Show')}
                >
                  {isVisible ? (
                    <Eye className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
