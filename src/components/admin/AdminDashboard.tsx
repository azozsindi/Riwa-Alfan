import React, { useState } from 'react';
import { 
  X, Tag, Building2, Compass, Waves, Inbox, Settings, 
  Check, ExternalLink, Award, HelpCircle, MessageSquare, LogOut, UserCheck, Users, CreditCard, Globe
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { OffersTab } from './tabs/OffersTab';
import { BrandTab } from './tabs/BrandTab';
import { DomainTab } from './tabs/DomainTab';
import { CaptainsTab } from './tabs/CaptainsTab';
import { PaymentTab } from './tabs/PaymentTab';
import { InstructorTab } from './tabs/InstructorTab';
import { CoursesTab } from './tabs/CoursesTab';
import { SitesTab } from './tabs/SitesTab';
import { FaqsTab } from './tabs/FaqsTab';
import { TestimonialsTab } from './tabs/TestimonialsTab';
import { BookingsTab } from './tabs/BookingsTab';
import { SettingsTab } from './tabs/SettingsTab';

type AdminTab = 'offers' | 'brand' | 'domain' | 'captains' | 'instructor' | 'courses' | 'payment' | 'sites' | 'faqs' | 'testimonials' | 'bookings' | 'settings';

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
    updateAdminPin,
    restorePreviousPrices
  } = useSiteConfig();

  const [activeTab, setActiveTab] = useState<AdminTab>('offers');
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
          <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Compass className="w-6 h-6" />
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

          {/* Lock / Logout Button */}
          <button
            onClick={() => {
              try {
                localStorage.removeItem('riwa_alfan_admin_auth');
              } catch (e) {}
              onClose();
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950/80 hover:text-red-300 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            title={isRtl ? 'قفل لوحة التحكم وتسجيل الخروج' : 'Lock & Logout'}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isRtl ? 'قفل اللوحة' : 'Lock'}</span>
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
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'offers' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Tag className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'العروض والشريط الإعلاني' : 'Offers & Banner'}</span>
            {config.announcement.enabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 ms-auto shrink-0 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('brand')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'brand' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'الهوية والشعار ومقر جدة' : 'Brand & Logo'}</span>
          </button>

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

          <button
            onClick={() => setActiveTab('captains')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'captains' 
                ? 'gold-gradient-btn' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'كباتن ومدربو المركز 👑' : 'Captains & Team 👑'}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 ms-auto">
              {(config.captains || []).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('instructor')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'instructor' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'المدربون والتدريب النسائي 👑' : 'Instructors & Ladies 👑'}</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'courses' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'الدورات والأسعار' : 'Courses & Pricing'}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 ms-auto">
              {config.courses.length}
            </span>
          </button>

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

          <button
            onClick={() => setActiveTab('sites')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sites' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Waves className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'مواقع وغوصات جدة' : 'Jeddah Dive Sites'}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 ms-auto">
              {config.diveSites.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'faqs' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'الأسئلة الشائعة (FAQ)' : 'FAQs'}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 ms-auto">
              {(config.faqs || []).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'testimonials' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'آراء وتجارب المتدربين' : 'Reviews & Testimonials'}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 ms-auto">
              {(config.testimonials || []).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'bookings' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Inbox className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'صندوق الحجوزات' : 'Bookings Inbox'}</span>
            {newBookingsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-mono font-bold ms-auto animate-pulse">
                {newBookingsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'الإعدادات والنسخ' : 'Settings & Backup'}</span>
          </button>
        </div>

        {/* Tab Panel Body */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {activeTab === 'offers' && (
            <OffersTab 
              initialConfig={config.announcement}
              onUpdate={updateAnnouncement}
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
            />
          )}

          {activeTab === 'domain' && (
            <DomainTab 
              initialBrand={config.brand}
              onUpdateBrand={updateBrand}
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

          {activeTab === 'instructor' && (
            <InstructorTab 
              initialInstructor={config.instructor}
              initialFemaleInstructor={config.femaleInstructor}
              onUpdateInstructor={updateInstructor}
              onUpdateFemaleInstructor={updateFemaleInstructor}
              showToast={showToast}
            />
          )}

          {activeTab === 'courses' && (
            <CoursesTab 
              courses={config.courses}
              onUpdateCourse={updateCourse}
              onAddCourse={addCourse}
              onDeleteCourse={deleteCourse}
              onRestorePrices={restorePreviousPrices}
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

          {activeTab === 'sites' && (
            <SitesTab 
              sites={config.diveSites}
              onAddSite={addDiveSite}
              onUpdateSite={updateDiveSite}
              onDeleteSite={deleteDiveSite}
              showToast={showToast}
            />
          )}

          {activeTab === 'faqs' && (
            <FaqsTab 
              faqs={config.faqs}
              onUpdateFaqs={updateFaqs}
              showToast={showToast}
            />
          )}

          {activeTab === 'testimonials' && (
            <TestimonialsTab 
              testimonials={config.testimonials}
              onUpdateTestimonials={updateTestimonials}
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

          {activeTab === 'settings' && (
            <SettingsTab 
              onUpdateAdminPin={updateAdminPin}
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
