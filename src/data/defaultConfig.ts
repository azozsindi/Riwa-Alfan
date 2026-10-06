import { 
  SiteConfig, 
  BookingRecord, 
  Captain, 
  FemaleInstructorConfig,
  VisibleSectionsConfig,
  SocialLinksConfig,
  LocationConfig,
  TrustBadgesConfig,
  UnderConstructionConfig
} from '../types/admin';
import { COURSES_DATA, DIVE_SITES, FAQS, TESTIMONIALS } from './divingData';

export const CONFIG_STORAGE_KEY = 'riwa_alfan_site_config_v12';
export const BOOKINGS_STORAGE_KEY = 'riwa_alfan_bookings_v12';

export const DEFAULT_FEMALE_INSTRUCTOR: FemaleInstructorConfig = {
  enabled: true,
  nameAr: 'كابتن ريم السالم (قسم التدريب النسائي)',
  nameEn: 'Capt. Reem Al-Salem (Women\'s Training)',
  titleAr: 'PADI Open Water Scuba Instructor (OWSI)',
  titleEn: 'PADI Open Water Scuba Instructor (OWSI)',
  badgeAr: 'قسم التدريب النسائي الخاص 🧕',
  badgeEn: 'Ladies Private Training Division 🧕',
  bioAr: 'دورات وبرامج تدريب غوص نسائية خاصة بجدة في مسابح مغلقة ومحمية بخصوصية تامة 100%، تدريب صبور واحترافي للسيدات والفتيات من الصفر وحتى رخص الغوص الدولية المعتمدة.',
  bioEn: 'Private women\'s diving courses in Jeddah in private indoor pools with 100% full privacy, patient coaching from beginners to certified PADI divers.',
  photoUrl: '',
  phone: '+966530549675',
  whatsappNumber: '966530549675',
  padiNumber: 'PADI OWSI #514209',
  experienceYears: '6+ سنوات خبرة',
  featuresListAr: [
    'مسابح خاصة مغلقة بجدة مع خصوصية تامة 100%',
    'شهادات ورخص دولية معتمدة رسمياً من منظمة PADI',
    'تدريب نسائي صبور خطوة بخطوة في بيئة هادئة ومريحة',
    'أوقات مرنة تتناسب مع جداول المتدربات'
  ],
  featuresListEn: [
    'Private indoor pools in Jeddah with 100% privacy',
    'Officially certified PADI international licenses',
    'Patient female-led coaching step-by-step',
    'Flexible timings tailored for ladies schedules'
  ],
  specialtiesAr: [
    'دورة غواص المياه المفتوحة (Open Water)',
    'غوص التجربة النسائي (Discover Scuba)',
    'تحسين الطفو والمهارات الأساسية',
    'الإسعافات الأولية للطوارئ (EFR)'
  ],
  specialtiesEn: [
    'PADI Open Water Diver Course',
    'Discover Scuba Diving for Women',
    'Peak Performance Buoyancy',
    'Emergency First Response (EFR)'
  ]
};

