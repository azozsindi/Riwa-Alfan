import React, { useState } from 'react';
import { 
  X, Tag, Building2, Compass, Waves, Inbox, Settings, 
  Save, RotateCcw, Plus, Trash2, Edit3, Check, ExternalLink, 
  Upload, Image as ImageIcon, Sparkles, MessageCircle, Phone, 
  Calendar, Award, Download, FileUp, Eye, UserCheck, User,
  AlertTriangle, HelpCircle, MessageSquare, LogOut, Database
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { Course, DiveSite, FAQItem, Testimonial } from '../../data/divingData';
import { FahadsLogo } from '../FahadsLogo';

type AdminTab = 'offers' | 'brand' | 'instructor' | 'courses' | 'sites' | 'faqs' | 'testimonials' | 'bookings' | 'settings';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  isStandalonePage?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, isStandalonePage = false }) => {
  const { isRtl } = useLanguage();
  const { 
    config, 
    bookings, 
    updateBrand, 
    updateHero, 
    updateInstructor,
    updateAnnouncement, 
    updateCourse, 
    addCourse, 
    deleteCourse,
    updateDiveSites,
    updateDiveSite,
    addDiveSite,
    deleteDiveSite,
    updateFaqs,
    updateTestimonials,
    updateBookingStatus,
    deleteBooking,
    clearAllBookings,
    resetToDefaults,
    exportBackupJson,
    importBackupJson,
    updateAdminPin,
    restorePreviousPrices
  } = useSiteConfig();

  const [activeTab, setActiveTab] = useState<AdminTab>('offers');
  const [saveToast, setSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form states
  const [brandForm, setBrandForm] = useState(config.brand);
  const [heroForm, setHeroForm] = useState(config.hero);
  const [instructorForm, setInstructorForm] = useState(config.instructor);
  const [newSpecialtyAr, setNewSpecialtyAr] = useState('');
  const [newSpecialtyEn, setNewSpecialtyEn] = useState('');
  const [newCertTextAr, setNewCertTextAr] = useState('');
  const [announcementForm, setAnnouncementForm] = useState(config.announcement);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinFeedback, setPinFeedback] = useState<string | null>(null);
  const [importJsonText, setImportJsonText] = useState('');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'new' | 'contacted' | 'confirmed'>('all');

  // Sites management state
  const [editingSite, setEditingSite] = useState<DiveSite | null>(null);
  const [isAddingSite, setIsAddingSite] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<DiveSite | null>(null);

  // FAQs management state
  const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [newFaq, setNewFaq] = useState<FAQItem>({
    question: { ar: '', en: '' },
    answer: { ar: '', en: '' }
  });

  // Testimonials management state
  const [editingTestimonialIndex, setEditingTestimonialIndex] = useState<number | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState<Testimonial>({
    id: '',
    name: { ar: '', en: '' },
    role: { ar: '', en: '' },
    course: { ar: '', en: '' },
    quote: { ar: '', en: '' },
    date: { ar: '2026', en: '2026' },
    avatarSeed: 'diver'
  });

  if (!isOpen) return null;

  const showToast = (customMsg?: string) => {
    setToastMessage(customMsg || (isRtl ? 'تم الحفظ وتطبيق التغييرات فورا!' : 'Saved & Applied Live!'));
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      setToastMessage('');
    }, 2500);
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrand(brandForm);
    updateHero(heroForm);
    showToast();
  };

  const handleSaveInstructor = (e: React.FormEvent) => {
    e.preventDefault();
    updateInstructor(instructorForm);
    showToast();
  };

  const handleInstructorPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setInstructorForm(prev => ({ ...prev, photoUrl: base64 }));
        updateInstructor({ photoUrl: base64 });
        showToast();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSpecialty = () => {
    if (!newSpecialtyAr.trim()) return;
    const updatedAr = [...(instructorForm.specialtiesAr || []), newSpecialtyAr.trim()];
    const updatedEn = [...(instructorForm.specialtiesEn || []), newSpecialtyEn.trim() || newSpecialtyAr.trim()];
    setInstructorForm(prev => ({ ...prev, specialtiesAr: updatedAr, specialtiesEn: updatedEn }));
    updateInstructor({ specialtiesAr: updatedAr, specialtiesEn: updatedEn });
    setNewSpecialtyAr('');
    setNewSpecialtyEn('');
    showToast();
  };

  const handleRemoveSpecialty = (index: number) => {
    const updatedAr = instructorForm.specialtiesAr.filter((_, i) => i !== index);
    const updatedEn = instructorForm.specialtiesEn.filter((_, i) => i !== index);
    setInstructorForm(prev => ({ ...prev, specialtiesAr: updatedAr, specialtiesEn: updatedEn }));
    updateInstructor({ specialtiesAr: updatedAr, specialtiesEn: updatedEn });
    showToast();
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    updateAnnouncement(announcementForm);
    showToast();
  };

  const optimizeImageFile = (file: File, maxWidth = 600, maxHeight = 600): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/png', 0.9));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await optimizeImageFile(file);
        setBrandForm(prev => ({ ...prev, logoType: 'custom-image', customLogoUrl: base64 }));
        updateBrand({ logoType: 'custom-image', customLogoUrl: base64 });
        showToast(isRtl ? 'تم رفع صورة الشعار وتطبيقها بنجاح!' : 'Logo uploaded and applied!');
      } catch (err) {
        console.error('Error optimizing image:', err);
      }
    }
  };

  const handleApplyOfferPreset = (type: 'summer' | 'national' | 'openwater' | 'weekend') => {
    if (type === 'summer') {
      const updated = {
        enabled: true,
        badgeAr: 'عرض الموسم المائي',
        badgeEn: 'Summer Season Promo',
        textAr: 'خصم خاص 25% على باقات الغوص وحصص التدريب بمناسبة موسم الغوص في جدة!',
        textEn: 'Special 25% OFF on dive packages and coaching for Jeddah diving season!',
        ctaTextAr: 'استفد من العرض الآن',
        ctaTextEn: 'Claim 25% Discount',
        discountPercentage: 25,
        highlightCourseId: 'padi-open-water'
      };
      setAnnouncementForm(updated);
      updateAnnouncement(updated);
    } else if (type === 'openwater') {
      const updated = {
        enabled: true,
        badgeAr: 'عرض المبتدئين الحصري',
        badgeEn: 'Beginner Exclusive Offer',
        textAr: 'سجّل في دورة غواص المياه المفتوحة (Open Water) واحصل على خصم 20% ومعدات مجانية للتدريب!',
        textEn: 'Enroll in PADI Open Water Course and get 20% OFF plus free training gear rental!',
        ctaTextAr: 'احجز مقعدك بالخصم',
        ctaTextEn: 'Book with 20% OFF',
        discountPercentage: 20,
        highlightCourseId: 'padi-open-water'
      };
      setAnnouncementForm(updated);
      updateAnnouncement(updated);
    } else if (type === 'national') {
      const updated = {
        enabled: true,
        badgeAr: 'عرض اليوم الوطني 🇸🇦',
        badgeEn: 'National Day Special 🇸🇦',
        textAr: 'عرض وطني استثنائي: خصم 30% على كافة دورات PADI المعتمدة في جدة لفترة محدودة!',
        textEn: 'Exceptional celebration offer: 30% OFF all certified PADI courses in Jeddah!',
        ctaTextAr: 'احجز بالعرض الوطني',
        ctaTextEn: 'Claim 30% Offer',
        discountPercentage: 30,
        highlightCourseId: 'padi-advanced'
      };
      setAnnouncementForm(updated);
      updateAnnouncement(updated);
    } else if (type === 'weekend') {
      const updated = {
        enabled: true,
        badgeAr: 'رحلة نهاية الأسبوع بجدة',
        badgeEn: 'Jeddah Weekend Trip',
        textAr: 'رحلة بحرية خاصة لحطام أبو طير والبويلر الجمعة القادمة. مقاعد محدودة جداً!',
        textEn: 'Special wreck expedition to Abu Tair & Boiler this Friday. Limited spots!',
        ctaTextAr: 'احجز مقعدك بالبوت',
        ctaTextEn: 'Reserve Boat Spot',
        discountPercentage: 15,
        highlightCourseId: 'padi-wreck'
      };
      setAnnouncementForm(updated);
      updateAnnouncement(updated);
    }
    showToast();
  };

  const handleSaveCourseEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    updateCourse(editingCourse.id, editingCourse);
    setEditingCourse(null);
    showToast();
  };

  const filteredBookings = bookings.filter(b => {
    if (bookingFilter === 'all') return true;
    return b.status === bookingFilter;
  });

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
              {isRtl ? 'تم الحفظ وتطبيق التغييرات فورا!' : 'Saved & Applied Live!'}
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
              onClick={() => setActiveTab('instructor')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'instructor' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>{isRtl ? 'المدرب والشهادات والأرقام' : 'Instructor & Certs'}</span>
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
              <span>{isRtl ? 'النسخ الاحتياطي والأمان' : 'Backup & PIN'}</span>
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {/* TAB 1: OFFERS & ANNOUNCEMENT */}
            {activeTab === 'offers' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Tag className="w-5 h-5 text-blue-400" />
                      {isRtl ? 'إدارة العروض الترويجية والشريط العلوي' : 'Promotional Offers & Top Announcement Bar'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {isRtl 
                        ? 'تفعيل أو إيقاف شريط العروض وتعديل نسبة الخصم والرسالة الترويجية التي تظهر لجميع زوار الموقع.'
                        : 'Enable or disable top promo bar, discount percentages, and call to action.'}
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={announcementForm.enabled} 
                      onChange={(e) => {
                        const val = e.target.checked;
                        setAnnouncementForm(prev => ({ ...prev, enabled: val }));
                        updateAnnouncement({ enabled: val });
                        showToast();
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ms-2.5 text-xs font-semibold text-slate-300">
                      {announcementForm.enabled ? (isRtl ? 'العرض مفعّل' : 'Active') : (isRtl ? 'العرض معطّل' : 'Disabled')}
                    </span>
                  </label>
                </div>

                {/* Quick Presets */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
                  <span className="text-xs font-bold text-slate-300 block mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    {isRtl ? 'قوالب عروض جاهزة بنقرة واحدة:' : '1-Click Offer Presets:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleApplyOfferPreset('openwater')}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 text-start text-xs transition-all cursor-pointer group"
                    >
                      <span className="font-bold text-blue-400 block group-hover:text-blue-300">
                        {isRtl ? 'خصم 20% أوبن واتر' : '20% OFF Open Water'}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        {isRtl ? 'للمبتدئين الجدد بجدة' : 'For new beginners in Jeddah'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApplyOfferPreset('summer')}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 text-start text-xs transition-all cursor-pointer group"
                    >
                      <span className="font-bold text-emerald-400 block group-hover:text-emerald-300">
                        {isRtl ? 'خصم 25% باقة الصيف' : '25% OFF Summer Promo'}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        {isRtl ? 'باقات التدريب المتقدم' : 'Advanced dive packages'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApplyOfferPreset('national')}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 text-start text-xs transition-all cursor-pointer group"
                    >
                      <span className="font-bold text-green-400 block group-hover:text-green-300">
                        {isRtl ? 'خصم 30% اليوم الوطني' : '30% OFF National Day'}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        {isRtl ? 'عرض احتفالي لفترة محدودة' : 'Special limited celebration'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApplyOfferPreset('weekend')}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 text-start text-xs transition-all cursor-pointer group"
                    >
                      <span className="font-bold text-purple-400 block group-hover:text-purple-300">
                        {isRtl ? 'رحلة البوت الأسبوعية' : 'Weekend Boat Trip'}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        {isRtl ? 'حطام أبو طير والبويلر' : 'Abu Tair & Boiler wrecks'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                <form onSubmit={handleSaveAnnouncement} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {isRtl ? 'وسام أو شارة العرض (عربي):' : 'Offer Badge (Arabic):'}
                      </label>
                      <input 
                        type="text"
                        value={announcementForm.badgeAr}
                        onChange={(e) => setAnnouncementForm(prev => ({ ...prev, badgeAr: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {isRtl ? 'وسام أو شارة العرض (إنجليزي):' : 'Offer Badge (English):'}
                      </label>
                      <input 
                        type="text"
                        value={announcementForm.badgeEn}
                        onChange={(e) => setAnnouncementForm(prev => ({ ...prev, badgeEn: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRtl ? 'نص الإعلان والخصم (عربي):' : 'Announcement Text (Arabic):'}
                    </label>
                    <textarea 
                      rows={2}
                      value={announcementForm.textAr}
                      onChange={(e) => setAnnouncementForm(prev => ({ ...prev, textAr: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRtl ? 'نص الإعلان والخصم (إنجليزي):' : 'Announcement Text (English):'}
                    </label>
                    <textarea 
                      rows={2}
                      value={announcementForm.textEn}
                      onChange={(e) => setAnnouncementForm(prev => ({ ...prev, textEn: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {isRtl ? 'نسبة الخصم (%):' : 'Discount Percentage (%):'}
                      </label>
                      <input 
                        type="number"
                        min="0"
                        max="90"
                        value={announcementForm.discountPercentage || 0}
                        onChange={(e) => setAnnouncementForm(prev => ({ ...prev, discountPercentage: Number(e.target.value) }))}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {isRtl ? 'نص زر الطلب (عربي):' : 'CTA Button (Arabic):'}
                      </label>
                      <input 
                        type="text"
                        value={announcementForm.ctaTextAr}
                        onChange={(e) => setAnnouncementForm(prev => ({ ...prev, ctaTextAr: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {isRtl ? 'نص زر الطلب (إنجليزي):' : 'CTA Button (English):'}
                      </label>
                      <input 
                        type="text"
                        value={announcementForm.ctaTextEn}
                        onChange={(e) => setAnnouncementForm(prev => ({ ...prev, ctaTextEn: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isRtl ? 'حفظ ونشر العرض فوراً' : 'Save & Publish Offer'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: BRAND & LOGO & JEDDAH */}
            {activeTab === 'brand' && (
              <form onSubmit={handleSaveBrand} className="space-y-6 max-w-4xl">
                <div className="pb-4 border-b border-slate-800">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    {isRtl ? 'هوية مركز الغوص، الشعار، ومعلومات الاتصال' : 'Center Identity, Logo & Contacts'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {isRtl 
                      ? 'تعديل اسم المركز، الشعار (نصي أو صورة)، أرقام الواتساب والتواصل، ومقر جدة.'
                      : 'Configure center name, logo graphic/text, WhatsApp & Jeddah location.'}
                  </p>
                </div>

                {/* Logo Customizer */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white block">
                      {isRtl ? 'تخصيص الشعار الرسمي (Logo):' : 'Logo Customization:'}
                    </span>
                    <span className="text-[11px] text-blue-400 font-medium">
                      {brandForm.logoType === 'custom-image' && brandForm.customLogoUrl 
                        ? (isRtl ? 'يتم استخدام صورة شعارك المخصصة' : 'Using custom image logo')
                        : (isRtl ? 'يتم استخدام شعار المتجه الافتراضي' : 'Using default vector emblem')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Live Preview Box */}
                    <div className="md:col-span-5 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-3">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {isRtl ? 'معاينة الشعار في الموقع' : 'Live Logo Preview'}
                      </span>
                      <div className="w-full py-4 px-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center min-h-[90px]">
                        {brandForm.logoType === 'custom-image' && brandForm.customLogoUrl ? (
                          <img 
                            src={brandForm.customLogoUrl} 
                            alt="Custom Logo" 
                            className="max-h-16 max-w-[200px] object-contain"
                          />
                        ) : (
                          <FahadsLogo size="md" theme="dark" />
                        )}
                      </div>
                      {brandForm.logoType === 'custom-image' && brandForm.customLogoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setBrandForm(prev => ({ ...prev, logoType: 'vector', customLogoUrl: '' }));
                            updateBrand({ logoType: 'vector', customLogoUrl: '' });
                            showToast(isRtl ? 'تمت العودة لشعار المتجه الأصلي' : 'Reverted to default emblem');
                          }}
                          className="text-xs text-red-400 hover:text-red-300 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'إزالة الصورة والعودة للشعار الأصلي' : 'Remove image & use vector'}</span>
                        </button>
                      )}
                    </div>

                    {/* Logo Upload & URL Options */}
                    <div className="md:col-span-7 space-y-4">
                      {/* Option 1: File Upload */}
                      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                        <span className="text-xs font-semibold text-slate-200 block">
                          {isRtl ? '1. رفع ملف صورة من جهازك:' : '1. Upload image from your device:'}
                        </span>
                        <label className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border-2 border-dashed border-blue-500/40 text-xs font-bold text-blue-300 hover:text-blue-200 cursor-pointer transition-all">
                          <Upload className="w-4 h-4 text-blue-400" />
                          <span>{isRtl ? 'اضغط لاختيار صورة الشعار (PNG / JPG / WebP / SVG)' : 'Choose Logo Image File'}</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Option 2: Image URL */}
                      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                        <span className="text-xs font-semibold text-slate-200 block">
                          {isRtl ? '2. أو إدخال رابط صورة الشعار مباشرة (URL):' : '2. Or paste image URL directly:'}
                        </span>
                        <div className="flex gap-2">
                          <input 
                            type="url"
                            placeholder="https://example.com/logo.png"
                            value={brandForm.customLogoUrl || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBrandForm(prev => ({ 
                                ...prev, 
                                customLogoUrl: val,
                                logoType: val.trim() ? 'custom-image' : 'vector'
                              }));
                            }}
                            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (brandForm.customLogoUrl?.trim()) {
                                updateBrand({ logoType: 'custom-image', customLogoUrl: brandForm.customLogoUrl.trim() });
                                showToast(isRtl ? 'تم تطبيق رابط الشعار بنجاح!' : 'Logo URL applied!');
                              }
                            }}
                            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 cursor-pointer transition-colors"
                          >
                            {isRtl ? 'تطبيق' : 'Apply'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRtl ? 'اسم المركز (بالعربية):' : 'Center Name (Arabic):'}
                    </label>
                    <input 
                      type="text"
                      value={brandForm.centerNameAr}
                      onChange={(e) => setBrandForm(prev => ({ ...prev, centerNameAr: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRtl ? 'اسم المركز (بالإنجليزية):' : 'Center Name (English):'}
                    </label>
                    <input 
                      type="text"
                      value={brandForm.centerNameEn}
                      onChange={(e) => setBrandForm(prev => ({ ...prev, centerNameEn: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-bold"
                    />
                  </div>
                </div>

                {/* Contacts & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRtl ? 'رقم الواتساب المباشر:' : 'WhatsApp Number:'}
                    </label>
                    <input 
                      type="text"
                      value={brandForm.whatsappNumber}
                      onChange={(e) => setBrandForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRtl ? 'رقم الجوال للاتصال:' : 'Phone Call Number:'}
                    </label>
                    <input 
                      type="text"
                      value={brandForm.phone}
                      onChange={(e) => setBrandForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRtl ? 'البريد الإلكتروني:' : 'Email Address:'}
                    </label>
                    <input 
                      type="email"
                      value={brandForm.email}
                      onChange={(e) => setBrandForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Stats & Counters with Visibility Toggle */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-850">
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {isRtl ? 'إحصائيات الواجهة الرئيسية (Hero Stats):' : 'Hero Section Statistics:'}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {isRtl ? 'الأرقام الظاهرة في أسفل قسم البطل بالصفحة الرئيسية مع إمكانية إخفائها أو تعديلها.' : 'Key figures displayed below the hero headline, with visibility toggle.'}
                      </p>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        heroForm.showStats !== false 
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {heroForm.showStats !== false 
                          ? (isRtl ? 'معروضة في الموقع' : 'Visible on Site') 
                          : (isRtl ? 'مخفية من الموقع' : 'Hidden from Site')}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          const nextState = heroForm.showStats === false ? true : false;
                          setHeroForm(prev => ({ ...prev, showStats: nextState }));
                          updateHero({ showStats: nextState });
                          showToast(nextState 
                            ? (isRtl ? 'تم إظهار الإحصائيات في الصفحة الرئيسية!' : 'Stats are now visible!') 
                            : (isRtl ? 'تم إخفاء الإحصائيات من الصفحة الرئيسية!' : 'Stats are now hidden!'));
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                          heroForm.showStats !== false ? 'bg-blue-600' : 'bg-slate-800'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            heroForm.showStats !== false ? (isRtl ? '-translate-x-6' : 'translate-x-6') : (isRtl ? '-translate-x-1' : 'translate-x-1')
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Stat 1: Logged Dives */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <label className="block text-[11px] font-semibold text-slate-300">
                        {isRtl ? 'عنوان الإحصائية 1:' : 'Stat 1 Label:'}
                      </label>
                      <input 
                        type="text"
                        value={heroForm.divesLabelAr || 'عدد الغوصات الموثقة'}
                        onChange={(e) => setHeroForm(prev => ({ ...prev, divesLabelAr: e.target.value }))}
                        placeholder="عدد الغوصات الموثقة"
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-blue-500 outline-none"
                      />
                      <label className="block text-[11px] font-semibold text-slate-300 pt-1">
                        {isRtl ? 'الرقم / القيمة:' : 'Number / Value:'}
                      </label>
                      <input 
                        type="text"
                        value={heroForm.divesStat}
                        onChange={(e) => setHeroForm(prev => ({ ...prev, divesStat: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-blue-500 outline-none font-mono font-bold"
                      />
                    </div>

                    {/* Stat 2: Certified Graduates */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <label className="block text-[11px] font-semibold text-slate-300">
                        {isRtl ? 'عنوان الإحصائية 2:' : 'Stat 2 Label:'}
                      </label>
                      <input 
                        type="text"
                        value={heroForm.studentsLabelAr || 'عدد الغواصين الخريجين'}
                        onChange={(e) => setHeroForm(prev => ({ ...prev, studentsLabelAr: e.target.value }))}
                        placeholder="عدد الغواصين الخريجين"
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-blue-500 outline-none"
                      />
                      <label className="block text-[11px] font-semibold text-slate-300 pt-1">
                        {isRtl ? 'الرقم / القيمة:' : 'Number / Value:'}
                      </label>
                      <input 
                        type="text"
                        value={heroForm.studentsStat}
                        onChange={(e) => setHeroForm(prev => ({ ...prev, studentsStat: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-blue-500 outline-none font-mono font-bold"
                      />
                    </div>

                    {/* Stat 3: Safety Record */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <label className="block text-[11px] font-semibold text-slate-300">
                        {isRtl ? 'عنوان الإحصائية 3:' : 'Stat 3 Label:'}
                      </label>
                      <input 
                        type="text"
                        value={heroForm.safetyLabelAr || 'سجل الأمان والسلامة'}
                        onChange={(e) => setHeroForm(prev => ({ ...prev, safetyLabelAr: e.target.value }))}
                        placeholder="سجل الأمان والسلامة"
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-blue-500 outline-none"
                      />
                      <label className="block text-[11px] font-semibold text-slate-300 pt-1">
                        {isRtl ? 'الرقم / القيمة:' : 'Number / Value:'}
                      </label>
                      <input 
                        type="text"
                        value={heroForm.safetyStat}
                        onChange={(e) => setHeroForm(prev => ({ ...prev, safetyStat: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-blue-500 outline-none font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isRtl ? 'حفظ وتحديث هوية المركز' : 'Save Brand Settings'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB: INSTRUCTOR & CERTIFICATIONS */}
            {activeTab === 'instructor' && (
              <form onSubmit={handleSaveInstructor} className="space-y-6 max-w-4xl">
                <div className="pb-4 border-b border-slate-800">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-blue-400" />
                    {isRtl ? 'بيانات المدرب الشخصية، الشهادات، والرخص والأرقام الرسمية' : 'Instructor Profile, Certifications & License Numbers'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {isRtl 
                      ? 'التحكم الكامل باسم المدرب، الصورة الشخصية، أرقام رخص PADI وDAN وEFR، السيرة الذاتية، والتخصصات التدريبية.'
                      : 'Full control over instructor name, photo, PADI, DAN & EFR license numbers, bio, and teaching specialties.'}
                  </p>
                </div>

                {/* Personal Photo & Avatar */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <span className="text-xs font-bold text-white block">
                    {isRtl ? 'الصورة الشخصية للمدرب كابتن فهد:' : 'Instructor Personal Photo:'}
                  </span>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Live Preview */}
                    <div className="w-24 h-24 rounded-2xl bg-slate-900 border-2 border-blue-500/50 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                      {instructorForm.photoUrl ? (
                        <img 
                          src={instructorForm.photoUrl} 
                          alt="Captain Fahad" 
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <User className="w-10 h-10 text-slate-600 mb-1" />
                          <span className="text-[10px] text-slate-500">{isRtl ? 'لا توجد صورة' : 'No photo'}</span>
                        </div>
                      )}
                    </div>

                    {/* Upload actions */}
                    <div className="flex-1 space-y-2">
                      <p className="text-xs text-slate-300">
                        {isRtl 
                          ? 'يمكنك رفع صورتك الشخصية ببدلة الغوص أو اللباس الميداني لتظهر في بطاقة المدرب بالموقع.'
                          : 'Upload your personal instructor photo to display in the instructor section.'}
                      </p>
                      <div className="flex items-center gap-3 pt-1">
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white cursor-pointer shadow-md shadow-blue-600/20 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'رفع صورة شخصية من جهازك' : 'Upload Personal Photo'}</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleInstructorPhotoUpload}
                            className="hidden"
                          />
                        </label>
                        {instructorForm.photoUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setInstructorForm(prev => ({ ...prev, photoUrl: '' }));
                              updateInstructor({ photoUrl: '' });
                              showToast();
                            }}
                            className="text-xs text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                          >
                            {isRtl ? 'إزالة الصورة واستخدام الشعار' : 'Remove Photo'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Name & Titles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRtl ? 'اسم المدرب (بالعربية):' : 'Instructor Name (Arabic):'}
                    </label>
                    <input 
                      type="text"
                      value={instructorForm.nameAr}
                      onChange={(e) => setInstructorForm(prev => ({ ...prev, nameAr: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRtl ? 'اسم المدرب (بالإنجليزية):' : 'Instructor Name (English):'}
                    </label>
                    <input 
                      type="text"
                      value={instructorForm.nameEn}
                      onChange={(e) => setInstructorForm(prev => ({ ...prev, nameEn: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRtl ? 'المسمى والصفة التدريبية (عربي):' : 'Instructor Title (Arabic):'}
                    </label>
                    <input 
                      type="text"
                      value={instructorForm.titleAr}
                      onChange={(e) => setInstructorForm(prev => ({ ...prev, titleAr: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRtl ? 'سنوات الخبرة:' : 'Experience Years:'}
                    </label>
                    <input 
                      type="text"
                      value={instructorForm.experienceYears}
                      onChange={(e) => setInstructorForm(prev => ({ ...prev, experienceYears: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isRtl ? 'الاعتماد الدولي المختصر (الصفة تحت المسمى):' : 'International Accreditation Tagline:'}
                  </label>
                  <input 
                    type="text"
                    value={instructorForm.accreditationAr || ''}
                    onChange={(e) => setInstructorForm(prev => ({ ...prev, accreditationAr: e.target.value }))}
                    placeholder="مدرب محترف معتمد دولياً لدى منظمة PADI"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-blue-300 font-semibold focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Official License & Certification Numbers - Fully Editable List */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      {isRtl ? 'قائمة الشهادات والرخص المعتمدة (تظهر عليها علامة التحقق الزرقاء):' : 'Verified Certifications & Licenses (with blue checkmark):'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {(instructorForm.certificatesListAr || []).length} {isRtl ? 'شهادات' : 'badges'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {(instructorForm.certificatesListAr || [
                      instructorForm.padiMemberNumber,
                      instructorForm.owsiNumber,
                      instructorForm.danNumber,
                      instructorForm.efrNumber
                    ]).map((cert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-blue-400 font-mono font-bold text-xs shrink-0 w-6 text-center">
                          #{index + 1}
                        </span>
                        <input 
                          type="text"
                          value={cert}
                          onChange={(e) => {
                            const updated = [...(instructorForm.certificatesListAr || [
                              instructorForm.padiMemberNumber,
                              instructorForm.owsiNumber,
                              instructorForm.danNumber,
                              instructorForm.efrNumber
                            ])];
                            updated[index] = e.target.value;
                            setInstructorForm(prev => ({ ...prev, certificatesListAr: updated }));
                          }}
                          className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 font-medium focus:border-blue-500 outline-none"
                        />
                        {(instructorForm.certificatesListAr || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (instructorForm.certificatesListAr || []).filter((_, i) => i !== index);
                              setInstructorForm(prev => ({ ...prev, certificatesListAr: updated }));
                            }}
                            className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-colors cursor-pointer"
                            title={isRtl ? 'حذف الشهادة' : 'Remove certificate'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add new certificate */}
                  <div className="pt-2 border-t border-slate-850 flex gap-2">
                    <input 
                      type="text"
                      placeholder={isRtl ? 'إضافة شهادة أو رخصة جديدة (مثال: مدرب غوص حطام معتمد PADI Wreck Instructor)' : 'Add new certificate / license text'}
                      value={newCertTextAr}
                      onChange={(e) => setNewCertTextAr(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newCertTextAr.trim()) return;
                        const updated = [...(instructorForm.certificatesListAr || [
                          instructorForm.padiMemberNumber,
                          instructorForm.owsiNumber,
                          instructorForm.danNumber,
                          instructorForm.efrNumber
                        ]), newCertTextAr.trim()];
                        setInstructorForm(prev => ({ ...prev, certificatesListAr: updated }));
                        setNewCertTextAr('');
                        showToast();
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'إضافة شهادة' : 'Add Certificate'}</span>
                    </button>
                  </div>
                </div>

                {/* Bio text */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isRtl ? 'السيرة المهنية للمدرب (عربي):' : 'Instructor Bio (Arabic):'}
                  </label>
                  <textarea 
                    rows={3}
                    value={instructorForm.bioAr}
                    onChange={(e) => setInstructorForm(prev => ({ ...prev, bioAr: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isRtl ? 'مقولة وفلسفة المدرب (عربي):' : 'Instructor Quote & Philosophy (Arabic):'}
                  </label>
                  <textarea 
                    rows={2}
                    value={instructorForm.quoteAr}
                    onChange={(e) => setInstructorForm(prev => ({ ...prev, quoteAr: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none leading-relaxed italic"
                  />
                </div>

                {/* Teaching Specialties List Manager */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <span className="text-xs font-bold text-white block flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-400" />
                    {isRtl ? 'التخصصات التدريبية المعتمدة (PADI Specialties):' : 'Certified Teaching Specialties:'}
                  </span>

                  {/* Existing Specialties Chips */}
                  <div className="space-y-2">
                    {instructorForm.specialtiesAr.map((spec, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-400" />
                          <span>{spec}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecialty(index)}
                          className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                          title={isRtl ? 'حذف هذا التخصص' : 'Delete specialty'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Specialty Input */}
                  <div className="pt-2 border-t border-slate-850 flex flex-col sm:flex-row gap-2">
                    <input 
                      type="text"
                      placeholder={isRtl ? 'اسم التخصص بالعربية (مثال: مدرب غوص الحطام Wreck Diver)' : 'Specialty title (Arabic)'}
                      value={newSpecialtyAr}
                      onChange={(e) => setNewSpecialtyAr(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                    />
                    <input 
                      type="text"
                      placeholder={isRtl ? 'اسم التخصص بالإنجليزية' : 'Specialty title (English)'}
                      value={newSpecialtyEn}
                      onChange={(e) => setNewSpecialtyEn(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddSpecialty}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'إضافة تخصص' : 'Add Specialty'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isRtl ? 'حفظ وتحديث بيانات المدرب والشهادات' : 'Save Instructor & Certifications'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: COURSES & PRICING */}
            {activeTab === 'courses' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-400" />
                      {isRtl ? 'إدارة الدورات التدريبية والأسعار PADI' : 'PADI Courses & Pricing Management'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {isRtl 
                        ? 'تعديل أسعار الدورات، المدة، العمق، التفاصيل، أو إضافة دورة تدريبية جديدة بجدة.'
                        : 'Edit course prices, durations, curriculum details, or add new courses.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const ok = restorePreviousPrices();
                        if (ok) {
                          setToastMessage(isRtl ? 'تم استرجاع أسعارك وتعديلاتك السابقة بنجاح!' : 'Previous prices restored successfully!');
                          showToast();
                        } else {
                          setToastMessage(isRtl ? 'الأسعار الحالية هي أحدث نسخة محفوظة' : 'Current prices are up to date');
                          showToast();
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                      title={isRtl ? 'استرجاع تعديلات الأسعار من الذاكرة المحلية السابقة' : 'Restore previous prices from memory'}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'استرجاع أسعاري السابقة' : 'Restore Previous Prices'}</span>
                    </button>

                    <button
                      onClick={() => {
                        const newId = `course-${Date.now()}`;
                        const freshCourse: Course = {
                          id: newId,
                          category: 'specialty',
                          certAgency: 'PADI',
                          seaDives: 2,
                          poolSessions: 1,
                          title: { ar: 'دورة تدريبية جديدة', en: 'New Diving Course' },
                          price: { ar: '1,500 ر.س', en: '1,500 SAR' },
                          duration: { ar: 'يومين', en: '2 Days' },
                          depth: { ar: 'حتى 20 متر', en: 'Up to 20m' },
                          summary: { ar: 'وصف وموجز الدورة...', en: 'Course overview...' },
                          prerequisites: { ar: 'غواص مياه مفتوحة مرخص', en: 'Open Water Diver' },
                          highlights: { ar: ['تدريب عملي بجدة', 'شهادة PADI رقمية'], en: ['Practical training in Jeddah', 'PADI digital eCard'] },
                          curriculum: { ar: ['الجانب النظري', 'الغوص في البحر'], en: ['Theory session', 'Open water dives'] }
                        };
                        addCourse(freshCourse);
                        setEditingCourse(freshCourse);
                        showToast();
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/30 shrink-0 self-start"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isRtl ? 'إضافة دورة جديدة' : 'Add New Course'}</span>
                    </button>
                  </div>
                </div>

                {/* Cloud Sync & Quick Price Matrix */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-emerald-400" />
                        <span>{isRtl ? 'تعديل أسعار الدورات السريع (مباشر وسحابي):' : 'Fast Live Price Matrix:'}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                        {isRtl ? 'سحابي ومحفوظ دائماً' : 'Cloud Saved'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {isRtl ? 'اكتب السعر واضغط حفظ للتطبيق المباشر' : 'Edit price & save live'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {config.courses.map((course) => (
                      <div 
                        key={course.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 hover:border-slate-700 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-white block truncate">
                            {course.title.ar}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {course.title.en} · {course.duration.ar}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <input 
                            type="text"
                            value={course.price.ar}
                            onChange={(e) => {
                              const newPriceAr = e.target.value;
                              const newPriceEn = newPriceAr.replace(/ر\.س/g, 'SAR');
                              updateCourse(course.id, {
                                price: {
                                  ar: newPriceAr,
                                  en: newPriceEn
                                }
                              });
                            }}
                            className="w-24 px-2 py-1.5 bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg text-xs text-white font-mono font-bold text-center outline-none"
                            placeholder="1,850 ر.س"
                          />
                          <button
                            type="button"
                            onClick={() => setEditingCourse(course)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title={isRtl ? 'تعديل باقي تفاصيل الدورة' : 'Edit full details'}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Edit Modal / Panel */}
                {editingCourse && (
                  <div className="p-5 rounded-2xl bg-slate-950 border border-blue-500/40 shadow-xl space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-sm font-bold text-blue-400 flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        {isRtl ? `تعديل الدورة: ${editingCourse.title.ar}` : `Edit Course: ${editingCourse.title.en}`}
                      </span>
                      <button
                        onClick={() => setEditingCourse(null)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveCourseEdit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            {isRtl ? 'عنوان الدورة (عربي):' : 'Course Title (Arabic):'}
                          </label>
                          <input 
                            type="text"
                            value={editingCourse.title.ar}
                            onChange={(e) => setEditingCourse({
                              ...editingCourse,
                              title: { ...editingCourse.title, ar: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            {isRtl ? 'عنوان الدورة (إنجليزي):' : 'Course Title (English):'}
                          </label>
                          <input 
                            type="text"
                            value={editingCourse.title.en}
                            onChange={(e) => setEditingCourse({
                              ...editingCourse,
                              title: { ...editingCourse.title, en: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            {isRtl ? 'السعر (عربي):' : 'Price (Arabic):'}
                          </label>
                          <input 
                            type="text"
                            value={editingCourse.price.ar}
                            onChange={(e) => setEditingCourse({
                              ...editingCourse,
                              price: { ...editingCourse.price, ar: e.target.value }
                            })}
                            placeholder="مثال: 1,850 ر.س"
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            {isRtl ? 'السعر (إنجليزي):' : 'Price (English):'}
                          </label>
                          <input 
                            type="text"
                            value={editingCourse.price.en}
                            onChange={(e) => setEditingCourse({
                              ...editingCourse,
                              price: { ...editingCourse.price, en: e.target.value }
                            })}
                            placeholder="e.g. 1,850 SAR"
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            {isRtl ? 'المدة:' : 'Duration:'}
                          </label>
                          <input 
                            type="text"
                            value={editingCourse.duration.ar}
                            onChange={(e) => setEditingCourse({
                              ...editingCourse,
                              duration: { ...editingCourse.duration, ar: e.target.value, en: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          {isRtl ? 'موجز الدورة (عربي):' : 'Summary (Arabic):'}
                        </label>
                        <textarea 
                          rows={2}
                          value={editingCourse.summary.ar}
                          onChange={(e) => setEditingCourse({
                            ...editingCourse,
                            summary: { ...editingCourse.summary, ar: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none leading-relaxed"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/30"
                        >
                          <Save className="w-4 h-4" />
                          <span>{isRtl ? 'حفظ التعديلات على الدورة' : 'Save Course Edits'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCourse(null)}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                        >
                          {isRtl ? 'إلغاء' : 'Cancel'}
                        </button>

                        {config.courses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setCourseToDelete(editingCourse)}
                            className="ms-auto px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{isRtl ? 'حذف هذه الدورة' : 'Delete Course'}</span>
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                )}

                {/* Course List Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {config.courses.map((course) => (
                    <div 
                      key={course.id}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-900/50">
                              {course.certAgency} · {course.category.toUpperCase()}
                            </span>
                            <h4 className="text-sm font-bold text-white mt-1.5">
                              {course.title.ar}
                            </h4>
                            <span className="text-xs text-slate-400 font-sans block">
                              {course.title.en}
                            </span>
                          </div>
                          
                          <div className="text-end">
                            <span className="text-sm font-extrabold text-blue-400 font-mono block">
                              {course.price.ar}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {course.duration.ar}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                          {course.summary.ar}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-850">
                        <span className="text-[11px] text-slate-500 font-mono">
                          {course.depth.ar}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingCourse(course)}
                            className="p-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
                            title={isRtl ? 'تعديل السعر والتفاصيل' : 'Edit course'}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{isRtl ? 'تعديل' : 'Edit'}</span>
                          </button>
                          
                          {config.courses.length > 1 && (
                            <button
                              onClick={() => setCourseToDelete(course)}
                              className="p-1.5 px-2.5 rounded-lg bg-red-950/40 hover:bg-red-600 border border-red-900/50 text-red-400 hover:text-white transition-all cursor-pointer text-xs flex items-center gap-1"
                              title={isRtl ? 'حذف هذه الدورة' : 'Delete course'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{isRtl ? 'حذف' : 'Delete'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* In-App Confirmation Dialog for Course Deletion */}
                {courseToDelete && (
                  <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-slate-900 border border-red-500/40 rounded-3xl max-w-md w-full p-6 space-y-5 text-center shadow-2xl">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-7 h-7" />
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-white">
                          {isRtl ? 'تأكيد حذف الدورة التدريبية' : 'Confirm Course Deletion'}
                        </h4>
                        <div className="text-sm text-yellow-300 font-bold bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          {courseToDelete.title.ar} ({courseToDelete.title.en})
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {isRtl 
                            ? 'هل أنت متأكد من رغبتك في حذف هذه الدورة نهائياً من الموقع؟ لن تظهر الدورة مجدداً في الصفحة الرئيسية أو قائمة الحجوزات.'
                            : 'Are you sure you want to permanently delete this course? It will be removed from the catalog and booking options.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => {
                            deleteCourse(courseToDelete.id);
                            if (editingCourse?.id === courseToDelete.id) {
                              setEditingCourse(null);
                            }
                            setCourseToDelete(null);
                            showToast(isRtl ? 'تم حذف الدورة بنجاح!' : 'Course deleted successfully!');
                          }}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>{isRtl ? 'نعم، حذف الدورة الآن' : 'Yes, Delete Course'}</span>
                        </button>

                        <button
                          onClick={() => setCourseToDelete(null)}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          {isRtl ? 'إلغاء وتراجع' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SITES */}
            {activeTab === 'sites' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Waves className="w-5 h-5 text-blue-400" />
                      {isRtl ? 'مواقع وغوصات جدة البحرية والرحلات' : 'Jeddah Dive Destinations'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {isRtl 
                        ? 'إدارة وتعديل المواقع المعتمدة لرحلات وغوصات المركز في مياه جدة (شرم أبحر، أبو طير، المسماري، البويلر).'
                        : 'Active dive sites off Jeddah waters managed by the center.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const newId = `site-${Date.now()}`;
                      const emptySite: DiveSite = {
                        id: newId,
                        name: { ar: 'موقع غوص جديد بجدة', en: 'New Jeddah Dive Site' },
                        location: { ar: 'شمال جدة - البحر الأحمر', en: 'North Jeddah - Red Sea' },
                        depth: { ar: '10 - 30 متر', en: '10 - 30 meters' },
                        level: { ar: 'جميع المستويات', en: 'All Levels' },
                        visibility: { ar: '25 - 35 متر', en: '25 - 35 meters' },
                        current: { ar: 'خفيف', en: 'Gentle' },
                        marineLife: {
                          ar: ['شِعاب مرجانية', 'أسماك الببغاء', 'سلاحف بحرية'],
                          en: ['Coral Reefs', 'Parrotfish', 'Sea Turtles']
                        },
                        description: {
                          ar: 'وصف تفصيلي لموقع الغوص والحياة البحرية والعمق.',
                          en: 'Detailed description of the dive destination.'
                        }
                      };
                      addDiveSite(emptySite);
                      setEditingSite(emptySite);
                      showToast(isRtl ? 'تمت إضافة موقع جديد، يمكنك تعديله الآن' : 'New site added, edit details now');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 cursor-pointer transition-all self-start sm:self-auto shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isRtl ? 'إضافة موقع غوص جديد' : 'Add New Site'}</span>
                  </button>
                </div>

                {/* Edit Site Inline Form */}
                {editingSite && (
                  <div className="p-5 rounded-2xl bg-blue-950/20 border-2 border-blue-500/40 space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-blue-900/50">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-blue-400" />
                        <span>{isRtl ? 'تعديل بيانات موقع الغوص:' : 'Edit Dive Site:'}</span>
                        <span className="text-blue-300 font-mono text-xs">{editingSite.name.ar}</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => setEditingSite(null)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          {isRtl ? 'اسم الموقع (بالعربية):' : 'Site Name (Arabic):'}
                        </label>
                        <input
                          type="text"
                          value={editingSite.name.ar}
                          onChange={(e) => setEditingSite({
                            ...editingSite,
                            name: { ...editingSite.name, ar: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          {isRtl ? 'الموقع الجغرافي:' : 'Location Area:'}
                        </label>
                        <input
                          type="text"
                          value={editingSite.location.ar}
                          onChange={(e) => setEditingSite({
                            ...editingSite,
                            location: { ...editingSite.location, ar: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          {isRtl ? 'العمق:' : 'Depth Range:'}
                        </label>
                        <input
                          type="text"
                          value={editingSite.depth.ar}
                          onChange={(e) => setEditingSite({
                            ...editingSite,
                            depth: { ...editingSite.depth, ar: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          {isRtl ? 'مستوى الغواصين المطلوب:' : 'Required Diver Level:'}
                        </label>
                        <input
                          type="text"
                          value={editingSite.level.ar}
                          onChange={(e) => setEditingSite({
                            ...editingSite,
                            level: { ...editingSite.level, ar: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {isRtl ? 'وصف الموقع ومميزاته:' : 'Description & Features:'}
                      </label>
                      <textarea
                        rows={2}
                        value={editingSite.description.ar}
                        onChange={(e) => setEditingSite({
                          ...editingSite,
                          description: { ...editingSite.description, ar: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          updateDiveSite(editingSite.id, editingSite);
                          setEditingSite(null);
                          showToast(isRtl ? 'تم حفظ تعديلات الموقع بنجاح!' : 'Site updated successfully!');
                        }}
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/30"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isRtl ? 'حفظ تعديل الموقع' : 'Save Site'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingSite(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                      >
                        {isRtl ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {config.diveSites.map((site) => (
                    <div key={site.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-white">{site.name.ar}</h4>
                            <span className="text-xs text-blue-400 block mt-0.5">{site.location.ar}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono">
                            {site.depth.ar}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                          {site.description.ar}
                        </p>

                        <div className="pt-2 border-t border-slate-850 flex flex-wrap gap-1.5 mt-2">
                          {site.marineLife.ar.slice(0, 4).map((animal, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                              {animal}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-850">
                        <button
                          type="button"
                          onClick={() => setEditingSite(site)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'تعديل' : 'Edit'}</span>
                        </button>
                        {config.diveSites.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              deleteDiveSite(site.id);
                              if (editingSite?.id === site.id) setEditingSite(null);
                              showToast(isRtl ? 'تم حذف الموقع' : 'Site removed');
                            }}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white transition-colors cursor-pointer"
                            title={isRtl ? 'حذف الموقع' : 'Delete'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: FAQS */}
            {activeTab === 'faqs' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-blue-400" />
                      {isRtl ? 'إدارة الأسئلة الشائعة وإجاباتها' : 'FAQ Management'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {isRtl 
                        ? 'إضافة وتعديل وحذف أي سؤال وإجابة تظهر للزوار في قسم الأسئلة الشائعة.'
                        : 'Add, update or delete frequently asked questions and answers displayed to visitors.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const currentFaqs = config.faqs && config.faqs.length > 0 ? config.faqs : [];
                      const updated = [
                        ...currentFaqs,
                        {
                          question: { ar: 'سؤال جديد يهم المتدربين؟', en: 'New Frequently Asked Question?' },
                          answer: { ar: 'إجابة مفصلة وواضحة من كابتن فهد هنا.', en: 'Detailed clear answer from Captain Fahad.' }
                        }
                      ];
                      updateFaqs(updated);
                      setEditingFaqIndex(updated.length - 1);
                      showToast(isRtl ? 'تمت إضافة سؤال جديد، يمكنك تعديله بالأسفل' : 'New FAQ added');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 cursor-pointer transition-all self-start sm:self-auto shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isRtl ? 'إضافة سؤال جديد' : 'Add FAQ'}</span>
                  </button>
                </div>

                {/* FAQ List */}
                <div className="space-y-3">
                  {(config.faqs || []).map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      {editingFaqIndex === idx ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              {isRtl ? 'نص السؤال:' : 'Question:'}
                            </label>
                            <input
                              type="text"
                              value={faq.question.ar}
                              onChange={(e) => {
                                const updated = [...(config.faqs || [])];
                                updated[idx] = {
                                  ...updated[idx],
                                  question: { ...updated[idx].question, ar: e.target.value, en: e.target.value }
                                };
                                updateFaqs(updated);
                              }}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              {isRtl ? 'نص الإجابة:' : 'Answer:'}
                            </label>
                            <textarea
                              rows={3}
                              value={faq.answer.ar}
                              onChange={(e) => {
                                const updated = [...(config.faqs || [])];
                                updated[idx] = {
                                  ...updated[idx],
                                  answer: { ...updated[idx].answer, ar: e.target.value, en: e.target.value }
                                };
                                updateFaqs(updated);
                              }}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none leading-relaxed"
                            />
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingFaqIndex(null);
                                showToast();
                              }}
                              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{isRtl ? 'تم الحفظ' : 'Done'}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              <span className="text-blue-400 font-mono text-xs">#{idx + 1}</span>
                              <span>{faq.question.ar}</span>
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed ps-5">
                              {faq.answer.ar}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingFaqIndex(idx)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title={isRtl ? 'تعديل السؤال' : 'Edit'}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {(config.faqs || []).length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (config.faqs || []).filter((_, i) => i !== idx);
                                  updateFaqs(updated);
                                  showToast(isRtl ? 'تم حذف السؤال' : 'FAQ removed');
                                }}
                                className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white transition-colors cursor-pointer"
                                title={isRtl ? 'حذف السؤال' : 'Delete'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: TESTIMONIALS */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-400" />
                      {isRtl ? 'إدارة آراء وتجارب المتدربين والخرجين' : 'Student Testimonials & Reviews'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {isRtl 
                        ? 'إضافة وتعديل تجارب الغواصين والخريجين الحقيقية مع كابتن فهد.'
                        : 'Manage verified student experiences and feedback quotes.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const current = config.testimonials || [];
                      const newT: Testimonial = {
                        id: `t-${Date.now()}`,
                        name: { ar: 'متدرب جديد', en: 'New Graduate' },
                        role: { ar: 'غواص مياه مفتوحة مرخص', en: 'Certified Diver' },
                        course: { ar: 'دورة غواص المياه المفتوحة', en: 'Open Water Diver' },
                        quote: { ar: 'تجربة تدريب استثنائية مع كابتن فهد تميزت بالصبر العالي والأمان.', en: 'Great diving experience!' },
                        date: { ar: '2026', en: '2026' },
                        avatarSeed: 'diver'
                      };
                      const updated = [...current, newT];
                      updateTestimonials(updated);
                      setEditingTestimonialIndex(updated.length - 1);
                      showToast(isRtl ? 'تمت إضافة رأي جديد، يمكنك تعديله بالأسفل' : 'New testimonial added');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 cursor-pointer transition-all self-start sm:self-auto shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isRtl ? 'إضافة رأي متدرب جديد' : 'Add Review'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(config.testimonials || []).map((testi, idx) => (
                    <div key={testi.id || idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                      {editingTestimonialIndex === idx ? (
                        <div className="space-y-2.5">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300">
                              {isRtl ? 'اسم المتدرب:' : 'Student Name:'}
                            </label>
                            <input
                              type="text"
                              value={testi.name.ar}
                              onChange={(e) => {
                                const updated = [...(config.testimonials || [])];
                                updated[idx] = {
                                  ...updated[idx],
                                  name: { ...updated[idx].name, ar: e.target.value, en: e.target.value }
                                };
                                updateTestimonials(updated);
                              }}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300">
                              {isRtl ? 'الدورة التدريبية التي تخرج منها:' : 'Graduated Course:'}
                            </label>
                            <input
                              type="text"
                              value={testi.course.ar}
                              onChange={(e) => {
                                const updated = [...(config.testimonials || [])];
                                updated[idx] = {
                                  ...updated[idx],
                                  course: { ...updated[idx].course, ar: e.target.value, en: e.target.value }
                                };
                                updateTestimonials(updated);
                              }}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300">
                              {isRtl ? 'نص التجربة أو الرأي:' : 'Quote / Review:'}
                            </label>
                            <textarea
                              rows={2}
                              value={testi.quote.ar}
                              onChange={(e) => {
                                const updated = [...(config.testimonials || [])];
                                updated[idx] = {
                                  ...updated[idx],
                                  quote: { ...updated[idx].quote, ar: e.target.value, en: e.target.value }
                                };
                                updateTestimonials(updated);
                              }}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingTestimonialIndex(null);
                              showToast();
                            }}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg cursor-pointer"
                          >
                            {isRtl ? 'حفظ' : 'Done'}
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-slate-200 italic leading-relaxed">
                            &ldquo;{testi.quote.ar}&rdquo;
                          </p>

                          <div className="pt-3 border-t border-slate-850 flex items-center justify-between mt-3 text-xs">
                            <div>
                              <div className="font-bold text-white text-xs">{testi.name.ar}</div>
                              <div className="text-[10px] text-blue-400 font-medium">{testi.course.ar}</div>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setEditingTestimonialIndex(idx)}
                                className="p-1 rounded-md bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white"
                                title={isRtl ? 'تعديل' : 'Edit'}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              {(config.testimonials || []).length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (config.testimonials || []).filter((_, i) => i !== idx);
                                    updateTestimonials(updated);
                                    showToast(isRtl ? 'تم حذف الرأي' : 'Review removed');
                                  }}
                                  className="p-1 rounded-md bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white"
                                  title={isRtl ? 'حذف' : 'Delete'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: BOOKINGS INBOX */}
            {activeTab === 'bookings' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Inbox className="w-5 h-5 text-blue-400" />
                      {isRtl ? 'صندوق طلبات الحجز والاستشارات الواردة' : 'Incoming Bookings & Consultation Inbox'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {isRtl 
                        ? 'متابعة المتدربين المسجلين عبر الموقع والتواصل المباشر معهم عبر الواتساب.'
                        : 'Review registered students and message them directly on WhatsApp.'}
                    </p>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                    <button
                      onClick={() => setBookingFilter('all')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        bookingFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isRtl ? `الكل (${bookings.length})` : `All (${bookings.length})`}
                    </button>
                    <button
                      onClick={() => setBookingFilter('new')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        bookingFilter === 'new' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isRtl ? `جديد (${newBookingsCount})` : `New (${newBookingsCount})`}
                    </button>
                    <button
                      onClick={() => setBookingFilter('contacted')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        bookingFilter === 'contacted' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isRtl ? 'تم التواصل' : 'Contacted'}
                    </button>
                  </div>
                </div>

                {filteredBookings.length === 0 ? (
                  <div className="text-center py-12 bg-slate-950/40 rounded-2xl border border-slate-800/80">
                    <Inbox className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <span className="text-sm font-semibold text-slate-300 block">
                      {isRtl ? 'لا توجد طلبات في هذا القسم حالياً' : 'No bookings in this filter'}
                    </span>
                    <span className="text-xs text-slate-500 mt-1 block">
                      {isRtl ? 'تصل هنا كافة الحجوزات المقدمة من خلال نافذة الحجز بالموقع.' : 'Incoming web bookings will appear here.'}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredBookings.map((b) => {
                      const cleanPhone = b.phone.replace(/[^0-9]/g, '');
                      const waLink = `https://wa.me/966${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent(
                        isRtl 
                          ? `أهلاً بك يا ${b.name}، معك كابتن فهد من مركز رواء الفن للغوص بخصوص طلبك المسجل (${b.interest}) رقم ${b.id}. يسعدني ترتيب مواعيد التدريب معك.`
                          : `Hello ${b.name}, this is Capt. Fahad from Riwa Alfan Dive Center regarding your inquiry (${b.interest}) ref ${b.id}.`
                      )}`;

                      return (
                        <div 
                          key={b.id} 
                          className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-900/60">
                                {b.id}
                              </span>
                              <span className="font-bold text-white text-sm">{b.name}</span>
                              <span className="text-xs text-slate-400 font-mono">({b.phone})</span>
                              
                              {/* Status badge */}
                              <select
                                value={b.status}
                                onChange={(e) => updateBookingStatus(b.id, e.target.value as any)}
                                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border outline-none cursor-pointer ${
                                  b.status === 'new' 
                                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                                    : b.status === 'contacted'
                                    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                                    : b.status === 'confirmed'
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                    : 'bg-slate-800 text-slate-400 border-slate-700'
                                }`}
                              >
                                <option value="new" className="bg-slate-900 text-white">{isRtl ? 'طلب جديد' : 'New'}</option>
                                <option value="contacted" className="bg-slate-900 text-white">{isRtl ? 'تم التواصل' : 'Contacted'}</option>
                                <option value="confirmed" className="bg-slate-900 text-white">{isRtl ? 'تم التأكيد' : 'Confirmed'}</option>
                                <option value="completed" className="bg-slate-900 text-white">{isRtl ? 'مكتمل' : 'Completed'}</option>
                              </select>
                            </div>

                            <div className="text-xs text-slate-300 flex flex-wrap gap-x-4 gap-y-1">
                              <span><strong className="text-slate-400">{isRtl ? 'البرنامج:' : 'Interest:'}</strong> {b.interest}</span>
                              <span><strong className="text-slate-400">{isRtl ? 'الخبرة:' : 'Experience:'}</strong> {b.experience}</span>
                              <span><strong className="text-slate-400">{isRtl ? 'الوقت:' : 'Timing:'}</strong> {b.timing}</span>
                            </div>

                            {b.notes && (
                              <p className="text-xs text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-850">
                                💬 {b.notes}
                              </p>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>{isRtl ? 'مراسلة واتساب' : 'WhatsApp'}</span>
                            </a>

                            <button
                              onClick={() => {
                                if (window.confirm(isRtl ? 'حذف هذا الحجز؟' : 'Delete this booking?')) {
                                  deleteBooking(b.id);
                                  showToast();
                                }
                              }}
                              className="p-2 rounded-xl bg-slate-900 hover:bg-red-600 text-slate-400 hover:text-white transition-colors cursor-pointer"
                              title={isRtl ? 'حذف' : 'Delete'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: SETTINGS & BACKUP */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-4xl">
                <div className="pb-4 border-b border-slate-800">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-400" />
                    {isRtl ? 'إعدادات الأمان والنسخ الاحتياطي' : 'Security & Backup Settings'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {isRtl 
                      ? 'تغيير الرمز السري للوحة التحكم، تصدير نسخة احتياطية من كافة البيانات، أو استيرادها.'
                      : 'Update admin PIN, export full backup JSON or restore.'}
                  </p>
                </div>

                {/* Change PIN */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-white block">
                    {isRtl ? 'تغيير الرمز السري للوحة التحكم (PIN):' : 'Change Admin Access PIN:'}
                  </span>
                  <div className="flex items-center gap-3">
                    <input 
                      type="password"
                      maxLength={8}
                      value={newPin}
                      onChange={(e) => {
                        setNewPin(e.target.value);
                        setPinFeedback(null);
                      }}
                      placeholder={isRtl ? 'الرمز الجديد (مثال: 5544)' : 'New PIN'}
                      className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono tracking-widest outline-none focus:border-blue-500 w-48"
                    />
                    <button
                      onClick={() => {
                        if (newPin.trim().length >= 4) {
                          updateAdminPin(newPin.trim());
                          setNewPin('');
                          setPinFeedback(isRtl ? 'تم تحديث الرمز السري بنجاح!' : 'PIN updated successfully!');
                          showToast(isRtl ? 'تم تحديث الرمز السري بنجاح!' : 'PIN updated successfully!');
                        } else {
                          setPinFeedback(isRtl ? 'الرمز يجب أن يتكون من 4 أرقام على الأقل' : 'PIN must be at least 4 digits');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer transition-colors"
                    >
                      {isRtl ? 'تحديث الرمز' : 'Update PIN'}
                    </button>
                  </div>
                  {pinFeedback && (
                    <span className="text-xs text-emerald-400 font-semibold block animate-in fade-in">
                      {pinFeedback}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500 block">
                    {isRtl ? 'الرمز الحالي الافتراضي هو: 1234' : 'Current default PIN is: 1234'}
                  </span>
                </div>

                {/* Backup & Export */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-white block">
                    {isRtl ? 'النسخ الاحتياطي للبيانات:' : 'Full Data Backup:'}
                  </span>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        const jsonStr = exportBackupJson();
                        const blob = new Blob([jsonStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `riwa-alfan-backup-${new Date().toISOString().slice(0, 10)}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Download className="w-4 h-4 text-blue-400" />
                      <span>{isRtl ? 'تنزيل ملف النسخة الاحتياطية (JSON)' : 'Download Backup File'}</span>
                    </button>

                    <button
                      onClick={() => setIsResetConfirmOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-900/50 text-red-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-red-400" />
                      <span>{isRtl ? 'استعادة ضبط المصنع' : 'Reset to Defaults'}</span>
                    </button>
                  </div>

                  {isResetConfirmOpen && (
                    <div className="mt-3 p-4 rounded-xl bg-red-950/30 border border-red-500/40 space-y-3 animate-in fade-in">
                      <div className="flex items-center gap-2 text-xs font-bold text-red-300">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span>{isRtl ? 'هل تريد بالتأكيد استعادة الإعدادات الأصلية وضبط المصنع؟' : 'Confirm factory reset?'}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        {isRtl ? 'سيتم مسح التعديلات والعودة للبيانات الأصلية.' : 'All local changes will be cleared and reset to initial settings.'}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            resetToDefaults();
                            setIsResetConfirmOpen(false);
                            window.location.reload();
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
                        >
                          {isRtl ? 'نعم، استعادة الآن' : 'Yes, Reset Now'}
                        </button>
                        <button
                          onClick={() => setIsResetConfirmOpen(false)}
                          className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                        >
                          {isRtl ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cloud & Hosting Integrations (Firebase & Vercel) */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <span className="text-xs font-bold text-white block">
                    {isRtl ? 'حالة الربط السحابي والاستضافة (Firebase & Vercel):' : 'Cloud Database & Hosting Integrations:'}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Firebase Card */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-xs font-bold text-white">Firebase Firestore</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                          {isRtl ? 'متصل ونشط' : 'Connected'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {isRtl 
                          ? 'قاعدة بيانات Firestore السحابية جاهزة، وتم نشر قواعد الحماية ومزامنة الحجوزات الواردة لحظياً.'
                          : 'Firestore database is active with security rules deployed and live booking synchronization.'}
                      </p>
                    </div>

                    {/* Vercel Card */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-blue-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                          <span className="text-xs font-bold text-white">Vercel Deployment</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
                          {isRtl ? 'مهيأ وجاهز' : 'Ready'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {isRtl 
                          ? 'ملف vercel.json مهيأ بتوجيه المسارات (SPA Rewrites)، والمشروع جاهز للرفع على Vercel أو GitHub مباشرة.'
                          : 'Configured with vercel.json SPA rewrites, ready to import directly on Vercel or GitHub.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
