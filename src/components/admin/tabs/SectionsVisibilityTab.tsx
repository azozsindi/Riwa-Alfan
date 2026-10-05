import React from 'react';
import { Eye, EyeOff, Layout, Sparkles, Check, Info, Shield, HelpCircle, Waves, Calculator, MessageSquare, Anchor, Award } from 'lucide-react';
import { VisibleSectionsConfig } from '../../../types/admin';
import { DEFAULT_VISIBLE_SECTIONS } from '../../../data/defaultConfig';
import { useLanguage } from '../../../context/LanguageContext';

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

  const toggle = (key: keyof VisibleSectionsConfig) => {
    const nextVal = !visibleSections[key];
    onUpdate({ [key]: nextVal });
    showToast(
      nextVal 
        ? (isRtl ? 'تم إظهار وتفعيل القسم بنجاح' : 'Section is now Visible')
        : (isRtl ? 'تم إخفاء القسم بنجاح من الموقع' : 'Section is now Hidden')
    );
  };

  const handleShowAll = () => {
    onUpdate({
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
    showToast(isRtl ? 'تم إظهار وتفعيل جميع أقسام الموقع! 👁️' : 'All sections are now visible!');
  };

  const handleCompactMode = () => {
    onUpdate({
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
      key: 'announcement',
      titleAr: 'شريط العروض الترويجي العلوي',
      titleEn: 'Announcement & Offers Bar',
      descAr: 'الشريط المتحرك أعلى الموقع للإعلان عن الخصومات والحجوزات المبكرة.',
      descEn: 'Top announcement ribbon highlighting seasonal offers and discounts.',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      category: 'page'
    },
    {
      key: 'hero',
      titleAr: 'واجهة البطل والترحيب والإحصائيات',
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
      titleAr: 'شريط فلسفة التدريب وركائز الثقة',
      titleEn: 'Training Philosophy & Trust Pillars',
      descAr: 'شريط الاقتباس الملهم وركائز الأمان الثلاثة أسفل بطاقات المدربين.',
      descEn: 'Inspiring quote and 3 safety pillars under instructor cards.',
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      category: 'page'
    },
    {
      key: 'courses',
      titleAr: 'كتالوج الدورات المعتمدة PADI',
      titleEn: 'PADI Courses Catalog',
      descAr: 'عرض الدورات والأسعار والمميزات والشهادات المعتمدة مع زر التوسيع.',
      descEn: 'Display of certified scuba courses, pricing, and international certificates.',
      icon: <Award className="w-5 h-5 text-cyan-400" />,
      category: 'page'
    },
    {
      key: 'quickPortals',
      titleAr: 'شريط البوابات السريعة (المواقع، الأسئلة، الأدوات)',
      titleEn: 'Quick Portals 3-Cards Row',
      descAr: 'الصف المدمج الأنيق الذي يفتح نوافذ المواقع والأسئلة وحاسبات الغواص.',
      descEn: 'Sleek 3-card portal row for Sites, FAQs, and Diver Calculators.',
      icon: <Layout className="w-5 h-5 text-indigo-400" />,
      category: 'page'
    },
    {
      key: 'testimonials',
      titleAr: 'قسم آراء وتقييمات المتدربين',
      titleEn: 'Reviews & Testimonials Section',
      descAr: 'عرض قصص وتجارب المتدربين وتقييمات الـ 5 نجوم من غواصي المركز.',
      descEn: 'Student success stories and 5-star reviews.',
      icon: <MessageSquare className="w-5 h-5 text-yellow-400" />,
      category: 'page'
    },
    {
      key: 'contact',
      titleAr: 'قسم التواصل وحجز الاستشارة',
      titleEn: 'Contact & Consultation Section',
      descAr: 'بطاقة الاتصال المباشر والواتساب وتحديد موعد التدريب بجدة.',
      descEn: 'Direct phone call, WhatsApp messaging, and consultation booking.',
      icon: <span className="text-xl">📞</span>,
      category: 'page'
    },
    {
      key: 'footer',
      titleAr: 'تذييل الصفحة ومعلومات المركز (Footer)',
      titleEn: 'Website Footer',
      descAr: 'أسفل الصفحة مع روابط التنقل، الشعار، سياسات الإلغاء، وحقوق النشر.',
      descEn: 'Footer with navigation links, policies, and copyright information.',
      icon: <span className="text-xl">🔻</span>,
      category: 'page'
    },
    {
      key: 'diverToolsModal',
      titleAr: 'نافذة حاسبات وأدوات الغواصين التفاعلية',
      titleEn: 'Interactive Diver Calculators Modal',
      descAr: 'حاسبة النيتروكس، الـ SAC، وقائمة فحص الأمان، وزرها في الهيدر والقائمة.',
      descEn: 'Nitrox MOD, SAC calculator, and header action button.',
      icon: <Calculator className="w-5 h-5 text-[#E0BA84]" />,
      category: 'modal'
    },
    {
      key: 'diveSitesModal',
      titleAr: 'نافذة دليل ومواقع غوص جدة والرحلات',
      titleEn: 'Jeddah Dive Sites & Safaris Modal',
      descAr: 'نافذة استعراض شعاب وحطام سفن جدة وتفاصيل الأعماق مع زر حجز الرحلة.',
      descEn: 'Interactive dive sites explorer with marine life details and booking button.',
      icon: <Waves className="w-5 h-5 text-cyan-400" />,
      category: 'modal'
    },
    {
      key: 'faqModal',
      titleAr: 'نافذة الأسئلة الشائعة حول الغوص',
      titleEn: 'FAQs & Inquiries Modal',
      descAr: 'نافذة أكورديون الأسئلة المتكررة حول شروط الغوص والفحص والشهادات.',
      descEn: 'Accordion FAQs modal with direct WhatsApp assistance.',
      icon: <HelpCircle className="w-5 h-5 text-blue-400" />,
      category: 'modal'
    }
  ];

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Tab Header Banner */}
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
                ? 'تحكم بنقرة واحدة في إظهار أو إخفاء أي قسم أو نافذة في الموقع لتخصيص الواجهة حسب حملاتك ومواسمك.'
                : 'Instantly toggle any section or interactive modal on the public website with a single click.'}
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

      {/* Group 1: Main Landing Page Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layout className="w-4 h-4 text-blue-400" />
            <span>{isRtl ? '1. الأقسام الرئيسية بالصفحة (Main Page Sections)' : '1. Main Page Sections'}</span>
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectionsList.filter(s => s.category === 'page').map((sec) => {
            const isVisible = visibleSections[sec.key];
            return (
              <div 
                key={sec.key}
                onClick={() => toggle(sec.key)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 select-none ${
                  isVisible 
                    ? 'bg-slate-950/80 border-slate-700/80 shadow-md hover:border-cyan-500/50' 
                    : 'bg-slate-950/30 border-slate-800/50 opacity-60 hover:opacity-90'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    {sec.icon}
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{isRtl ? sec.titleAr : sec.titleEn}</span>
                      {isVisible ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                          {isRtl ? 'ظاهر' : 'Visible'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-semibold">
                          {isRtl ? 'مخفي' : 'Hidden'}
                        </span>
                      )}
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isRtl ? sec.descAr : sec.descEn}
                    </p>
                  </div>
                </div>

                {/* Animated Modern iOS Switch */}
                <div className="shrink-0 pt-1">
                  <div className={`w-12 h-6 rounded-full transition-colors relative ${
                    isVisible ? 'bg-emerald-500' : 'bg-slate-800'
                  }`}>
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md absolute top-0.5 ${
                      isVisible 
                        ? (isRtl ? 'left-1' : 'right-1') 
                        : (isRtl ? 'right-1' : 'left-1')
                    }`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Group 2: Modals & Interactive Tools */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#C59B5F]" />
            <span>{isRtl ? '2. النوافذ المنبثقة التفاعلية وأزرارها (Interactive Modals)' : '2. Modals & Interactive Tools'}</span>
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sectionsList.filter(s => s.category === 'modal').map((sec) => {
            const isVisible = visibleSections[sec.key];
            return (
              <div 
                key={sec.key}
                onClick={() => toggle(sec.key)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 select-none ${
                  isVisible 
                    ? 'bg-slate-950/80 border-[#C59B5F]/40 shadow-md hover:border-[#C59B5F]' 
                    : 'bg-slate-950/30 border-slate-800/50 opacity-60 hover:opacity-90'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                      {sec.icon}
                    </div>
                    {/* Animated Modern iOS Switch */}
                    <div className={`w-12 h-6 rounded-full transition-colors relative ${
                      isVisible ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}>
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md absolute top-0.5 ${
                        isVisible 
                          ? (isRtl ? 'left-1' : 'right-1') 
                          : (isRtl ? 'right-1' : 'left-1')
                      }`} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-white">
                      {isRtl ? sec.titleAr : sec.titleEn}
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isRtl ? sec.descAr : sec.descEn}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-xs font-semibold">
                  {isVisible ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'مفعّل ويظهر في الهيدر والصفحة' : 'Active in Header & Modals'}</span>
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'معطّل ومخفي بالكامل' : 'Disabled & Hidden'}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
