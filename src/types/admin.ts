import { Course, DiveSite, FAQItem, Testimonial } from '../data/divingData';

export interface CenterBrandConfig {
  centerNameAr: string;
  centerNameEn: string;
  subtitleAr: string;
  subtitleEn: string;
  bioAr?: string;
  bioEn?: string;
  logoType: 'vector' | 'custom-image';
  customLogoUrl?: string;
  logoBg?: 'white' | 'dark' | 'transparent';
  logoText: string;
  logoSubtext: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  city: string;
  locationAr: string;
  locationEn: string;
  padiNumber: string;
  owsiNumber?: string;
  freelanceDocNumber?: string;
  fontFamily?: 'alexandria' | 'cairo' | 'readex' | 'almarai' | 'tajawal';
  customDomain?: string;
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
  status: 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled' | 'paid' | 'pending_payment';
  paymentMethod?: 'paymob' | 'cash' | 'transfer' | 'whatsapp';
  paymentAmount?: string;
  paymentReference?: string;
}

export interface PaymobPaymentConfig {
  enabled: boolean;
  paymentUrl: string;
  depositAmount?: number;
  requirePaymentBeforeBooking: boolean;
  paymentInstructionsAr: string;
  paymentInstructionsEn: string;
  supportMada: boolean;
  supportApplePay: boolean;
  supportCards: boolean;
}

export interface FemaleInstructorConfig {
  enabled: boolean;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  badgeAr: string;
  badgeEn: string;
  bioAr: string;
  bioEn: string;
  photoUrl?: string;
  phone?: string;
  whatsappNumber?: string;
  padiNumber?: string;
  experienceYears?: string;
  featuresListAr: string[];
  featuresListEn: string[];
  specialtiesAr: string[];
  specialtiesEn: string[];
}

export interface Captain {
  id: string;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  roleAr?: string;
  roleEn?: string;
  padiNumber?: string;
  experienceYears?: string;
  bioAr: string;
  bioEn: string;
  photoUrl?: string;
  phone?: string;
  whatsappNumber?: string;
  specialtiesAr: string[];
  specialtiesEn: string[];
  isLead?: boolean;
}

export interface VisibleSectionsConfig {
  underConstructionBar?: boolean;
  announcement: boolean;
  hero: boolean;
  instructor: boolean;
  femaleTraining: boolean;
  quoteBanner: boolean;
  courses: boolean;
  quickPortals: boolean;
  diveSitesModal: boolean;
  diverToolsModal: boolean;
  faqModal: boolean;
  testimonials: boolean;
  contact: boolean;
  footer: boolean;
}

export interface SocialLinksConfig {
  instagram?: string;
  tiktok?: string;
  snapchat?: string;
  twitter?: string;
  youtube?: string;
  showInHeader: boolean;
  showInFooter: boolean;
}

export interface LocationConfig {
  googleMapsUrl: string;
  marinaNameAr: string;
  marinaNameEn: string;
  addressAr: string;
  addressEn: string;
}

export interface PadiCertificateItem {
  id: string;
  titleAr: string;
  titleEn: string;
  codeOrNumber?: string;
  issuer?: string;
  badgeUrl?: string;
  active: boolean;
}

export interface PartnerLogoItem {
  id: string;
  nameAr: string;
  nameEn: string;
  badgeTextAr?: string;
  badgeTextEn?: string;
  logoUrl?: string;
  linkUrl?: string;
  active: boolean;
}

export interface UnderConstructionConfig {
  enabled: boolean;
  badgeAr?: string;
  badgeEn?: string;
  textAr: string;
  textEn: string;
  showWhatsAppButton?: boolean;
}

export interface TrustBadgesConfig {
  sectionTitleAr?: string;
  sectionTitleEn?: string;
  sectionSubtitleAr?: string;
  sectionSubtitleEn?: string;
  crNumber?: string;
  freelanceDocNumber?: string;
  owsiNumber?: string;
  msdtNumber?: string;
  vatNumber?: string;
  padiFiveStar?: boolean;
  certificates?: PadiCertificateItem[];
  partnerLogos?: PartnerLogoItem[];
  copyrightTextAr?: string;
  copyrightTextEn?: string;
  countryTextAr?: string;
  countryTextEn?: string;
}

export interface DesignContentConfig {
  // 1. Quote & Philosophy
  quoteTextAr?: string;
  quoteTextEn?: string;
  quoteAuthorAr?: string;
  quoteAuthorEn?: string;

  // 2. The 3 Safety & Training Pillars
  pillar1TitleAr?: string;
  pillar1TitleEn?: string;
  pillar1DescAr?: string;
  pillar1DescEn?: string;

  pillar2TitleAr?: string;
  pillar2TitleEn?: string;
  pillar2DescAr?: string;
  pillar2DescEn?: string;

  pillar3TitleAr?: string;
  pillar3TitleEn?: string;
  pillar3DescAr?: string;
  pillar3DescEn?: string;

  // 3. Contact Section Texts
  contactKickerAr?: string;
  contactKickerEn?: string;
  contactTitleAr?: string;
  contactTitleEn?: string;
  contactDescAr?: string;
  contactDescEn?: string;
  regionsTextAr?: string;
  regionsTextEn?: string;
  certAgencyTextAr?: string;
  certAgencyTextEn?: string;

  // 4. Booking CTA Card
  contactCardTitleAr?: string;
  contactCardTitleEn?: string;
  contactCardDescAr?: string;
  contactCardDescEn?: string;
  contactCardBtnAr?: string;
  contactCardBtnEn?: string;
  availableDailyAr?: string;
  availableDailyEn?: string;

  // 5. Disclaimer & Policies Modal Text
  footerDisclaimerTitleAr?: string;
  footerDisclaimerTitleEn?: string;
  footerDisclaimerTextAr?: string;
  footerDisclaimerTextEn?: string;
  footerPolicyBtnAr?: string;
  footerPolicyBtnEn?: string;
}

export type BrandConfig = CenterBrandConfig;
export type Booking = BookingRecord;
export interface SiteConfig {
  brand: CenterBrandConfig;
  hero: HeroConfig;
  instructor: InstructorConfig;
  femaleInstructor?: FemaleInstructorConfig;
  captains?: Captain[];
  announcement: AnnouncementConfig;
  underConstruction?: UnderConstructionConfig;
  payment?: PaymobPaymentConfig;
  courses: Course[];
  diveSites: DiveSite[];
  faqs: FAQItem[];
  testimonials: Testimonial[];
  visibleSections?: VisibleSectionsConfig;
  socialLinks?: SocialLinksConfig;
  locationConfig?: LocationConfig;
  trustBadges?: TrustBadgesConfig;
  designContent?: DesignContentConfig;
}
