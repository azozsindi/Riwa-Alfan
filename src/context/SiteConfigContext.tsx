import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SiteConfig, 
  BookingRecord, 
  CenterBrandConfig, 
  HeroConfig, 
  InstructorConfig, 
  FemaleInstructorConfig,
  AnnouncementConfig,
  Captain,
  PaymobPaymentConfig,
  VisibleSectionsConfig,
  SocialLinksConfig,
  LocationConfig,
  TrustBadgesConfig,
  UnderConstructionConfig,
  DesignContentConfig
} from '../types/admin';
import { Course, DiveSite, FAQItem, Testimonial } from '../data/divingData';
import { 
  DEFAULT_CONFIG, 
  DEFAULT_CAPTAINS,
  DEFAULT_VISIBLE_SECTIONS,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_LOCATION_CONFIG,
  DEFAULT_TRUST_BADGES,
  DEFAULT_UNDER_CONSTRUCTION,
  DEFAULT_DESIGN_CONTENT,
  INITIAL_DEMO_BOOKINGS, 
  CONFIG_STORAGE_KEY, 
  BOOKINGS_STORAGE_KEY 
} from '../data/defaultConfig';
import { applySiteFont } from '../utils/fontManager';
import {
  validateFirestoreConnection,
  subscribeToBookings,
  subscribeToSiteConfig,
  saveSiteConfigToFirestore,
  saveBookingToFirestore,
  updateBookingStatusInFirestore,
  deleteBookingFromFirestore
} from '../services/firestoreSync';

interface SiteConfigContextType {
  config: SiteConfig;
  bookings: BookingRecord[];
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  updateBrand: (partial: Partial<CenterBrandConfig>) => void;
  updateHero: (partial: Partial<HeroConfig>) => void;
  updateInstructor: (partial: Partial<InstructorConfig>) => void;
  updateFemaleInstructor: (partial: Partial<FemaleInstructorConfig>) => void;
  updateCaptains: (captains: Captain[]) => void;
  addCaptain: (captain: Omit<Captain, 'id'>) => void;
  updateCaptain: (captainId: string, updated: Partial<Captain>) => void;
  deleteCaptain: (captainId: string) => void;
  updatePaymentConfig: (partial: Partial<PaymobPaymentConfig>) => void;
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
  addBooking: (booking: Omit<BookingRecord, 'id' | 'createdAt'> & { status?: BookingRecord['status'] }) => string;
  updateBookingStatus: (id: string, status: BookingRecord['status']) => void;
  deleteBooking: (id: string) => void;
  clearAllBookings: () => void;
  resetToDefaults: () => void;
  exportBackupJson: () => string;
  importBackupJson: (jsonString: string) => boolean;
  restorePreviousPrices: () => boolean;
  updateVisibleSections: (partial: Partial<VisibleSectionsConfig>) => void;
  updateSocialLinks: (partial: Partial<SocialLinksConfig>) => void;
  updateLocationConfig: (partial: Partial<LocationConfig>) => void;
  updateTrustBadges: (partial: Partial<TrustBadgesConfig>) => void;
  updateUnderConstruction: (partial: Partial<UnderConstructionConfig>) => void;
  toggleUnderConstruction: () => void;
  updateDesignContent: (partial: Partial<DesignContentConfig>) => void;
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

      const hasCustomCourses = (coursesList: any[]): boolean => {
        if (!Array.isArray(coursesList) || coursesList.length === 0) return false;
        return coursesList.some(c => {
          const def = DEFAULT_CONFIG.courses.find(d => d.id === c.id);
          if (!def) return true;
          return def.price?.ar !== c.price?.ar || def.price?.en !== c.price?.en;
        });
      };

      let v12Config: any = null;
      const v12Raw = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (v12Raw) {
        try {
          v12Config = JSON.parse(v12Raw);
        } catch {}
      }

      let recoveredCourses: Course[] | null = null;
      let recoveredBrand: any = null;
      let recoveredAnnouncement: any = null;

