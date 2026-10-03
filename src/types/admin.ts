import { Course, DiveSite, FAQItem, Testimonial } from '../data/divingData';

export interface CenterBrandConfig {
  centerNameAr: string;
  centerNameEn: string;
  subtitleAr: string;
  subtitleEn: string;
  logoType: 'vector' | 'custom-image';
  customLogoUrl?: string;
  logoText: string;
  logoSubtext: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  city: string;
  locationAr: string;
  locationEn: string;
  padiNumber: string;
}

export interface HeroConfig {
  badgeAr: string;
  badgeEn: string;
  headlineAr: string;
  headlineHighlightAr: string;
  headlineEn: string;
  headlineHighlightEn: string;
  subheadAr: string;
  subheadEn: string;
  showStats: boolean;
  divesStat: string;
  divesLabelAr?: string;
  divesLabelEn?: string;
  studentsStat: string;
  studentsLabelAr?: string;
  studentsLabelEn?: string;
  safetyStat: string;
  safetyLabelAr?: string;
  safetyLabelEn?: string;
}

export interface InstructorConfig {
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  accreditationAr: string;
  accreditationEn: string;
  bioAr: string;
  bioEn: string;
  quoteAr: string;
  quoteEn: string;
  padiMemberNumber: string;
  owsiNumber: string;
  danNumber: string;
  efrNumber: string;
  certificatesListAr: string[];
  certificatesListEn: string[];
  experienceYears: string;
  photoUrl?: string;
  specialtiesAr: string[];
  specialtiesEn: string[];
}

export interface AnnouncementConfig {
  enabled: boolean;
  badgeAr: string;
  badgeEn: string;
  textAr: string;
  textEn: string;
  ctaTextAr: string;
  ctaTextEn: string;
  discountPercentage?: number;
  highlightCourseId?: string;
}

export interface BookingRecord {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  interest: string;
  experience: string;
  timing: string;
  notes?: string;
  status: 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';
}

export interface SiteConfig {
  brand: CenterBrandConfig;
  hero: HeroConfig;
  instructor: InstructorConfig;
  announcement: AnnouncementConfig;
  courses: Course[];
  diveSites: DiveSite[];
  faqs: FAQItem[];
  testimonials: Testimonial[];
  adminPin: string;
}
