import React, { useState } from 'react';
import { 
  X, Tag, Building2, Compass, Waves, Inbox, Settings, 
  Check, ExternalLink, Award, HelpCircle, MessageSquare, LogOut, UserCheck, Users, 
  CreditCard, Globe, Eye, Share2, Shield, AlertTriangle, Palette, Sparkles, PhoneCall
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useAuth } from '../../context/AuthContext';
import { FahadsLogo } from '../FahadsLogo';
import { HeroTab } from './tabs/HeroTab';
import { BrandTab } from './tabs/BrandTab';
import { InstructorTab } from './tabs/InstructorTab';
import { CaptainsTab } from './tabs/CaptainsTab';
import { CoursesTab } from './tabs/CoursesTab';
import { OffersTab } from './tabs/OffersTab';
import { ContactTab } from './tabs/ContactTab';
import { SocialAndTrustTab } from './tabs/SocialAndTrustTab';
import { SitesTab } from './tabs/SitesTab';
import { FaqsTab } from './tabs/FaqsTab';
import { TestimonialsTab } from './tabs/TestimonialsTab';
import { SectionsVisibilityTab } from './tabs/SectionsVisibilityTab';
import { PaymentTab } from './tabs/PaymentTab';
import { BookingsTab } from './tabs/BookingsTab';
import { DomainTab } from './tabs/DomainTab';
import { AdminsTab } from './tabs/AdminsTab';
import { SettingsTab } from './tabs/SettingsTab';
import { DEFAULT_LOCATION_CONFIG, DEFAULT_TRUST_BADGES } from '../../data/defaultConfig';