export const DEFAULT_CAPTAINS: Captain[] = [
  {
    id: 'captain-fahad',
    nameAr: 'كابتن فهد الهويملي',
    nameEn: 'Capt. Fahad Al-Huwaimli',
    titleAr: 'PADI Open Water Scuba Instructor (OWSI)',
    titleEn: 'PADI Open Water Scuba Instructor (OWSI)',
    roleAr: 'كبير المدربين ومؤسس رواء الفن 👑',
    roleEn: 'Lead Instructor & Founder 👑',
    padiNumber: '#482910',
    experienceYears: '10+ سنوات خبرة',
    bioAr: 'مدرب غوص سعودي محترف لأكثر من عقد في أعماق البحر الأحمر بجدة. معتمد لدى PADI وDAN وEFR، شغوف بتعليم الغوص من الصفر بأمان وهدوء تام.',
    bioEn: 'Senior Saudi diving instructor with over a decade exploring the Red Sea depths. PADI, DAN, and EFR certified, passionate about patient coaching and safety.',
    photoUrl: '',
    phone: '+966530549675',
    whatsappNumber: '966530549675',
    specialtiesAr: [
      'غوص الأعماق (Deep Diver)',
      'غوص الهواء المخصب النيتروكس (Enriched Air Nitrox)',
      'غوص حطام وسفن البحر الأحمر (Wreck Diver)',
      'الإسعافات الأولية والإنعاش القلبي (EFR)'
    ],
    specialtiesEn: [
      'Deep Diver Specialist',
      'Enriched Air Nitrox (EANx)',
      'Red Sea Wreck Diving Specialist',
      'Emergency First Response (EFR)'
    ],
    isLead: true
  },
  {
    id: 'captain-reem',
    nameAr: 'كابتن ريم السالم (تدريب نسائي)',
    nameEn: 'Capt. Reem Al-Salem (Ladies Training)',
    titleAr: 'PADI Open Water Scuba Instructor (OWSI)',
    titleEn: 'PADI Open Water Scuba Instructor (OWSI)',
    roleAr: 'مسؤولة التدريب النسائي 🧕',
    roleEn: 'Women\'s Training Lead 🧕',
    padiNumber: '#514209',
    experienceYears: '6+ سنوات خبرة',
    bioAr: 'مدربة غوص سعودية معتمدة دولياً لدى منظمة PADI. متخصصة في تدريب وتأهيل السيدات في مسابح خاصة بجدة بخصوصية تامة 100% وصبر فائق.',
    bioEn: 'Certified Saudi PADI female instructor specializing in women\'s training with 100% private pools in Jeddah and patient coaching.',
    photoUrl: '',
    phone: '+966530549675',
    whatsappNumber: '966530549675',
    specialtiesAr: [
      'غواص المياه المفتوحة (Open Water)',
      'غوص التجربة النسائي (Discover Scuba)',
      'إتقان مهارات الطفو (Peak Buoyancy)',
      'الإسعافات الأولية (EFR)'
    ],
    specialtiesEn: [
      'PADI Open Water Diver',
      'Discover Scuba Diving',
      'Peak Performance Buoyancy',
      'Emergency First Response (EFR)'
    ]
  }
];

export const DEFAULT_VISIBLE_SECTIONS: VisibleSectionsConfig = {
  underConstructionBar: true,
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
};

export const DEFAULT_UNDER_CONSTRUCTION: UnderConstructionConfig = {
  enabled: true,
  badgeAr: 'الموقع قيد الإنشاء والتحديث 🚧',
  badgeEn: 'Under Development & Updates 🚧',
  textAr: 'الموقع قيد التجهيز والتطوير حالياً · يسعدنا استقبال استفساراتكم وحجوزات دورات الغوص عبر الواتساب مباشرة',
  textEn: 'Website is currently under construction & updates · Welcoming inquiries and course bookings via WhatsApp',
  showWhatsAppButton: true
};

export const DEFAULT_SOCIAL_LINKS: SocialLinksConfig = {
  instagram: 'https://instagram.com/riwaalfan',
  tiktok: 'https://tiktok.com/@riwaalfan',
  snapchat: 'https://snapchat.com/add/riwaalfan',
  twitter: '',
  youtube: '',
  showInHeader: true,
  showInFooter: true,
};

export const DEFAULT_LOCATION_CONFIG: LocationConfig = {
  googleMapsUrl: 'https://maps.google.com/?q=North+Obhur+Jeddah+Saudi+Arabia',
  marinaNameAr: 'مرسى أبحر الشمالية - جدة',
  marinaNameEn: 'North Obhur Marina - Jeddah',
  addressAr: 'جدة - أبحر الشمالية، ساحل البحر الأحمر',
  addressEn: 'Jeddah - North Obhur, Red Sea Coast',
};

