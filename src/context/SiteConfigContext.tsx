import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteConfig, BookingRecord, CenterBrandConfig, HeroConfig, InstructorConfig, AnnouncementConfig } from '../types/admin';
import { COURSES_DATA, DIVE_SITES, INSTRUCTOR_INFO, FAQS, TESTIMONIALS, Course, DiveSite, FAQItem, Testimonial } from '../data/divingData';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot, 
  getDoc,
  getDocFromServer 
} from 'firebase/firestore';

const CONFIG_STORAGE_KEY = 'riwa_alfan_site_config_v12';
const BOOKINGS_STORAGE_KEY = 'riwa_alfan_bookings_v12';

const DEFAULT_CONFIG: SiteConfig = {
  brand: {
    centerNameAr: 'رواء الفن',
    centerNameEn: 'Riwa Alfan',
    subtitleAr: 'دورات تدريب الغوص المعتمدة · كابتن فهد الهويملي PADI',
    subtitleEn: 'Certified PADI Diving Training',
    logoType: 'vector',
    customLogoUrl: '',
    logoText: 'RIWA ALFAN',
    logoSubtext: 'رواء الفن',
    phone: '+966530549675',
    whatsappNumber: '966530549675',
    email: 'Riwaalfan@gmail.com',
    city: 'جدة',
    locationAr: 'جدة - ساحل البحر الأحمر، المملكة العربية السعودية',
    locationEn: 'Jeddah - Red Sea Coast, Saudi Arabia',
    padiNumber: 'PADI OWSI #482910'
  },
  hero: {
    badgeAr: 'رواء الفن بجدة · PADI Open Water Scuba Instructor (OWSI)',
    badgeEn: 'Riwa Alfan in Jeddah · PADI Open Water Scuba Instructor (OWSI)',
    headlineAr: 'اكتشف أسرار عالم الغوص في ',
    headlineHighlightAr: 'البحر الأحمر',
    headlineEn: 'Discover the Secrets of Diving in the ',
    headlineHighlightEn: 'Red Sea',
    subheadAr: 'رحلتك من الصفر وحتى الاحتراف مع كابتن فهد الهويملي في رواء الفن بجدة. تدريب شخصي صبور بأعلى معايير السلامة العالمية، دورات PADI المعتمدة، ورحلات بحرية دورية لاستكشاف أجمل شِعاب وحطام سفن جدة التاريخية.',
    subheadEn: 'Your journey from beginner to certified dive professional with Capt. Fahad Al-Huwaimli at Riwa Alfan in Jeddah. Combining patient coaching, top-tier international safety standards, accredited PADI certifications, and regular Jeddah boat expeditions.',
    showStats: true,
    divesStat: '1,450+',
    divesLabelAr: 'عدد الغوصات الموثقة',
    divesLabelEn: 'Logged Dives',
    studentsStat: '520+',
    studentsLabelAr: 'عدد الغواصين الخريجين',
    studentsLabelEn: 'Certified Students',
    safetyStat: '100%',
    safetyLabelAr: 'سجل الأمان والسلامة',
    safetyLabelEn: 'Safety Record'
  },
  instructor: {
    nameAr: 'كابتن فهد الهويملي',
    nameEn: 'Capt. Fahad Al-Huwaimli',
    titleAr: 'PADI Open Water Scuba Instructor (OWSI)',
    titleEn: 'PADI Open Water Scuba Instructor (OWSI)',
    accreditationAr: 'مدرب معتمد دولياً لدى منظمة PADI (OWSI)',
    accreditationEn: 'Internationally Certified PADI OWSI Instructor',
    bioAr: 'مدرب غوص سعودي شغوف بأعماق البحر الأحمر لأكثر من عقد من الزمان. نؤمن بأن الغوص ليس مجرد رياضة، بل رحلة استكشاف وتأمل وتناغم تام مع الطبيعة. نلتزم بأعلى معايير السلامة الدولية وأسلوب تدريب صبور ومحفز يزيل أي توتر ويمنح المتدرب ثقة مطلقة تحت الماء.',
    bioEn: 'A passionate Saudi diving instructor immersed in the depths of the Red Sea for over a decade. We believe diving is not merely a sport, but a transformative journey of exploration, contemplation, and complete harmony with nature. Committed to the highest international safety standards with a patient, empowering coaching methodology.',
    quoteAr: 'البحر لا يُعلّمنا فقط كيف نتنفس تحت الماء، بل يُعلّمنا كيف نهدأ ونتأمل ونثق بأنفسنا في عالم أزرق ساحر.',
    quoteEn: 'The sea does not merely teach us to breathe underwater; it teaches us serenity, mindfulness, and unbreakable inner trust.',
    padiMemberNumber: 'PADI OWSI Member #482910',
    owsiNumber: 'PADI Open Water Scuba Instructor (OWSI #482910)',
    danNumber: 'عضو معتمد في شبكة تنبيه الغواصين (DAN Europe / World)',
    efrNumber: 'مدرب معتمد للإسعافات الأولية والإنعاش القلبي (EFR Instructor)',
    certificatesListAr: [
      'PADI MSDT Member #482910',
      'PADI Open Water Scuba Instructor (OWSI)',
      'عضو معتمد في شبكة تنبيه الغواصين (DAN Europe / World)',
      'مدرب معتمد للإسعافات الأولية والإنعاش القلبي (EFR Instructor)'
    ],
    certificatesListEn: [
      'PADI MSDT Member #482910',
      'PADI Open Water Scuba Instructor (OWSI)',
      'Certified Member - Divers Alert Network (DAN Europe / World)',
      'Certified Emergency First Response (EFR) & CPR Instructor'
    ],
    experienceYears: '10+ سنوات خبرة',
    photoUrl: '',
    specialtiesAr: [
      'مدرب غوص المياه المفتوحة والمتقدم (PADI OW & AOW)',
      'مدرب تخصص الهواء المخصب النيتروكس (Enriched Air Nitrox EANx)',
      'مدرب غوص الأعماق والغوص الليلي (Deep & Night Diver)',
      'مدرب الإسعافات الأولية والإنعاش القلبي الرئوي (EFR & CPR)',
      'مدرب طفو احترافي وحماية البيئة البحرية (Peak Buoyancy)',
      'تنظيم رحلات السفاري البحرية واليخوت بجدة'
    ],
    specialtiesEn: [
      'PADI Open Water & Advanced Scuba Instructor',
      'Enriched Air Nitrox (EANx) Specialty Instructor',
      'Deep Diver & Night Diver Specialty Instructor',
      'Emergency First Response (EFR) & CPR Instructor',
      'Peak Performance Buoyancy & Marine Conservation',
      'Jeddah Boat Expeditions & Liveaboard Organizer'
    ]
  },
  announcement: {
    enabled: true,
    badgeAr: 'عرض خاص بجدة',
    badgeEn: 'Jeddah Special Offer',
    textAr: 'خصم خاص 20% على دورة غواص المياه المفتوحة (Open Water) للحجوزات المبكرة هذا الشهر!',
    textEn: 'Special 20% OFF on PADI Open Water Course for early bird bookings this month!',
    ctaTextAr: 'احجز العرض الآن',
    ctaTextEn: 'Claim Offer Now',
    discountPercentage: 20,
    highlightCourseId: 'open-water'
  },
  courses: COURSES_DATA,
  diveSites: DIVE_SITES,
  faqs: FAQS,
  testimonials: TESTIMONIALS,
  adminPin: '1234'
};