type AdminTab = 
  | 'hero' 
  | 'brand' 
  | 'instructor' 
  | 'captains' 
  | 'courses' 
  | 'offers' 
  | 'contact' 
  | 'social' 
  | 'sites' 
  | 'faqs' 
  | 'testimonials' 
  | 'sections' 
  | 'payment' 
  | 'bookings' 
  | 'domain' 
  | 'admins' 
  | 'settings';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  isStandalonePage?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  isOpen, 
  onClose, 
  isStandalonePage = false 
}) => {
  const { isRtl } = useLanguage();
  const { 
    config, 
    bookings, 
    updateBrand, 
    updateHero, 
    updateInstructor,
    updateFemaleInstructor,
    addCaptain,
    updateCaptain,
    deleteCaptain,
    updatePaymentConfig,
    updateAnnouncement, 
    updateCourse, 
    addCourse, 
    deleteCourse,
    updateDiveSite,
    addDiveSite,
    deleteDiveSite,
    updateFaqs,
    updateTestimonials,
    updateBookingStatus,
    deleteBooking,
    resetToDefaults,
    exportBackupJson,
    restorePreviousPrices,
    updateVisibleSections,
    updateSocialLinks,
    updateLocationConfig,
    updateTrustBadges,
    updateUnderConstruction,
    toggleUnderConstruction,
    updateDesignContent
  } = useSiteConfig();
  const { user, logout } = useAuth();

  const isUnderConstruction = (config.underConstruction?.enabled ?? true) && (config.visibleSections?.underConstructionBar !== false);

  const [activeTab, setActiveTab] = useState<AdminTab>('hero');
  const [saveToast, setSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  if (!isOpen) return null;

  const showToast = (customMsg?: string) => {
    setToastMessage(customMsg || (isRtl ? 'تم الحفظ وتطبيق التغييرات فورا!' : 'Saved & Applied Live!'));
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      setToastMessage('');
    }, 2500);
  };

  const newBookingsCount = bookings.filter(b => b.status === 'new').length;

  const content = (
    <div 
      className={
        isStandalonePage
          ? "w-full min-h-screen bg-slate-900 flex flex-col flex-1 text-slate-100"
          : "w-full max-w-6xl h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
      }
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Top Header */}
      <div className="px-4 sm:px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 sm:p-2 rounded-xl transition-all flex items-center justify-center shrink-0 ${
            config.brand.logoBg === 'dark'
              ? 'bg-slate-900 border border-slate-800'
              : 'bg-white border border-slate-200/90 shadow-md'
          }`}>
            <FahadsLogo size="sm" theme={config.brand.logoBg === 'dark' ? 'dark' : 'light'} showWordmark={false} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {isRtl ? 'لوحة تحكم وإدارة رواء الفن' : 'Riwa Alfan Control Center'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-semibold border border-blue-500/30">
                {isRtl ? 'بإشراف كابتن فهد 👑' : 'Capt. Fahad 👑'}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {isRtl ? 'تحكم كامل بنسبة 100% في الشعار، النصوص، العروض، الدورات، الأسعار، المواقع، والأسئلة الشائعة' : 'Full 100% control over brand, text, offers, courses, prices, sites, and FAQs'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {saveToast && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{toastMessage || (isRtl ? 'تم الحفظ وتطبيق التغييرات فورا!' : 'Saved & Applied Live!')}</span>
            </span>
          )}

          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-mono text-[11px]">{user.email}</span>
            </div>
          )}

          {/* Quick Toggle Under Construction Banner */}
          <button
            type="button"
            onClick={() => {
              toggleUnderConstruction();
              showToast(
                isUnderConstruction
                  ? (isRtl ? 'تم إخفاء وتعطيل شريط الموقع قيد الإنشاء' : 'Under construction banner hidden')
                  : (isRtl ? 'تم تفعيل وإظهار شريط الموقع قيد الإنشاء 🚧' : 'Under construction banner visible')
              );
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm ${
              isUnderConstruction
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title={isRtl ? 'تفعيل أو إخفاء شريط قيد الإنشاء أعلى الموقع' : 'Toggle Under Construction Banner'}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{isRtl ? 'قيد الإنشاء:' : 'In Dev:'}</span>
            <span>{isUnderConstruction ? (isRtl ? 'مفعّل 🟢' : 'ON 🟢') : (isRtl ? 'معطّل ⚪' : 'OFF ⚪')}</span>
          </button>

          {isStandalonePage && (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold transition-all cursor-pointer shadow-sm"
              title={isRtl ? 'الرجوع للموقع الرئيسي' : 'Return to Public Site'}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isRtl ? 'مشاهدة الموقع ↗' : 'Public Site ↗'}</span>
            </button>
          )}

          {/* Secure Firebase Logout Button */}
          <button
            onClick={async () => {
              await logout();
              onClose();
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950/80 hover:text-red-300 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            title={isRtl ? 'تسجيل الخروج وقفل اللوحة' : 'Sign Out & Lock'}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isRtl ? 'تسجيل الخروج' : 'Sign Out'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isRtl ? 'الرجوع للموقع' : 'Return to site'}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content Area: Sidebar Tabs + Panel */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-slate-950/60 border-b md:border-b-0 md:border-e border-slate-800 p-3 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0">
          {/* 1. Hero & Stats */}
          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'hero' 
                ? 'gold-gradient-btn text-slate-950 font-black shadow-lg shadow-[#C59B5F]/20' 
                : 'text-[#E0BA84] hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-[#C59B5F]/30'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0 text-[#C59B5F]" />
            <span>{isRtl ? 'الواجهة والأرقام ⚡' : 'Hero & Stats ⚡'}</span>
            <span className="w-2 h-2 rounded-full bg-[#C59B5F] ms-auto shrink-0 shadow-sm" />
          </button>

          {/* 2. Brand & Logo */}
          <button
            onClick={() => setActiveTab('brand')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'brand' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Palette className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'الهوية والشعار والخطوط 🎨' : 'Brand, Logo & Fonts 🎨'}</span>
          </button>

          {/* 3. Instructor, Ladies & Philosophy */}
          <button
            onClick={() => setActiveTab('instructor')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'instructor' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'الكباتن والتدريب والفلسفة 👑' : 'Captains & Philosophy 👑'}</span>
          </button>

          {/* 4. Team Captains */}
          <button
            onClick={() => setActiveTab('captains')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'captains' 
                ? 'gold-gradient-btn' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'طاقم الكباتن الإضافي 👥' : 'Additional Captains 👥'}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 ms-auto">
              {(config.captains || []).length}
            </span>
          </button>

          {/* 5. Courses & Pricing */}
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'courses' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'الدورات والأسعار 🤿' : 'Courses & Pricing 🤿'}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 ms-auto">
              {config.courses.length}
            </span>
          </button>

          {/* 6. Offers & Banners */}
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'offers' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Tag className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'العروض والتنبيهات 🏷️' : 'Offers & Banners 🏷️'}</span>
            {config.announcement.enabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 ms-auto shrink-0 animate-pulse" />
            )}
          </button>

          {/* 7. Contact & Booking CTA */}
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'contact' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <PhoneCall className="w-4 h-4 shrink-0 text-[#C59B5F]" />
            <span>{isRtl ? 'التواصل وبطاقة الحجز 📞' : 'Contact & CTA Card 📞'}</span>
          </button>

          {/* 8. Accreditations, Footer & Policies */}
          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'social' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0 text-[#C59B5F]" />
            <span>{isRtl ? 'الاعتمادات، الفوتر، والسياسات 🏛️' : 'Accreditations & Footer 🏛️'}</span>
          </button>

          {/* 9. Jeddah Dive Sites */}
          <button
            onClick={() => setActiveTab('sites')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sites' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Waves className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'مواقع وغوصات جدة 🌊' : 'Jeddah Dive Sites 🌊'}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 ms-auto">
              {config.diveSites.length}
            </span>
          </button>

          {/* 10. FAQs */}
          <button
            onClick={() => setActiveTab('faqs')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'faqs' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'الأسئلة الشائعة ❓' : 'FAQs ❓'}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 ms-auto">
              {(config.faqs || []).length}
            </span>
          </button>

          {/* 11. Testimonials */}
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'testimonials' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'آراء المتدربين ⭐' : 'Testimonials ⭐'}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 ms-auto">
              {(config.testimonials || []).length}
            </span>
          </button>

          {/* 12. Show/Hide Sections */}
          <button
            onClick={() => setActiveTab('sections')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sections' 
                ? 'gold-gradient-btn text-slate-950 font-black shadow-lg shadow-[#C59B5F]/20' 
                : 'text-[#E0BA84] hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-[#C59B5F]/30'
            }`}
          >
            <Eye className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'إخفاء وظهور الأقسام 👁️' : 'Show / Hide Sections 👁️'}</span>
          </button>

          {/* 13. Paymob Payments */}
          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'payment' 
                ? 'gold-gradient-btn' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'الدفع الإلكتروني (Paymob) 💳' : 'Paymob Payments 💳'}</span>
            {config.payment?.enabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 ms-auto shrink-0 shadow-sm shadow-emerald-400/50" />
            )}
          </button>

          {/* 14. Bookings Inbox */}
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'bookings' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Inbox className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'صندوق الحجوزات 📥' : 'Bookings Inbox 📥'}</span>
            {newBookingsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-mono font-bold ms-auto animate-pulse">
                {newBookingsCount}
              </span>
            )}
          </button>

          {/* 15. Custom Domain */}
          <button
            onClick={() => setActiveTab('domain')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'domain' 
                ? 'gold-gradient-btn' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'ربط الدومين (riwaalfan.com) 🌐' : 'Custom Domain 🌐'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 ms-auto shrink-0 shadow-sm" />
          </button>

          {/* 16. Admin Accounts & Users */}
          <button
            onClick={() => setActiveTab('admins')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'admins' 
                ? 'gold-gradient-btn text-slate-950 font-black shadow-lg shadow-[#C59B5F]/20' 
                : 'text-amber-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'إدارة المستخدمين والمدراء 👥' : 'Users & Admins Management 👥'}</span>
          </button>

          {/* 17. Settings & Backup */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'الإعدادات والنسخ ⚙️' : 'Settings & Backup ⚙️'}</span>
          </button>
        </div>

        {/* Tab Panel Body */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {activeTab === 'hero' && (
            <HeroTab
              initialHero={config.hero}
              onUpdateHero={updateHero}
              showToast={showToast}
            />
          )}

          {activeTab === 'brand' && (
            <BrandTab 
              initialBrand={config.brand}
              initialHero={config.hero}
              onUpdateBrand={updateBrand}
              onUpdateHero={updateHero}
              showToast={showToast}
              onNavigateToTrustTab={() => setActiveTab('social')}
            />
          )}

          {activeTab === 'instructor' && (
            <InstructorTab 
              initialInstructor={config.instructor}
              initialFemaleInstructor={config.femaleInstructor}
              initialDesign={config.designContent}
              onUpdateInstructor={updateInstructor}
              onUpdateFemaleInstructor={updateFemaleInstructor}
              onUpdateDesign={updateDesignContent}
              showToast={showToast}
            />
          )}

          {activeTab === 'captains' && (
            <CaptainsTab 
              captains={config.captains || []}
              onAddCaptain={addCaptain}
              onUpdateCaptain={updateCaptain}
              onDeleteCaptain={deleteCaptain}
              showToast={showToast}
            />
          )}

          {activeTab === 'courses' && (
            <CoursesTab 
              courses={config.courses}
              initialDesign={config.designContent}
              onUpdateCourse={updateCourse}
              onAddCourse={addCourse}
              onDeleteCourse={deleteCourse}
              onRestorePrices={restorePreviousPrices}
              onUpdateDesign={updateDesignContent}
              showToast={showToast}
            />
          )}

          {activeTab === 'offers' && (
            <OffersTab 
              initialConfig={config.announcement}
              initialUnderConstruction={config.underConstruction}
              onUpdate={updateAnnouncement}
              onUpdateUnderConstruction={updateUnderConstruction}
              showToast={showToast}
            />
          )}

          {activeTab === 'contact' && (
            <ContactTab
              initialDesign={config.designContent}
              initialBrand={config.brand}
              onUpdateDesign={updateDesignContent}
              onUpdateBrand={updateBrand}
              showToast={showToast}
            />
          )}

          {activeTab === 'social' && (
            <SocialAndTrustTab
              initialSocial={config.socialLinks}
              initialLocation={config.locationConfig}
              initialTrust={config.trustBadges}
              initialDesign={config.designContent}
              onUpdateSocial={updateSocialLinks}
              onUpdateLocation={updateLocationConfig}
              onUpdateTrust={updateTrustBadges}
              onUpdateDesign={updateDesignContent}
              showToast={showToast}
            />
          )}

          {activeTab === 'sites' && (
            <SitesTab 
              sites={config.diveSites}
              initialDesign={config.designContent}
              onAddSite={addDiveSite}
              onUpdateSite={updateDiveSite}
              onDeleteSite={deleteDiveSite}
              onUpdateDesign={updateDesignContent}
              showToast={showToast}
            />
          )}

          {activeTab === 'faqs' && (
            <FaqsTab 
              faqs={config.faqs}
              initialDesign={config.designContent}
              onUpdateFaqs={updateFaqs}
              onUpdateDesign={updateDesignContent}
              showToast={showToast}
            />
          )}

          {activeTab === 'testimonials' && (
            <TestimonialsTab 
              testimonials={config.testimonials}
              initialDesign={config.designContent}
              onUpdateTestimonials={updateTestimonials}
              onUpdateDesign={updateDesignContent}
              showToast={showToast}
            />
          )}

          {activeTab === 'sections' && (
            <SectionsVisibilityTab
              visibleSections={config.visibleSections}
              onUpdate={updateVisibleSections}
              showToast={showToast}
            />
          )}

          {activeTab === 'payment' && (
            <PaymentTab 
              initialPayment={config.payment}
              courses={config.courses}
              onUpdatePayment={updatePaymentConfig}
              onUpdateCourse={updateCourse}
              showToast={showToast}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsTab 
              bookings={bookings}
              onUpdateStatus={updateBookingStatus}
              onDeleteBooking={deleteBooking}
              showToast={showToast}
            />
          )}

          {activeTab === 'domain' && (
            <DomainTab 
              initialBrand={config.brand}
              onUpdateBrand={updateBrand}
              showToast={showToast}
            />
          )}

          {activeTab === 'admins' && (
            <AdminsTab 
              showToast={showToast} 
              courses={config.courses}
              bookings={bookings}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab 
              onExportBackupJson={exportBackupJson}
              onResetToDefaults={resetToDefaults}
              showToast={showToast}
            />
          )}
        </div>
      </div>
    </div>
  );

  if (isStandalonePage) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      {content}
    </div>
  );
};