export const DEFAULT_TRUST_BADGES: TrustBadgesConfig = {
  sectionTitleAr: 'الاعتمادات الرسمية ومنصات التوثيق الشريكة',
  sectionTitleEn: 'Official Accreditations & Partner Platforms',
  sectionSubtitleAr: 'توثيق رسمي ومعتمد بالمملكة العربية السعودية',
  sectionSubtitleEn: 'Officially Verified & Registered in Saudi Arabia',
  crNumber: '',
  freelanceDocNumber: 'FL-2918401',
  owsiNumber: 'PADI OWSI #482910',
  msdtNumber: 'PADI MSDT #482910',
  vatNumber: '',
  padiFiveStar: true,
  copyrightTextAr: 'جميع الحقوق محفوظة © 2026 رواء الفن للغوص (Riwa Alfan) · كابتن فهد الهويملي PADI',
  copyrightTextEn: 'All rights reserved © 2026 Riwa Alfan Diving · Capt. Fahad Al-Huwaimli (PADI)',
  countryTextAr: 'المملكة العربية السعودية',
  countryTextEn: 'Kingdom of Saudi Arabia',
  certificates: [
    {
      id: 'cert-owsi',
      titleAr: 'مدرب غوص مياه مفتوحة معتمد (PADI OWSI)',
      titleEn: 'PADI Open Water Scuba Instructor (OWSI)',
      codeOrNumber: 'PADI OWSI #482910',
      issuer: 'منظمة PADI الدولية',
      active: true
    },
    {
      id: 'cert-msdt',
      titleAr: 'مدرب تخصصات غوص معتمد (PADI MSDT)',
      titleEn: 'PADI Master Scuba Diver Trainer (MSDT)',
      codeOrNumber: 'PADI MSDT #482910',
      issuer: 'منظمة PADI الدولية',
      active: true
    },
    {
      id: 'cert-freelance',
      titleAr: 'وثيقة العمل الحر الرسمية',
      titleEn: 'Official Freelance License',
      codeOrNumber: 'FL-2918401',
      issuer: 'وزارة الموارد البشرية والتنمية الاجتماعية',
      active: true
    },
    {
      id: 'cert-efr',
      titleAr: 'مدرب إسعافات أولية وإنعاش قلبي معتمد (EFR)',
      titleEn: 'Emergency First Response (EFR) Instructor',
      codeOrNumber: 'EFR Instructor #482910',
      issuer: 'Emergency First Response Worldwide',
      active: true
    },
    {
      id: 'cert-dan',
      titleAr: 'عضو شبكة تنبيه الغواصين الدولية (DAN Europe/World)',
      titleEn: 'Diver Alert Network (DAN) Active Member',
      codeOrNumber: 'DAN Pro Member',
      issuer: 'Divers Alert Network (DAN)',
      active: true
    },
    {
      id: 'cert-nitrox',
      titleAr: 'مدرب غوص الهواء المخصب (Enriched Air Nitrox)',
      titleEn: 'Enriched Air (Nitrox) Specialty Instructor',
      codeOrNumber: 'Nitrox Specialist #482910',
      issuer: 'منظمة PADI الدولية',
      active: true
    },
    {
      id: 'cert-deep',
      titleAr: 'مدرب غوص الأعماق حتى 40 متر (Deep Diver)',
      titleEn: 'Deep Diver Specialty Instructor',
      codeOrNumber: 'Deep Specialist #482910',
      issuer: 'منظمة PADI الدولية',
      active: true
    },
    {
      id: 'cert-wreck',
      titleAr: 'مدرب غوص حطام السفن التاريخية (Wreck Diver)',
      titleEn: 'Wreck Diver Specialty Instructor',
      codeOrNumber: 'Wreck Specialist #482910',
      issuer: 'منظمة PADI الدولية',
      active: true
    }
  ],
  partnerLogos: [
    {
      id: 'partner-saudi-business',
      nameAr: 'منصة الأعمال السعودية',
      nameEn: 'Saudi Business Platform',
      badgeTextAr: 'معتمد رسمي',
      badgeTextEn: 'Verified',
      logoUrl: '',
      linkUrl: 'https://business.sa',
      active: true
    },
    {
      id: 'partner-watersports-fed',
      nameAr: 'الاتحاد السعودي للرياضات البحرية والغوص',
      nameEn: 'Saudi Water Sports & Diving Federation',
      badgeTextAr: 'معتمد رسمي',
      badgeTextEn: 'Verified',
      logoUrl: '',
      linkUrl: '',
      active: true
    },
    {
      id: 'partner-freelance',
      nameAr: 'منصة العمل الحر (FL-2918401)',
      nameEn: 'Freelance Platform (FL-2918401)',
      badgeTextAr: 'معتمد رسمي',
      badgeTextEn: 'Verified',
      logoUrl: '',
      linkUrl: 'https://freelance.sa',
      active: true
    },
    {
      id: 'partner-padi',
      nameAr: 'منظمة PADI الدولية للغوص',
      nameEn: 'PADI Worldwide',
      badgeTextAr: 'معتمد رسمي',
      badgeTextEn: 'Verified',
      logoUrl: '',
      linkUrl: 'https://www.padi.com',
      active: true
    }
  ]
};

