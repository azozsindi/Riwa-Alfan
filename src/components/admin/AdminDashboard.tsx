import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Tag, Building2, Compass, Waves, Inbox, Settings, 
  Check, ExternalLink, Award, HelpCircle, MessageSquare, LogOut, UserCheck, Users, 
  Globe, Eye, Share2, Shield, AlertTriangle, Palette, Sparkles, PhoneCall,
  Menu, ChevronDown, Search, Bell, BellRing, Volume2, VolumeX, WifiOff, CheckCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useAuth } from '../../context/AuthContext';
import { FahadsLogo } from '../FahadsLogo';
import { PWAInstallButton } from './PWAInstallButton';
import { useBookingNotifications } from '../../hooks/useBookingNotifications';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { usePWAInstall } from '../../hooks/usePWAInstall';
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
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const notifPanelRef = useRef<HTMLDivElement>(null);

  const isOnline = useOnlineStatus();
  const { isIOS, isInstalled } = usePWAInstall();
  const {
    permission,
    soundEnabled,
    notifications,
    unreadCount,
    latestAlert,
    requestPermission,
    toggleSound,
    markAsRead,
    markAllAsRead,
    dismissAlert,
    sendTestNotification,
  } = useBookingNotifications(bookings, isRtl);

  useEffect(() => {
    if (!showNotifPanel) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (notifPanelRef.current && !notifPanelRef.current.contains(e.target as Node)) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showNotifPanel]);

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
          ? "w-full min-h-screen bg-slate-900 flex flex-col flex-1 text-slate-100 overflow-x-hidden"
          : "w-full h-full lg:h-[92vh] lg:max-w-7xl bg-slate-900 border-0 lg:border lg:border-slate-800 rounded-none lg:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
      }
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Single Sticky Top Header (Mobile, Tablet & PC) */}
      <header className="px-3 sm:px-5 lg:px-6 py-2.5 sm:py-3 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile & Tablet Drawer Trigger (< lg) */}
          <button
            type="button"
            onClick={() => setShowMobileSectionsMenu(true)}
            className="lg:hidden min-h-[40px] min-w-[40px] px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
            aria-label={isRtl ? 'فتح قائمة الأقسام' : 'Open sections menu'}
            title={isRtl ? 'أقسام لوحة التحكم' : 'Dashboard Sections'}
          >
            <Menu className="w-4 h-4 text-[#E0BA84]" />
            <span className="hidden sm:inline text-xs font-bold text-[#E0BA84]">
              {isRtl ? `الأقسام (${adminTabsList.length})` : `Menu (${adminTabsList.length})`}
            </span>
          </button>

          <div className={`p-1.5 rounded-xl transition-all flex items-center justify-center shrink-0 ${
            config.brand.logoBg === 'dark'
              ? 'bg-slate-900 border border-slate-800'
              : 'bg-white border border-slate-200/90 shadow-md'
          }`}>
            <FahadsLogo size="sm" theme={config.brand.logoBg === 'dark' ? 'dark' : 'light'} showWordmark={false} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-xs sm:text-sm lg:text-base font-bold text-white tracking-tight truncate">
                {isRtl ? 'لوحة تحكم رواء الفن' : 'Riwa Alfan Control'}
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] sm:text-xs font-mono font-semibold border border-blue-500/30 shrink-0">
                {isRtl ? 'كابتن فهد 👑' : 'Capt. Fahad 👑'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden lg:block truncate">
              {isRtl ? 'تحكم كامل بنسبة 100% في الشعار، النصوص، العروض، الدورات، الأسعار، والمستخدمين' : 'Full 100% control over brand, text, offers, courses, prices, and users'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {saveToast && (
            <span className="inline-flex items-center gap-1 px-2 py-1 sm:px-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] sm:text-[11px] font-semibold animate-in fade-in">
              <Check className="w-3 h-3 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">{toastMessage || (isRtl ? 'تم الحفظ!' : 'Saved!')}</span>
            </span>
          )}

          {/* Live Booking Notification Bell & Center */}
          <div className="relative" ref={notifPanelRef}>
            <button
              type="button"
              onClick={() => setShowNotifPanel((prev) => !prev)}
              className={`relative min-h-[40px] min-w-[40px] sm:min-h-[36px] sm:min-w-[36px] px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0 ${
                unreadCount > 0
                  ? 'bg-red-500/15 text-red-300 border-red-500/40 hover:bg-red-500/25'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
              title={isRtl ? 'إشعارات الحجوزات الفورية' : 'Booking Notifications'}
              aria-label={isRtl ? 'إشعارات الحجوزات' : 'Booking Notifications'}
            >
              {unreadCount > 0 ? (
                <BellRing className="w-4 h-4 text-red-400 animate-pulse shrink-0" />
              ) : (
                <Bell className="w-4 h-4 text-[#E0BA84] shrink-0" />
              )}
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-mono font-black leading-tight">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifPanel && (
              <div
                className={`fixed sm:absolute inset-x-3 sm:inset-x-auto top-16 sm:top-full sm:mt-2 sm:w-96 z-50 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl shadow-black/70 overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
                  isRtl ? 'sm:left-0' : 'sm:right-0'
                }`}
              >
                {/* Header */}
                <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <BellRing className="w-4 h-4 text-[#E0BA84] shrink-0" />
                    <span className="text-xs sm:text-sm font-extrabold text-white truncate">
                      {isRtl ? 'إشعارات الحجوزات الفورية' : 'Booking Notifications'}
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-mono font-black">
                        {unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={toggleSound}
                      className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        soundEnabled
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                      title={
                        soundEnabled
                          ? isRtl ? 'كتم نغمة الإشعارات' : 'Mute Alert Sound'
                          : isRtl ? 'تفعيل نغمة الإشعارات' : 'Enable Alert Sound'
                      }
                    >
                      {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowNotifPanel(false)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Device Notification Permission & Test Controls */}
                <div className="p-3 bg-slate-900/50 border-b border-slate-800/80 space-y-2">
                  {permission === 'default' && (
                    <button
                      type="button"
                      onClick={() => requestPermission()}
                      className="w-full min-h-[38px] px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md shadow-blue-600/20"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>
                        {isRtl ? 'تفعيل إشعارات الجهاز والمتصفح الآن' : 'Enable Device Notifications'}
                      </span>
                    </button>
                  )}

                  {permission === 'granted' && (
                    <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-[11px] text-emerald-300 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{isRtl ? 'إشعارات الجهاز مفعّلة ونشطة' : 'Device Alerts Active'}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">ON</span>
                    </div>
                  )}

                  {permission === 'denied' && (
                    <div className="px-3 py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-[11px] text-red-200 leading-relaxed">
                      {isRtl
                        ? 'الإشعارات محظورة من إعدادات المتصفح. اسمح بالإشعارات من أيقونة القفل بجانب رابط الموقع لاستقبالها.'
                        : 'Notifications are blocked in browser settings. Allow notifications from site permissions to receive device alerts.'}
                    </div>
                  )}

                  {isIOS && !isInstalled && (
                    <div className="px-3 py-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200 leading-relaxed">
                      {isRtl
                        ? 'ملاحظة للآيفون: أضف اللوحة للشاشة الرئيسية أولاً عبر زر المشاركة (Share) في Safari لتعمل تنبيهات الجهاز.'
                        : 'iPhone tip: Add this dashboard to Home Screen from Safari Share menu to receive iOS push alerts.'}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => sendTestNotification()}
                      className="flex-1 min-h-[36px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <BellRing className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'إرسال إشعار تجريبي' : 'Send Test Alert'}</span>
                    </button>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={() => markAllAsRead()}
                        className="min-h-[36px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                        title={isRtl ? 'تحديد الكل كمقروء' : 'Mark all read'}
                      >
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isRtl ? 'قرأت الكل' : 'Mark Read'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Notification List */}
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/70">
                  {notifications.length === 0 ? (
                    <div className="py-8 px-4 text-center text-xs text-slate-500 space-y-1">
                      <Bell className="w-7 h-7 mx-auto text-slate-700" />
                      <p className="font-semibold text-slate-400">
                        {isRtl ? 'لا توجد حجوزات جديدة غير مقروءة' : 'No unread booking alerts'}
                      </p>
                      <p className="text-[11px]">
                        {isRtl
                          ? 'جرّب الضغط على "إرسال إشعار تجريبي" لمعاينة التنبيه الفوري قبل تسليم اللوحة.'
                          : 'Click "Send Test Alert" above to preview instant notifications.'}
                      </p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          markAsRead(n.id);
                          setShowNotifPanel(false);
                          if (!n.isTest) {
                            setActiveTab('bookings');
                          }
                        }}
                        className={`w-full text-start px-4 py-3 flex items-start justify-between gap-2.5 transition-colors cursor-pointer ${
                          n.read
                            ? 'bg-slate-950 hover:bg-slate-900/70 opacity-75'
                            : 'bg-blue-950/25 hover:bg-blue-950/40'
                        }`}
                      >
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center gap-2">
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse" />
                            )}
                            <span className="text-xs font-bold text-white truncate">
                              {n.name}
                            </span>
                            {n.isTest && (
                              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">
                                {isRtl ? 'تجريبي' : 'TEST'}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-cyan-300 truncate">{n.interest}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                            <span dir="ltr">{n.phone}</span>
                            <span>•</span>
                            <span>
                              {new Date(n.createdAt).toLocaleTimeString(isRtl ? 'ar-SA' : 'en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Install PWA to Home Screen Button */}
          <PWAInstallButton isRtl={isRtl} variant="header" />

          {/* Quick Toggle Under Construction Banner */}
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
            className={`min-h-[40px] sm:min-h-[36px] flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0 ${
              isUnderConstruction
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title={isRtl ? 'تفعيل أو إخفاء شريط قيد الإنشاء أعلى الموقع' : 'Toggle Under Construction Banner'}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden md:inline whitespace-nowrap">
              {isUnderConstruction ? (isRtl ? 'قيد الإنشاء 🟢' : 'ON 🟢') : (isRtl ? 'معطّل ⚪' : 'OFF ⚪')}
            </span>
          </button>

          {isStandalonePage && (
            <button
              onClick={onClose}
              className="min-h-[40px] sm:min-h-[36px] flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0"
              title={isRtl ? 'مشاهدة الموقع الرئيسي' : 'Public Site'}
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline whitespace-nowrap">{isRtl ? 'الموقع' : 'Site'}</span>
            </button>
          )}

          {/* Secure Firebase Logout Button */}
          <button
            onClick={async () => {
              await logout();
              onClose();
            }}
            className="min-h-[40px] sm:min-h-[36px] px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-red-950/80 hover:text-red-300 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
            title={isRtl ? 'تسجيل الخروج' : 'Sign Out'}
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden lg:inline whitespace-nowrap">{isRtl ? 'خروج' : 'Exit'}</span>
          </button>

          <button
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] sm:min-h-[36px] sm:min-w-[36px] p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
            title={isRtl ? 'الرجوع للموقع' : 'Return to site'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Offline Status Banner */}
      {!isOnline && (
        <div className="bg-amber-950/85 border-b border-amber-500/40 px-3 sm:px-6 py-2 text-xs text-amber-200 flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {isRtl
              ? 'لا يوجد اتصال بالإنترنت حالياً — يتم عرض البيانات المخزنة مؤقتاً حتى عودة الاتصال.'
              : 'Offline mode — showing cached data until connection returns.'}
          </span>
        </div>
      )}

      {/* Live Incoming Booking Alert Banner */}
      {latestAlert && (
        <div className="bg-gradient-to-r from-emerald-950/90 via-blue-950/90 to-slate-900 border-b border-emerald-500/40 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <BellRing className="w-4 h-4 text-emerald-300 animate-bounce" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-white truncate">
                {isRtl ? `حجز جديد وارد: ${latestAlert.name}` : `New Incoming Booking: ${latestAlert.name}`}
              </p>
              <p className="text-[11px] text-emerald-200 truncate">
                {latestAlert.interest} · <span dir="ltr" className="font-mono">{latestAlert.phone}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!latestAlert.isTest && (
              <button
                type="button"
                onClick={() => {
                  markAsRead(latestAlert.id);
                  dismissAlert();
                  setActiveTab('bookings');
                }}
                className="min-h-[34px] px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                {isRtl ? 'عرض في الحجوزات' : 'View in Bookings'}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                markAsRead(latestAlert.id);
                dismissAlert();
              }}
              className="min-h-[34px] min-w-[34px] p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              title={isRtl ? 'إغلاق التنبيه' : 'Dismiss'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {firestoreQuotaExceeded && (
        <div className="bg-amber-950/70 border-b border-amber-500/40 px-3 sm:px-6 py-2.5 text-xs text-amber-200 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="leading-relaxed">
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

      {/* Mobile & Tablet Quick Navigation Strip (< lg, non-sticky so it never overlaps the header) */}
      <div className="lg:hidden bg-slate-950/95 border-b border-slate-800 shrink-0">
        {/* Row 1: Current Active Section Selector Bar */}
        <div className="px-3 sm:px-5 py-2 flex items-center justify-between gap-2 border-b border-slate-900">
          <button
            type="button"
            onClick={() => setShowMobileSectionsMenu(true)}
            className="flex-1 min-h-[42px] flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs sm:text-sm font-bold text-white transition-all cursor-pointer shadow-sm min-w-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm shrink-0">{currentTabObj.icon}</span>
              <span className="text-[#E0BA84] font-bold truncate">
                {isRtl ? currentTabObj.labelAr : currentTabObj.labelEn}
              </span>
              {currentTabObj.badge !== undefined && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-mono font-black shrink-0">
                  {currentTabObj.badge}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-cyan-400 shrink-0">
              <span>{isRtl ? `عرض الكل (${adminTabsList.length})` : `All (${adminTabsList.length})`}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        {/* Row 2: Smooth Horizontal Scrollable Quick-Jump Chips */}
        <div className="px-3 sm:px-5 py-2 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {adminTabsList.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'gold-gradient-btn text-slate-950 font-black shadow-md shadow-[#C59B5F]/20'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{isRtl ? tab.labelAr : tab.labelEn}</span>
                {tab.badge !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
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

      {/* Mobile & Tablet Full Sections Drawer / Sheet (< lg) */}
      {showMobileSectionsMenu && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end sm:justify-center sm:items-center sm:p-4 animate-in fade-in duration-200"
          onClick={() => setShowMobileSectionsMenu(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-950 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[86dvh] flex flex-col shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-lg shrink-0">📂</span>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">
                    {isRtl ? 'أقسام لوحة التحكم الشاملة' : 'Control Panel Sections'}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate">
                    {isRtl ? 'اختر القسم للتحكم المباشر في بياناته' : 'Select a section to manage'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMobileSectionsMenu(false)}
                className="min-h-[40px] min-w-[40px] p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 flex items-center justify-center shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="p-3 sm:p-4 border-b border-slate-900">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  placeholder={isRtl ? 'بحث في الأقسام...' : 'Search sections...'}
                  className="w-full min-h-[42px] ps-9 pe-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Responsive 1-col (mobile) / 2-col (tablet) Grid */}
            <div className="p-3 sm:p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1">
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
                    className={`w-full min-h-[54px] p-3 rounded-2xl flex items-center justify-between gap-3 text-start transition-all cursor-pointer ${
                      isActive
                        ? 'gold-gradient-btn text-slate-950 font-black shadow-lg shadow-[#C59B5F]/20'
                        : 'bg-slate-900/80 hover:bg-slate-900 text-slate-200 border border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl shrink-0">{tab.icon}</span>
                      <div className="min-w-0">
                        <p className={`text-xs sm:text-sm font-bold truncate ${isActive ? 'text-slate-950' : 'text-white'}`}>
                          {isRtl ? tab.labelAr : tab.labelEn}
                        </p>
                        <p className={`text-[10px] truncate ${isActive ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                          {isRtl ? tab.labelEn : tab.labelAr}
                        </p>
                      </div>
                    </div>

                    {tab.badge !== undefined && (
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
            <div className="p-3 sm:p-4 border-t border-slate-900 bg-slate-950/80 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-h-[42px] py-2 px-3 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
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
                className="min-h-[42px] py-2 px-4 rounded-xl bg-red-950/40 text-red-300 hover:text-red-100 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isRtl ? 'خروج' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area: Desktop Sidebar (lg+) + Panel */}
      <div className="flex-1 flex flex-col lg:flex-row min-w-0 overflow-hidden">
        {/* Sidebar Tabs (Desktop 1024px+ vertical sidebar) */}
        <aside className="hidden lg:flex lg:w-64 xl:w-72 bg-slate-950/70 border-e border-slate-800 p-3 flex-col gap-1.5 overflow-y-auto shrink-0">
          {/* 1. Hero & Stats */}
          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-start ${
              activeTab === 'hero' 
                ? 'gold-gradient-btn text-slate-950 font-black shadow-lg shadow-[#C59B5F]/20' 
                : 'text-[#E0BA84] hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-[#C59B5F]/30'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0 text-[#C59B5F]" />
            <span className="truncate flex-1">{isRtl ? 'الواجهة والأرقام ⚡' : 'Hero & Stats ⚡'}</span>
            <span className="w-2 h-2 rounded-full bg-[#C59B5F] shrink-0 shadow-sm" />
          </button>

          {/* 2. Brand & Logo */}
          <button
            onClick={() => setActiveTab('brand')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-start ${
              activeTab === 'brand' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Palette className="w-4 h-4 shrink-0" />
            <span className="truncate flex-1">{isRtl ? 'الهوية والشعار والخطوط 🎨' : 'Brand, Logo & Fonts 🎨'}</span>
          </button>

          {/* 3. Instructor, Ladies & Philosophy */}
          <button
            onClick={() => setActiveTab('instructor')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-start ${
              activeTab === 'instructor' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-4 h-4 shrink-0" />
            <span className="truncate flex-1">{isRtl ? 'الكباتن والتدريب والفلسفة 👑' : 'Captains & Philosophy 👑'}</span>
          </button>

          {/* 4. Team Captains */}
          <button
            onClick={() => setActiveTab('captains')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-start ${
              activeTab === 'captains' 
                ? 'gold-gradient-btn text-slate-950 font-black shadow-lg shadow-[#C59B5F]/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className="truncate flex-1">{isRtl ? 'طاقم الكباتن الإضافي 👥' : 'Additional Captains 👥'}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300 shrink-0">
              {(config.captains || []).length}
            </span>
          </button>

          {/* 5. Courses & Pricing */}
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-start ${
              activeTab === 'courses' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-4 h-4 shrink-0" />
            <span className="truncate flex-1">{isRtl ? 'الدورات والأسعار 🤿' : 'Courses & Pricing 🤿'}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300 shrink-0">
              {config.courses.length}
            </span>
          </button>

          {/* 6. Offers & Banners */}
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-start ${
              activeTab === 'offers' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Tag className="w-4 h-4 shrink-0" />
            <span className="truncate flex-1">{isRtl ? 'العروض والتنبيهات 🏷️' : 'Offers & Banners 🏷️'}</span>
            {config.announcement.enabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
            )}
          </button>

          {/* 7. Contact & Booking CTA */}
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-start ${
              activeTab === 'contact' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <PhoneCall className="w-4 h-4 shrink-0 text-[#C59B5F]" />
            <span className="truncate flex-1">{isRtl ? 'التواصل وبطاقة الحجز 📞' : 'Contact & CTA Card 📞'}</span>
          </button>

          {/* 8. Accreditations, Footer & Policies */}
          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-start ${
              activeTab === 'social' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0 text-[#C59B5F]" />
            <span className="truncate flex-1">{isRtl ? 'الاعتمادات، الفوتر، والسياسات 🏛️' : 'Accreditations & Footer 🏛️'}</span>
          </button>

          {/* 9. Jeddah Dive Sites */}
          <button
            onClick={() => setActiveTab('sites')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-start ${
              activeTab === 'sites' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Waves className="w-4 h-4 shrink-0" />
            <span className="truncate flex-1">{isRtl ? 'مواقع وغوصات جدة 🌊' : 'Jeddah Dive Sites 🌊'}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300 shrink-0">
              {config.diveSites.length}
            </span>
          </button>

          {/* 10. FAQs */}
          <button
            onClick={() => setActiveTab('faqs')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-start ${
              activeTab === 'faqs' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span className="truncate flex-1">{isRtl ? 'الأسئلة الشائعة ❓' : 'FAQs ❓'}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300 shrink-0">
              {(config.faqs || []).length}
            </span>
          </button>

          {/* 11. Testimonials */}
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-start ${
              activeTab === 'testimonials' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span className="truncate flex-1">{isRtl ? 'آراء المتدربين ⭐' : 'Testimonials ⭐'}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300 shrink-0">
              {(config.testimonials || []).length}
            </span>
          </button>

          {/* 12. Show/Hide Sections */}
          <button
            onClick={() => setActiveTab('sections')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-start ${
              activeTab === 'sections' 
                ? 'gold-gradient-btn text-slate-950 font-black shadow-lg shadow-[#C59B5F]/20' 
                : 'text-[#E0BA84] hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-[#C59B5F]/30'
            }`}
          >
            <Eye className="w-4 h-4 shrink-0" />
            <span className="truncate flex-1">{isRtl ? 'إخفاء وظهور الأقسام 👁️' : 'Show / Hide Sections 👁️'}</span>
          </button>

          {/* 13. Bookings Inbox */}
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-start ${
              activeTab === 'bookings' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Inbox className="w-4 h-4 shrink-0" />
            <span className="truncate flex-1">{isRtl ? 'صندوق الحجوزات 📥' : 'Bookings Inbox 📥'}</span>
            {newBookingsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-mono font-bold shrink-0 animate-pulse">
                {newBookingsCount}
              </span>
            )}
          </button>

          {/* 14. Custom Domain */}
          <button
            onClick={() => setActiveTab('domain')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-start ${
              activeTab === 'domain' 
                ? 'gold-gradient-btn text-slate-950 font-black' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-4 h-4 shrink-0" />
            <span className="truncate flex-1">{isRtl ? 'ربط الدومين (riwaalfan.com) 🌐' : 'Custom Domain 🌐'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-sm" />
          </button>

          {/* 15. Admin Accounts & Users */}
          <button
            onClick={() => setActiveTab('admins')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-start ${
              activeTab === 'admins' 
                ? 'gold-gradient-btn text-slate-950 font-black shadow-lg shadow-[#C59B5F]/20' 
                : 'text-amber-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span className="truncate flex-1">{isRtl ? 'إدارة المستخدمين والمدراء 👥' : 'Users & Admins Management 👥'}</span>
          </button>

          {/* 16. Settings & Backup */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-start ${
              activeTab === 'settings' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span className="truncate flex-1">{isRtl ? 'الإعدادات والنسخ ⚙️' : 'Settings & Backup ⚙️'}</span>
          </button>
        </aside>

        {/* Tab Panel Body (Responsive padding, centered container, zero horizontal overflow) */}
        <div className="flex-1 min-w-0 p-3 sm:p-5 lg:p-8 overflow-y-auto overflow-x-hidden">
          <div className="w-full max-w-6xl mx-auto min-w-0">
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