const INITIAL_DEMO_BOOKINGS: BookingRecord[] = [
  {
    id: 'BK-1082',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    name: 'سعود بن ناصر العتيبي',
    phone: '0555123456',
    interest: 'دورة غواص المياه المفتوحة (Open Water)',
    experience: 'مبتدئ تماماً (أول مرة)',
    timing: 'عطلة نهاية الأسبوع (خميس/جمعة/سبت)',
    notes: 'أرغب ببدء التدريب العملي في شرم أبحر الأسبوع القادم إن أمكن.',
    status: 'new'
  },
  {
    id: 'BK-1079',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    name: 'سارة خالد المنصور',
    phone: '0509876543',
    interest: 'دورة غواص المياه المفتوحة المتقدم (Advanced)',
    experience: 'غواص مياه مفتوحة مرخص',
    timing: 'أيام الأسبوع (فترات مسائية)',
    notes: 'معي رخصة أوبن واتر سابقة وأرغب بالتأهيل للغوص العميق حتى 30 متر.',
    status: 'contacted'
  }
];

interface SiteConfigContextType {
  config: SiteConfig;
  bookings: BookingRecord[];
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  updateBrand: (partial: Partial<CenterBrandConfig>) => void;
  updateHero: (partial: Partial<HeroConfig>) => void;
  updateInstructor: (partial: Partial<InstructorConfig>) => void;
  updateAnnouncement: (partial: Partial<AnnouncementConfig>) => void;
  updateCourses: (courses: Course[]) => void;
  updateCourse: (courseId: string, updated: Partial<Course>) => void;
  addCourse: (newCourse: Course) => void;
  deleteCourse: (courseId: string) => void;
  updateDiveSites: (sites: DiveSite[]) => void;
  updateDiveSite: (siteId: string, updated: Partial<DiveSite>) => void;
  addDiveSite: (newSite: DiveSite) => void;
  deleteDiveSite: (siteId: string) => void;
  updateFaqs: (faqs: FAQItem[]) => void;
  updateTestimonials: (testimonials: Testimonial[]) => void;
  addBooking: (booking: Omit<BookingRecord, 'id' | 'createdAt' | 'status'>) => string;
  updateBookingStatus: (id: string, status: BookingRecord['status']) => void;
  deleteBooking: (id: string) => void;
  clearAllBookings: () => void;
  resetToDefaults: () => void;
  exportBackupJson: () => string;
  importBackupJson: (jsonString: string) => boolean;
  verifyPin: (pin: string) => boolean;
  updateAdminPin: (newPin: string) => void;
  restorePreviousPrices: () => boolean;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const olderKeys = [
        'riwa_alfan_site_config_v11',
        'riwa_alfan_site_config_v10',
        'riwa_alfan_site_config_v9',
        'riwa_alfan_site_config_v8',
        'riwa_alfan_site_config_v7',
        'riwa_alfan_site_config_v6',
        'riwa_alfan_site_config_v5',
        'riwa_alfan_site_config_v4',
        'riwa_alfan_site_config_v3',
        'riwa_alfan_site_config_v2',
        'riwa_alfan_site_config_v1',
        'riwa_alfan_site_config'
      ];