export const DEFAULT_CONFIG: SiteConfig = {
  brand: {
    centerNameAr: 'رواء الفن',
    centerNameEn: 'Riwa Alfan',
    subtitleAr: 'دورات تدريب الغوص المعتمدة · كابتن فهد الهويملي PADI',
    subtitleEn: 'Certified PADI Diving Training · Capt. Fahad Al-Huwaimli',
    bioAr: 'رواء الفن للغوص (Riwa Alfan Diving) بجدة بقيادة كابتن فهد الهويملي (PADI MSDT). نلتزم بأعلى معايير السلامة المهنية لحماية وتأهيل الغواصين واستكشاف جمال البحر الأحمر.',
    bioEn: 'Riwa Alfan Diving in Jeddah led by Captain Fahad Al-Huwaimli (PADI MSDT). Committed to the highest safety and professional standards in the Red Sea.',
    freelanceDocNumber: 'FL-2918401',
    owsiNumber: 'PADI OWSI #482910',
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
    padiNumber: 'PADI OWSI #482910',
    fontFamily: 'alexandria',
    customDomain: 'riwaalfan.com'
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
  femaleInstructor: DEFAULT_FEMALE_INSTRUCTOR,
  captains: DEFAULT_CAPTAINS,
  payment: {
    enabled: true,
    paymentUrl: '', // Admin can paste their Paymob link here
    depositAmount: 500,
    requirePaymentBeforeBooking: false,
    paymentInstructionsAr: 'يمكنك تأكيد حجزك بدفع الرسوم أو العربون إلكترونياً وبأمان عبر منصة Paymob الرسمية بواسطة بطاقات مدى، Apple Pay، أو فيزا وماستركارد.',
    paymentInstructionsEn: 'You can secure your booking by paying fees or deposit online via Paymob using Mada, Apple Pay, Visa, or Mastercard.',
    supportMada: true,
    supportApplePay: true,
    supportCards: true
  },
  announcement: {
    enabled: false,
    badgeAr: 'عرض خاص بجدة',
    badgeEn: 'Jeddah Special Offer',
    textAr: 'خصم خاص 20% على دورة غواص المياه المفتوحة (Open Water) للحجوزات المبكرة هذا الشهر!',
    textEn: 'Special 20% OFF on PADI Open Water Course for early bird bookings this month!',
    ctaTextAr: 'احجز العرض الآن',
    ctaTextEn: 'Claim Offer Now',
    discountPercentage: 20,
    highlightCourseId: 'open-water'
  },
  underConstruction: DEFAULT_UNDER_CONSTRUCTION,
  courses: COURSES_DATA,
  diveSites: DIVE_SITES,
  faqs: FAQS,
  testimonials: TESTIMONIALS,
  visibleSections: DEFAULT_VISIBLE_SECTIONS,
  socialLinks: DEFAULT_SOCIAL_LINKS,
  locationConfig: DEFAULT_LOCATION_CONFIG,
  trustBadges: DEFAULT_TRUST_BADGES
};

export const INITIAL_DEMO_BOOKINGS: BookingRecord[] = [
  {
    id: 'BK-1082',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    name: 'سعود بن ناصر العتيبي',
    phone: '0555987654',
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
