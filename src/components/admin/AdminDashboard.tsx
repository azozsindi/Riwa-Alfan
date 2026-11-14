import React, { useState } from 'react';
import { 
  X, Tag, Building2, Compass, Waves, Inbox, Settings, 
  Check, ExternalLink, Award, HelpCircle, MessageSquare, LogOut, UserCheck, Users, 
  Globe, Eye, Share2, Shield, AlertTriangle, Palette, Sparkles, PhoneCall,
  Menu, ChevronDown, Search
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
    updateBookingReview,
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
    updateDesignContent,
    firestoreQuotaExceeded
  } = useSiteConfig();
  const { user, logout } = useAuth();

  const isUnderConstruction = (config.underConstruction?.enabled ?? true) && (config.visibleSections?.underConstructionBar !== false);

  const [activeTab, setActiveTab] = useState<AdminTab>('admins');
  const [saveToast, setSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showMobileSectionsMenu, setShowMobileSectionsMenu] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');

  if (!isOpen) return null;

  const showToast = (customMsg?: string) => {
    setToastMessage(customMsg || (isRtl ? 'تم الحفظ وتطبيق التغييرات فورا!' : 'Saved & Applied Live!'));
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      setToastMessage('');
    }, 2500);
  };

  const newBookingsCount = bookings.filter(
    b => b.status === 'new' || b.eligibilityStatus === 'pending_instructor_review'
  ).length;

  const adminTabsList: {
    id: AdminTab;
    labelAr: string;
    labelEn: string;
    icon: string;
    category: 'users' | 'content' | 'pages' | 'settings';
    badge?: string | number;
  }[] = [
    { id: 'admins', labelAr: 'المستخدمين والمدراء', labelEn: 'Users & Admins', icon: '🛡️', category: 'users' },
    { id: 'bookings', labelAr: 'الحجوزات والطلبات', labelEn: 'Bookings Inbox', icon: '📥', category: 'users', badge: newBookingsCount > 0 ? newBookingsCount : undefined },
    { id: 'courses', labelAr: 'الدورات والأسعار', labelEn: 'Courses & Pricing', icon: '🤿', category: 'content', badge: config.courses.length },
    { id: 'hero', labelAr: 'الواجهة والأرقام', labelEn: 'Hero & Stats', icon: '⚡', category: 'content' },
    { id: 'brand', labelAr: 'الهوية والشعار والخطوط', labelEn: 'Brand & Logo', icon: '🎨', category: 'content' },
    { id: 'instructor', labelAr: 'الكباتن والتدريب', labelEn: 'Captains & Philosophy', icon: '👑', category: 'content' },
    { id: 'captains', labelAr: 'طاقم الكباتن', labelEn: 'Team Captains', icon: '👥', category: 'content', badge: (config.captains || []).length },
    { id: 'offers', labelAr: 'العروض والتنبيهات', labelEn: 'Offers & Banners', icon: '🏷️', category: 'content' },
    { id: 'contact', labelAr: 'التواصل وبطاقة الحجز', labelEn: 'Contact & CTA', icon: '📞', category: 'content' },
    { id: 'sites', labelAr: 'مواقع وغوصات جدة', labelEn: 'Jeddah Dive Sites', icon: '🌊', category: 'pages', badge: config.diveSites.length },
    { id: 'faqs', labelAr: 'الأسئلة الشائعة', labelEn: 'FAQs', icon: '❓', category: 'pages', badge: (config.faqs || []).length },
    { id: 'testimonials', labelAr: 'آراء المتدربين', labelEn: 'Testimonials', icon: '⭐', category: 'pages', badge: (config.testimonials || []).length },
    { id: 'social', labelAr: 'الاعتمادات والفوتر', labelEn: 'Footer & Policies', icon: '🏛️', category: 'pages' },
    { id: 'sections', labelAr: 'إخفاء وظهور الأقسام', labelEn: 'Show/Hide Sections', icon: '👁️', category: 'settings' },
    { id: 'domain', labelAr: 'ربط الدومين', labelEn: 'Custom Domain', icon: '🌐', category: 'settings' },
    { id: 'settings', labelAr: 'الإعدادات والنسخ', labelEn: 'Settings & Backup', icon: '⚙️', category: 'settings' },
  ];

  const currentTabObj = adminTabsList.find(t => t.id === activeTab) || adminTabsList[0];

  const filteredMobileTabs = adminTabsList.filter(t => {
    if (!mobileSearchQuery.trim()) return true;
    const q = mobileSearchQuery.toLowerCase();
    return t.labelAr.toLowerCase().includes(q) || t.labelEn.toLowerCase().includes(q);
  });

  const content = (
    <div 
      className={
        isStandalonePage
          ? "w-full min-h-screen bg-slate-900 flex flex-col flex-1 text-slate-100"
          : "w-full h-full md:h-[92vh] md:max-w-6xl bg-slate-900 border-0 md:border md:border-slate-800 rounded-none md:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
      }
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Top Header */}
      <div className="px-3 sm:px-6 py-2.5 sm:py-3.5 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className={`p-1.5 rounded-xl transition-all flex items-center justify-center shrink-0 ${
            config.brand.logoBg === 'dark'
              ? 'bg-slate-900 border border-slate-800'
              : 'bg-white border border-slate-200/90 shadow-md'
          }`}>
            <FahadsLogo size="sm" theme={config.brand.logoBg === 'dark' ? 'dark' : 'light'} showWordmark={false} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-xs sm:text-base font-bold text-white tracking-tight truncate">
                {isRtl ? 'لوحة تحكم رواء الفن' : 'Riwa Alfan Control'}
              </h2>
              <span className="hidden xs:inline-block px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] sm:text-xs font-mono font-semibold border border-blue-500/30">
                {isRtl ? 'كابتن فهد 👑' : 'Capt. Fahad 👑'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block truncate">
              {isRtl ? 'تحكم كامل بنسبة 100% في الشعار، النصوص، العروض، الدورات، الأسعار، والمستخدمين' : 'Full 100% control over brand, text, offers, courses, prices, and users'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {saveToast && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] sm:text-[11px] font-semibold animate-in fade-in">
              <Check className="w-3 h-3" />
              <span className="hidden sm:inline">{toastMessage || (isRtl ? 'تم الحفظ!' : 'Saved!')}</span>
            </span>
          )}

          {/* Quick Toggle Under Construction Banner (Desktop & Tablet) */}
          <button
            type="button"
            onClick={() => {
              toggleUnderConstruction();
              showToast(
                isUnderConstruction
                  ? (isRtl ? 'تم إخفاء شريط قيد الإنشاء' : 'Banner hidden')
                  : (isRtl ? 'تم تفعيل شريط قيد الإنشاء 🚧' : 'Banner visible')
              );
            }}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm ${
              isUnderConstruction
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title={isRtl ? 'تفعيل أو إخفاء شريط قيد الإنشاء أعلى الموقع' : 'Toggle Under Construction Banner'}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>{isUnderConstruction ? (isRtl ? 'مفعّل 🟢' : 'ON 🟢') : (isRtl ? 'معطّل ⚪' : 'OFF ⚪')}</span>
          </button>

          {isStandalonePage && (
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold transition-all cursor-pointer shadow-sm"
              title={isRtl ? 'مشاهدة الموقع الرئيسي' : 'Public Site'}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isRtl ? 'الموقع ↗' : 'Site ↗'}</span>
            </button>
          )}

          {/* Secure Firebase Logout Button */}
          <button
            onClick={async () => {
              await logout();
              onClose();
            }}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-red-950/80 hover:text-red-300 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
            title={isRtl ? 'تسجيل الخروج' : 'Sign Out'}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isRtl ? 'خروج' : 'Exit'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isRtl ? 'الرجوع للموقع' : 'Return to site'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {firestoreQuotaExceeded && (
        <div className="bg-amber-950/70 border-b border-amber-500/40 px-4 py-2.5 text-xs text-amber-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {isRtl
                ? 'تنبيه السحابة: تم استنفاد الحصة اليومية المجانية للكتابة في Firestore لهذا اليوم (تتجدد تلقائياً غداً). يتم حفظ تعديلاتك حالياً محلياً دون فقدان.'
                : 'Cloud Notice: Free daily Firestore write quota reached for today (resets automatically tomorrow). Changes are safely preserved locally.'}
            </span>
          </div>
          <a
            href="https://firebase.google.com/pricing#cloud-firestore"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-300 hover:text-white underline font-bold shrink-0"
          >
            {isRtl ? 'تفاصيل الحصة' : 'Quota Info'}
          </a>
        </div>
      )}

      {/* Modern Responsive Mobile Navigation Bar */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 sticky top-0 z-20 backdrop-blur-md">
        {/* Row 1: Active Section Button + Drawer Opener */}
        <div className="px-3 py-2 flex items-center justify-between gap-2 border-b border-slate-900">
          <button
            type="button"
            onClick={() => setShowMobileSectionsMenu(true)}
            className="flex-1 flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-xs font-bold text-white transition-all cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-sm">{currentTabObj.icon}</span>
              <span className="text-[#E0BA84] font-bold truncate">
                {isRtl ? currentTabObj.labelAr : currentTabObj.labelEn}
              </span>
              {currentTabObj.badge && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-mono font-black">
                  {currentTabObj.badge}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-cyan-400 shrink-0">
              <span>{isRtl ? 'تغيير (17)' : 'All (17)'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Quick under construction toggle on mobile */}
          <button
            type="button"
            onClick={() => {
              toggleUnderConstruction();
              showToast(
                isUnderConstruction
                  ? (isRtl ? 'تم إخفاء شريط قيد الإنشاء' : 'Banner hidden')
                  : (isRtl ? 'تم تفعيل شريط قيد الإنشاء 🚧' : 'Banner visible')
              );
            }}
            className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer shrink-0 ${
              isUnderConstruction
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title={isRtl ? 'شريط قيد الإنشاء' : 'Under Construction Banner'}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>

        {/* Row 2: Smooth Horizontal Scrollable Chips of Key Sections */}
        <div className="px-2 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          {adminTabsList.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'gold-gradient-btn text-slate-950 font-black shadow-md shadow-[#C59B5F]/20'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{isRtl ? tab.labelAr : tab.labelEn}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
                    isActive ? 'bg-slate-950 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Full Sections Drawer / Modal */}
      {showMobileSectionsMenu && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-slate-950 border-t border-slate-800 rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">📂</span>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isRtl ? 'أقسام لوحة التحكم الشاملة' : 'Control Panel Sections'}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {isRtl ? 'اختر القسم للتحكم المباشر في بياناته' : 'Select a section to manage'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMobileSectionsMenu(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="p-3 border-b border-slate-900">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  placeholder={isRtl ? 'بحث في الأقسام...' : 'Search sections...'}
                  className="w-full ps-9 pe-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Categorized List */}
            <div className="p-3 overflow-y-auto space-y-3 flex-1">
              {filteredMobileTabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowMobileSectionsMenu(false);
                      setMobileSearchQuery('');
                    }}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between gap-3 text-start transition-all cursor-pointer ${
                      isActive
                        ? 'gold-gradient-btn text-slate-950 font-black shadow-lg shadow-[#C59B5F]/20'
                        : 'bg-slate-900/80 hover:bg-slate-900 text-slate-200 border border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl shrink-0">{tab.icon}</span>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${isActive ? 'text-slate-950' : 'text-white'}`}>
                          {isRtl ? tab.labelAr : tab.labelEn}
                        </p>
                        <p className={`text-[10px] truncate ${isActive ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                          {isRtl ? tab.labelEn : tab.labelAr}
                        </p>
                      </div>
                    </div>

                    {tab.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold shrink-0 ${
                        isActive ? 'bg-slate-950 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-3 border-t border-slate-900 bg-slate-950/80 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isRtl ? 'الرجوع للموقع' : 'Public Site'}</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  onClose();
                }}
                className="py-2 px-4 rounded-xl bg-red-950/40 text-red-300 hover:text-red-100 border border-red-500/30 text-xs font-bold flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isRtl ? 'خروج' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area: Sidebar Tabs + Panel */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Tabs (Desktop vertical sidebar) */}
        <div className="hidden md:flex md:w-64 bg-slate-950/60 border-e border-slate-800 p-3 flex-col gap-1.5 overflow-y-auto shrink-0">
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
                ? 'gold-gradient-btn text-slate-950 font-black shadow-lg shadow-[#C59B5F]/20' 
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

        {/* Tab Panel Body (Enhanced responsive mobile padding) */}
        <div className="flex-1 p-2.5 sm:p-6 lg:p-8 overflow-y-auto">
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

          {activeTab === 'bookings' && (
            <BookingsTab 
              bookings={bookings}
              onUpdateStatus={updateBookingStatus}
              onUpdateReview={updateBookingReview}
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