      // Check if courses list has customized prices
      const hasCustomCourses = (coursesList: any[]): boolean => {
        if (!Array.isArray(coursesList) || coursesList.length === 0) return false;
        return coursesList.some(c => {
          const def = DEFAULT_CONFIG.courses.find(d => d.id === c.id);
          if (!def) return true; // custom course added by captain
          return def.price?.ar !== c.price?.ar || def.price?.en !== c.price?.en;
        });
      };

      // Check v12 first
      let v12Config: any = null;
      const v12Raw = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (v12Raw) {
        try {
          v12Config = JSON.parse(v12Raw);
        } catch {}
      }

      // Check if older version has user-customized courses & prices
      let recoveredCourses: Course[] | null = null;
      let recoveredBrand: any = null;
      let recoveredAnnouncement: any = null;

      if (v12Config && hasCustomCourses(v12Config.courses)) {
        recoveredCourses = v12Config.courses;
      } else {
        // Search previous storage keys (v11, v10, etc.)
        for (const k of olderKeys) {
          const raw = localStorage.getItem(k);
          if (raw) {
            try {
              const p = JSON.parse(raw);
              if (p) {
                if (!recoveredCourses && hasCustomCourses(p.courses)) {
                  recoveredCourses = p.courses;
                }
                if (!recoveredBrand && p.brand) {
                  recoveredBrand = p.brand;
                }
                if (!recoveredAnnouncement && p.announcement) {
                  recoveredAnnouncement = p.announcement;
                }
              }
            } catch {}
          }
        }
      }

      const base = v12Config || {};