      if (!v12Config || !hasCustomCourses(v12Config.courses)) {
        for (const k of olderKeys) {
          const raw = localStorage.getItem(k);
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              if (parsed) {
                if (!recoveredCourses && hasCustomCourses(parsed.courses)) {
                  recoveredCourses = parsed.courses;
                }
                if (!recoveredBrand && parsed.brand) {
                  recoveredBrand = parsed.brand;
                }
                if (!recoveredAnnouncement && parsed.announcement) {
                  recoveredAnnouncement = parsed.announcement;
                }
              }
            } catch {}
          }
          if (recoveredCourses) break;
        }
      }

      const base = v12Config || {};
      const isOffersExplicitlyDisabled = localStorage.getItem('riwa_offers_explicitly_disabled') === 'true';

      const initialAnnouncement = {
        ...DEFAULT_CONFIG.announcement,
        ...(base.announcement || recoveredAnnouncement || {}),
        enabled: isOffersExplicitlyDisabled 
          ? false 
          : (base.announcement?.enabled !== undefined ? base.announcement.enabled : false)
      };

      return {
        ...DEFAULT_CONFIG,
        ...base,
        brand: { ...DEFAULT_CONFIG.brand, ...(base.brand || recoveredBrand || {}), email: 'Riwaalfan@gmail.com' },
        trustBadges: {
          ...DEFAULT_TRUST_BADGES,
          ...(base.trustBadges || {}),
          partnerLogos: (base.trustBadges?.partnerLogos && base.trustBadges.partnerLogos.length > 0)
            ? base.trustBadges.partnerLogos
            : DEFAULT_TRUST_BADGES.partnerLogos,
          certificates: (base.trustBadges?.certificates && base.trustBadges.certificates.length > 0)
            ? base.trustBadges.certificates
            : DEFAULT_TRUST_BADGES.certificates
        },
        hero: { ...DEFAULT_CONFIG.hero, ...(base.hero || {}) },
        instructor: { ...DEFAULT_CONFIG.instructor, ...(base.instructor || {}), photoUrl: '' },
        femaleInstructor: { ...(DEFAULT_CONFIG.femaleInstructor || {}), ...(base.femaleInstructor || {}), photoUrl: '' },
        captains: Array.isArray(base.captains) && base.captains.length > 0 ? base.captains : DEFAULT_CAPTAINS,
        payment: { ...(DEFAULT_CONFIG.payment || {}), ...(base.payment || {}) },
        announcement: initialAnnouncement,
        courses: recoveredCourses || (Array.isArray(base.courses) && base.courses.length > 0 ? base.courses : DEFAULT_CONFIG.courses),
        diveSites: Array.isArray(base.diveSites) && base.diveSites.length > 0 ? base.diveSites : DEFAULT_CONFIG.diveSites,
        faqs: Array.isArray(base.faqs) && base.faqs.length > 0 ? base.faqs : DEFAULT_CONFIG.faqs,
        testimonials: Array.isArray(base.testimonials) && base.testimonials.length > 0 ? base.testimonials : DEFAULT_CONFIG.testimonials,
        designContent: {
          ...DEFAULT_DESIGN_CONTENT,
          ...(base.designContent || {})
        }
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
    validateFirestoreConnection();
  }, []);

  // Real-time Firestore sync for Bookings
  useEffect(() => {
    const unsub = subscribeToBookings((remoteBookings) => {
      setBookings(remoteBookings);
    });
    return () => unsub();
  }, []);

  // Apply typography to document body dynamically
  useEffect(() => {
    applySiteFont(config.brand.fontFamily);
  }, [config.brand.fontFamily]);

  // Dynamically update browser tab favicon when logo changes
  useEffect(() => {
    try {
      if (typeof document !== 'undefined') {
        const isCustom = config.brand.logoType === 'custom-image' && !!config.brand.customLogoUrl;
        const iconUrl = isCustom ? config.brand.customLogoUrl : '/padi-logo.svg';
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        if (iconUrl) {
          link.href = iconUrl;
        }
      }
    } catch (e) {
      console.warn('Favicon update note:', e);
    }
  }, [config.brand.logoType, config.brand.customLogoUrl]);

  // Real-time Firestore sync for Site Config
  useEffect(() => {
    const unsub = subscribeToSiteConfig((remoteData) => {
      setConfig(prev => {
        const isExplicitlyDisabled = localStorage.getItem('riwa_offers_explicitly_disabled') === 'true';
        let updatedAnnouncement = prev.announcement;

        if (remoteData.announcement) {
          updatedAnnouncement = {
            ...prev.announcement,
            ...remoteData.announcement,
            enabled: isExplicitlyDisabled 
              ? false 
              : (remoteData.announcement.enabled !== undefined ? remoteData.announcement.enabled : prev.announcement.enabled)
          };
        } else if (isExplicitlyDisabled) {
          updatedAnnouncement = { ...prev.announcement, enabled: false };
        }

        return {
          ...prev,
          ...remoteData,
          announcement: updatedAnnouncement,
          trustBadges: {
            ...DEFAULT_TRUST_BADGES,
            ...(prev.trustBadges || {}),
            ...(remoteData.trustBadges || {}),
            partnerLogos: (remoteData.trustBadges?.partnerLogos && remoteData.trustBadges.partnerLogos.length > 0)
              ? remoteData.trustBadges.partnerLogos
              : (prev.trustBadges?.partnerLogos && prev.trustBadges.partnerLogos.length > 0)
                ? prev.trustBadges.partnerLogos
                : DEFAULT_TRUST_BADGES.partnerLogos,
            certificates: (remoteData.trustBadges?.certificates && remoteData.trustBadges.certificates.length > 0)
              ? remoteData.trustBadges.certificates
              : (prev.trustBadges?.certificates && prev.trustBadges.certificates.length > 0)
                ? prev.trustBadges.certificates
                : DEFAULT_TRUST_BADGES.certificates
          },
          brand: {
            ...prev.brand,
            ...(remoteData.brand || {}),
            email: 'Riwaalfan@gmail.com'
          },
          designContent: {
            ...DEFAULT_DESIGN_CONTENT,
            ...(prev.designContent || {}),
            ...(remoteData.designContent || {})
          }
        };
      });
    });
    return () => unsub();
  }, []);

  // Sync config to localStorage and Firestore
  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
      localStorage.setItem('riwa_alfan_site_config_v11', JSON.stringify(config));
      saveSiteConfigToFirestore(config);
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

  const updateFemaleInstructor = (partial: Partial<FemaleInstructorConfig>) => {
    setConfig(prev => ({
      ...prev,
      femaleInstructor: { ...(prev.femaleInstructor || DEFAULT_CONFIG.femaleInstructor!), ...partial }
    }));
  };

  const updateCaptains = (captains: Captain[]) => {
    setConfig(prev => ({ ...prev, captains }));
  };

  const addCaptain = (captainData: Omit<Captain, 'id'>) => {
    const newId = `captain-${Date.now()}`;
    const newCap: Captain = { ...captainData, id: newId };
    setConfig(prev => ({
      ...prev,
      captains: [...(prev.captains || DEFAULT_CAPTAINS), newCap]
    }));
  };

  const updateCaptain = (captainId: string, updated: Partial<Captain>) => {
    setConfig(prev => ({
      ...prev,
      captains: (prev.captains || DEFAULT_CAPTAINS).map(c => 
        c.id === captainId ? { ...c, ...updated } : c
      )
    }));
  };

  const deleteCaptain = (captainId: string) => {
    setConfig(prev => ({
      ...prev,
      captains: (prev.captains || DEFAULT_CAPTAINS).filter(c => c.id !== captainId)
    }));
  };

  const updatePaymentConfig = (partial: Partial<PaymobPaymentConfig>) => {
    setConfig(prev => ({
      ...prev,
      payment: { ...(prev.payment || DEFAULT_CONFIG.payment!), ...partial }
    }));
  };

  const updateAnnouncement = (partial: Partial<AnnouncementConfig>) => {
    setConfig(prev => {
      const nextAnnouncement = { ...prev.announcement, ...partial };
      try {
        if (nextAnnouncement.enabled === false) {
          localStorage.setItem('riwa_offers_explicitly_disabled', 'true');
          localStorage.setItem('riwa_announcement_dismissed', 'true');
        } else if (nextAnnouncement.enabled === true) {
          localStorage.setItem('riwa_offers_explicitly_disabled', 'false');
          localStorage.removeItem('riwa_announcement_dismissed');
        }
      } catch {}
      const updatedConfig = {
        ...prev,
        announcement: nextAnnouncement
      };
      saveSiteConfigToFirestore(updatedConfig);
      return updatedConfig;
    });
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

  const updateVisibleSections = (partial: Partial<VisibleSectionsConfig>) => {
    setConfig(prev => ({
      ...prev,
      visibleSections: { ...(prev.visibleSections || DEFAULT_VISIBLE_SECTIONS), ...partial }
    }));
  };

  const updateSocialLinks = (partial: Partial<SocialLinksConfig>) => {
    setConfig(prev => ({
      ...prev,
      socialLinks: { ...(prev.socialLinks || DEFAULT_SOCIAL_LINKS), ...partial }
    }));
  };

  const updateLocationConfig = (partial: Partial<LocationConfig>) => {
    setConfig(prev => ({
      ...prev,
      locationConfig: { ...(prev.locationConfig || DEFAULT_LOCATION_CONFIG), ...partial }
    }));
  };

  const updateTrustBadges = (partial: Partial<TrustBadgesConfig>) => {
    setConfig(prev => ({
      ...prev,
      trustBadges: { ...(prev.trustBadges || DEFAULT_TRUST_BADGES), ...partial }
    }));
  };

  const updateUnderConstruction = (partial: Partial<UnderConstructionConfig>) => {
    setConfig(prev => {
      const current = prev.underConstruction || DEFAULT_UNDER_CONSTRUCTION;
      const nextUnderConstruction = { ...current, ...partial };
      const updatedConfig = {
        ...prev,
        underConstruction: nextUnderConstruction
      };
      saveSiteConfigToFirestore(updatedConfig);
      return updatedConfig;
    });
  };

  const toggleUnderConstruction = () => {
    setConfig(prev => {
      const current = prev.underConstruction || DEFAULT_UNDER_CONSTRUCTION;
      const nextUnderConstruction = { ...current, enabled: !current.enabled };
      const updatedConfig = {
        ...prev,
        underConstruction: nextUnderConstruction
      };
      saveSiteConfigToFirestore(updatedConfig);
      return updatedConfig;
    });
  };

  const updateDesignContent = (partial: Partial<DesignContentConfig>) => {
    setConfig(prev => {
      const updatedDesign = { ...(prev.designContent || DEFAULT_DESIGN_CONTENT), ...partial };
      const updatedConfig = {
        ...prev,
        designContent: updatedDesign
      };
      saveSiteConfigToFirestore(updatedConfig);
      return updatedConfig;
    });
  };

  const addBooking = (bookingData: Omit<BookingRecord, 'id' | 'createdAt'> & { status?: BookingRecord['status'] }) => {
    const id = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: BookingRecord = {
      ...bookingData,
      status: bookingData.status || 'new',
      id,
      createdAt: new Date().toISOString()
    };
    setBookings(prev => [newRecord, ...prev]);
    saveBookingToFirestore(newRecord);
    return id;
  };

  const updateBookingStatus = (id: string, status: BookingRecord['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    updateBookingStatusInFirestore(id, status);
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    deleteBookingFromFirestore(id);
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
      updateFemaleInstructor,
      updateCaptains,
      addCaptain,
      updateCaptain,
      deleteCaptain,
      updatePaymentConfig,
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
      restorePreviousPrices,
      updateVisibleSections,
      updateSocialLinks,
      updateLocationConfig,
      updateTrustBadges,
      updateUnderConstruction,
      toggleUnderConstruction,
      updateDesignContent
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