      return {
        ...DEFAULT_CONFIG,
        ...base,
        brand: { 
          ...DEFAULT_CONFIG.brand, 
          ...(base.brand || recoveredBrand || {}),
          email: 'Riwaalfan@gmail.com'
        },
        hero: { ...DEFAULT_CONFIG.hero, ...(base.hero || {}) },
        instructor: { ...DEFAULT_CONFIG.instructor, ...(base.instructor || {}) },
        announcement: { ...DEFAULT_CONFIG.announcement, ...(base.announcement || recoveredAnnouncement || {}) },
        courses: recoveredCourses || (Array.isArray(base.courses) && base.courses.length > 0 ? base.courses : DEFAULT_CONFIG.courses),
        diveSites: Array.isArray(base.diveSites) && base.diveSites.length > 0 ? base.diveSites : DEFAULT_CONFIG.diveSites,
        faqs: Array.isArray(base.faqs) && base.faqs.length > 0 ? base.faqs : DEFAULT_CONFIG.faqs,
        testimonials: Array.isArray(base.testimonials) && base.testimonials.length > 0 ? base.testimonials : DEFAULT_CONFIG.testimonials
      };
    } catch (e) {
      console.error('Failed to load site config from storage:', e);
    }
    return DEFAULT_CONFIG;
  });

  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load bookings from storage:', e);
    }
    return INITIAL_DEMO_BOOKINGS;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Validate Connection to Firestore on boot
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'settings', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.warn("Firestore client is offline.");
        }
      }
    }
    testConnection();
  }, []);

  // Real-time Firestore sync for Bookings
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'bookings'), (snapshot) => {
        if (!snapshot.empty) {
          const list: BookingRecord[] = [];
          snapshot.forEach(d => {
            const data = d.data() as BookingRecord;
            if (data && data.id) {
              list.push(data);
            }
          });
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setBookings(list);
        }
      }, (err) => {
        console.warn('Firestore bookings snapshot error:', err);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Firestore sync failed to initialize:', e);
    }
  }, []);

  // Real-time Firestore sync for Site Config (Cloud persistence across devices)
  useEffect(() => {
    try {
      const configDocRef = doc(db, 'settings', 'site_config');
      const unsub = onSnapshot(configDocRef, (snap) => {
        if (snap.exists()) {
          const remoteData = snap.data() as Partial<SiteConfig>;
          if (remoteData && remoteData.courses && remoteData.courses.length > 0) {
            setConfig(prev => ({
              ...prev,
              ...remoteData,
              brand: {
                ...prev.brand,
                ...(remoteData.brand || {}),
                email: 'Riwaalfan@gmail.com'
              }
            }));
          }
        }
      }, (err) => {
        console.warn('Firestore site_config snapshot notice:', err);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Firestore site_config sync notice:', e);
    }
  }, []);

  // Sync config to localStorage and Firestore
  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
      localStorage.setItem('riwa_alfan_site_config_v11', JSON.stringify(config));
      
      // Save to Firestore settings
      const configDocRef = doc(db, 'settings', 'site_config');
      setDoc(configDocRef, config, { merge: true }).catch(err => {
        console.warn('Firestore setDoc site_config notice:', err);
      });
    } catch (e) {
      console.error('Failed to save site config:', e);
    }
  }, [config]);

  // Sync bookings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save bookings:', e);
    }
  }, [bookings]);

  const updateBrand = (partial: Partial<CenterBrandConfig>) => {
    setConfig(prev => ({
      ...prev,
      brand: { ...prev.brand, ...partial }
    }));
  };

  const updateHero = (partial: Partial<HeroConfig>) => {
    setConfig(prev => ({
      ...prev,
      hero: { ...prev.hero, ...partial }
    }));
  };

  const updateInstructor = (partial: Partial<InstructorConfig>) => {
    setConfig(prev => ({
      ...prev,
      instructor: { ...prev.instructor, ...partial }
    }));
  };

  const updateAnnouncement = (partial: Partial<AnnouncementConfig>) => {
    setConfig(prev => ({
      ...prev,
      announcement: { ...prev.announcement, ...partial }
    }));
  };

  const updateCourses = (courses: Course[]) => {
    setConfig(prev => ({ ...prev, courses }));
  };

  const updateCourse = (courseId: string, updated: Partial<Course>) => {
    setConfig(prev => ({
      ...prev,
      courses: prev.courses.map(c => c.id === courseId ? { ...c, ...updated } : c)
    }));
  };

  const addCourse = (newCourse: Course) => {
    setConfig(prev => ({
      ...prev,
      courses: [...prev.courses, newCourse]
    }));
  };

  const deleteCourse = (courseId: string) => {
    setConfig(prev => ({
      ...prev,
      courses: prev.courses.filter(c => c.id !== courseId)
    }));
  };

  const updateDiveSites = (sites: DiveSite[]) => {
    setConfig(prev => ({ ...prev, diveSites: sites }));
  };

  const updateDiveSite = (siteId: string, updated: Partial<DiveSite>) => {
    setConfig(prev => ({
      ...prev,
      diveSites: prev.diveSites.map(s => s.id === siteId ? { ...s, ...updated } : s)
    }));
  };

  const addDiveSite = (newSite: DiveSite) => {
    setConfig(prev => ({
      ...prev,
      diveSites: [...prev.diveSites, newSite]
    }));
  };

  const deleteDiveSite = (siteId: string) => {
    setConfig(prev => ({
      ...prev,
      diveSites: prev.diveSites.filter(s => s.id !== siteId)
    }));
  };

  const updateFaqs = (faqs: FAQItem[]) => {
    setConfig(prev => ({ ...prev, faqs }));
  };

  const updateTestimonials = (testimonials: Testimonial[]) => {
    setConfig(prev => ({ ...prev, testimonials }));
  };

  const addBooking = (bookingData: Omit<BookingRecord, 'id' | 'createdAt' | 'status'>) => {
    const id = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: BookingRecord = {
      ...bookingData,
      id,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    setBookings(prev => [newRecord, ...prev]);

    // Async sync with Firestore cloud database
    try {
      setDoc(doc(db, 'bookings', id), newRecord).catch(err => {
        console.warn('Firestore booking sync notice:', err);
      });
    } catch (e) {
      console.warn('Firestore save notice:', e);
    }

    return id;
  };

  const updateBookingStatus = (id: string, status: BookingRecord['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    try {
      updateDoc(doc(db, 'bookings', id), { status }).catch(err => {
        console.warn('Firestore status update notice:', err);
      });
    } catch (e) {
      console.warn('Firestore update notice:', e);
    }
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    try {
      deleteDoc(doc(db, 'bookings', id)).catch(err => {
        console.warn('Firestore delete notice:', err);
      });
    } catch (e) {
      console.warn('Firestore delete notice:', e);
    }
  };

  const clearAllBookings = () => {
    setBookings([]);
  };

  const resetToDefaults = () => {
    setConfig(DEFAULT_CONFIG);
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  };

  const exportBackupJson = () => {
    return JSON.stringify({ config, bookings, exportedAt: new Date().toISOString() }, null, 2);
  };

  const importBackupJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.config && parsed.config.brand) {
        setConfig(parsed.config);
        if (Array.isArray(parsed.bookings)) {
          setBookings(parsed.bookings);
        }
        return true;
      }
    } catch (e) {
      console.error('Import error:', e);
    }
    return false;
  };

  const verifyPin = (pin: string) => {
    return (pin || '').trim() === (config.adminPin || '1234').trim();
  };

  const updateAdminPin = (newPin: string) => {
    setConfig(prev => ({ ...prev, adminPin: newPin }));
  };

  const restorePreviousPrices = (): boolean => {
    try {
      const olderKeys = [
        'riwa_alfan_site_config_v11',
        'riwa_alfan_site_config_v10',
        'riwa_alfan_site_config_v9',
        'riwa_alfan_site_config_v8',
        'riwa_alfan_site_config_v7',
        'riwa_alfan_site_config_v6',
        'riwa_alfan_site_config_v5',
        'riwa_alfan_site_config_v4',
        'riwa_alfan_site_config_v3',
        'riwa_alfan_site_config_v2',
        'riwa_alfan_site_config_v1',
        'riwa_alfan_site_config'
      ];
      for (const k of olderKeys) {
        const raw = localStorage.getItem(k);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.courses) && parsed.courses.length > 0) {
            setConfig(prev => ({
              ...prev,
              courses: parsed.courses
            }));
            return true;
          }
        }
      }
    } catch (e) {
      console.error('Failed to restore previous prices:', e);
    }
    return false;
  };

  return (
    <SiteConfigContext.Provider value={{
      config,
      bookings,
      isAdminOpen,
      setIsAdminOpen,
      updateBrand,
      updateHero,
      updateInstructor,
      updateAnnouncement,
      updateCourses,
      updateCourse,
      addCourse,
      deleteCourse,
      updateDiveSites,
      updateDiveSite,
      addDiveSite,
      deleteDiveSite,
      updateFaqs,
      updateTestimonials,
      addBooking,
      updateBookingStatus,
      deleteBooking,
      clearAllBookings,
      resetToDefaults,
      exportBackupJson,
      importBackupJson,
      verifyPin,
      updateAdminPin,
      restorePreviousPrices
    }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
};
