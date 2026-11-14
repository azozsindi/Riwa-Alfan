import { 
  SiteConfig, 
  BookingRecord, 
  Captain, 
  FemaleInstructorConfig,
  VisibleSectionsConfig,
  SocialLinksConfig,
  LocationConfig,
  TrustBadgesConfig,
  UnderConstructionConfig,
  DesignContentConfig
} from '../types/admin';
import { COURSES_DATA, DIVE_SITES, FAQS, TESTIMONIALS } from './divingData';

export const CONFIG_STORAGE_KEY = 'riwa_alfan_site_config_v12';
export const BOOKINGS_STORAGE_KEY = 'riwa_alfan_bookings_v12';

export const DEFAULT_FEMALE_INSTRUCTOR: FemaleInstructorConfig = {
  enabled: true,
  nameAr: 'القسم النسائي',
  nameEn: 'Women\'s Division',
  titleAr: 'تدريب نسائي خاص بإشراف مدربات معتمدات',
  titleEn: 'Private Ladies Training by Certified Female Instructors',
  badgeAr: 'يوجد قسم خاص نسائي بتدريب النساء',
  badgeEn: 'Private Women\'s Diving Training Division',
  bioAr: 'دورات وبرامج تدريب غوص نسائية خاصة بجدة في مسابح مغلقة، تدريب صبور واحترافي للسيدات والفتيات من الصفر وحتى رخص الغوص الدولية المعتمدة.',
  bioEn: 'Private women\'s diving courses in Jeddah in private indoor pools, patient coaching from beginners to certified PADI divers.',
  photoUrl: '',
  phone: '+966530549675',
  whatsappNumber: '966530549675',
  padiNumber: 'مدربات PADI معتمدات',
  experienceYears: '6+ سنوات خبرة',
  featuresListAr: [
    'مسابح خاصة مغلقة بجدة',
    'شهادات ورخص دولية معتمدة رسمياً من منظمة PADI',
    'تدريب نسائي صبور خطوة بخطوة في بيئة هادئة ومريحة',
    'أوقات مرنة تتناسب مع جداول المتدربات'
  ],
  featuresListEn: [
    'Private indoor pools in Jeddah',
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
    titleAr: 'PADI Open Water Scuba Instructor',
    titleEn: 'PADI Open Water Scuba Instructor',
    roleAr: 'كبير المدربين ومؤسس رواء الفن 👑',
    roleEn: 'Lead Instructor & Founder 👑',
    padiNumber: '#499845',
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
  freelanceDocNumber: '',
  owsiNumber: '',
  msdtNumber: '',
  vatNumber: '',
  padiFiveStar: true,
  copyrightTextAr: 'جميع الحقوق محفوظة © 2026 رواء الفن للغوص (Riwa Alfan) · كابتن فهد الهويملي PADI',
  copyrightTextEn: 'All rights reserved © 2026 Riwa Alfan Diving · Capt. Fahad Al-Huwaimli (PADI)',
  countryTextAr: 'المملكة العربية السعودية',
  countryTextEn: 'Kingdom of Saudi Arabia',
  certificates: [
    {
      id: 'cert-owsi',
      titleAr: 'مدرب غوص مياه مفتوحة معتمد (PADI)',
      titleEn: 'PADI Open Water Scuba Instructor (499845)',
      codeOrNumber: 'PADI #499845',
      issuer: 'منظمة PADI الدولية',
      active: true
    },
    {
      id: 'cert-efr',
      titleAr: 'مدرب إسعافات أولية وإنعاش قلبي معتمد (EFR)',
      titleEn: 'Emergency First Response (EFR) Instructor',
      codeOrNumber: 'EFR Instructor #499845',
      issuer: 'Emergency First Response Worldwide',
      active: true
    },
    {
      id: 'cert-nitrox',
      titleAr: 'مدرب غوص الهواء المخصب (Enriched Air Nitrox)',
      titleEn: 'Enriched Air (Nitrox) Specialty Instructor',
      codeOrNumber: 'Nitrox Specialist #499845',
      issuer: 'منظمة PADI الدولية',
      active: true
    },
    {
      id: 'cert-deep',
      titleAr: 'مدرب غوص الأعماق حتى 40 متر (Deep Diver)',
      titleEn: 'Deep Diver Specialty Instructor',
      codeOrNumber: 'Deep Specialist #499845',
      issuer: 'منظمة PADI الدولية',
      active: true
    },
    {
      id: 'cert-wreck',
      titleAr: 'مدرب غوص حطام السفن التاريخية (Wreck Diver)',
      titleEn: 'Wreck Diver Specialty Instructor',
      codeOrNumber: 'Wreck Specialist #499845',
      issuer: 'منظمة PADI الدولية',
      active: true
    }
  ],
  partnerLogos: [
    {
      id: 'partner-watersports-fed',
      nameAr: 'الاتحاد السعودي للرياضات البحرية والغوص',
      nameEn: 'Saudi Water Sports & Diving Federation',
      badgeTextAr: 'معتمد رسمي',
      badgeTextEn: 'Verified',
      logoUrl: '',
      linkUrl: '',
      licenseNumber: '',
      licenseDetailsAr: 'مدرب غوص معتمد لدى الاتحاد السعودي للرياضات البحرية والغوص',
      licenseDetailsEn: 'Certified Scuba Instructor — Saudi Water Sports & Diving Federation',
      licenseImageUrl: '',
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
      licenseNumber: '499845',
      licenseDetailsAr: 'PADI Open Water Scuba Instructor (499845)',
      licenseDetailsEn: 'PADI Open Water Scuba Instructor (499845)',
      licenseImageUrl: '',
      active: true
    },
    {
      id: 'partner-efr',
      nameAr: 'منظمة EFR الدولية (الإسعافات الأولية والإنعاش القلبي)',
      nameEn: 'Emergency First Response (EFR)',
      badgeTextAr: 'معتمد رسمي',
      badgeTextEn: 'Verified',
      logoUrl: '',
      linkUrl: 'https://www.emergencyfirstresponse.com',
      licenseNumber: '499845',
      licenseDetailsAr: 'مدرب معتمد للإسعافات الأولية والإنعاش القلبي الرئوي (EFR Instructor)',
      licenseDetailsEn: 'Certified Emergency First Response (EFR) & CPR Instructor',
      licenseImageUrl: '',
      active: true
    }
  ]
};

export const DEFAULT_DESIGN_CONTENT: DesignContentConfig = {
  // 1. Quote & Philosophy
  quoteTextAr: 'البحر لا يُعلّمنا فقط كيف نتنفس تحت الماء، بل يُعلّمنا كيف نهدأ ونتأمل ونثق بأنفسنا في عالم أزرق ساحر.',
  quoteTextEn: 'The sea does not merely teach us to breathe underwater; it teaches us serenity, mindfulness, and unbreakable inner trust.',
  quoteAuthorAr: 'كابتن فهد الهويملي',
  quoteAuthorEn: 'Capt. Fahad Al-Huwaimli',

  // 2. The 3 Safety & Training Pillars
  pillar1TitleAr: 'الأمان أولاً وبلا مساومة',
  pillar1TitleEn: 'Safety First Without Compromise',
  pillar1DescAr: 'فحص دقيق لكافة المعدات، تطبيق حرفي لإجراءات السلامة، ومرافقة مستمرة خطوة بخطوة.',
  pillar1DescEn: 'Rigorous inspection of all scuba gear, strict protocol adherence, and continuous step-by-step guidance.',

  pillar2TitleAr: 'الصبر والراحة النفسية',
  pillar2TitleEn: 'Patience & Emotional Serenity',
  pillar2DescAr: 'نعلم أن الماء بيئة جديدة؛ لن ننتقل لأي خطوة إلا بعد أن تشعر بالاسترخاء والمتعة التامة.',
  pillar2DescEn: 'Water is a new environment; we never advance to any new step until you feel fully relaxed and confident.',

  pillar3TitleAr: 'إتقان الطفو وحماية البيئة',
  pillar3TitleEn: 'Mastering Buoyancy & Reef Conservation',
  pillar3DescAr: 'تركيز عميق على التحكم بالطفو لتحقيق تجربة انعدام الجاذبية وحماية الشِعاب المرجانية الهشة.',
  pillar3DescEn: 'Deep focus on peak buoyancy control for weightlessness and protecting fragile Red Sea coral reefs.',

  // 3. Contact Section Texts
  contactKickerAr: 'تواصل مباشر واستشارة مجانية',
  contactKickerEn: 'Direct Contact & Free Consultation',
  contactTitleAr: 'هل أنت جاهز لخوض أول غطسة واستكشاف الأعماق؟',
  contactTitleEn: 'Ready for Your First Dive & Red Sea Exploration?',
  contactDescAr: 'يسعدني جداً الإجابة على كافة تساؤلاتك ومساعدتك في اختيار الدورة الأنسب لك وتقديم استشارة مجانية حول جدول التدريب والمعدات بجدة.',
  contactDescEn: 'Delighted to answer all your inquiries, help select the right PADI course, and provide free guidance on schedule and gear in Jeddah.',
  regionsTextAr: 'جدة فقط (شرم أبحر وشواطئ جدة البحرية)',
  regionsTextEn: 'Jeddah only (Sharm Obhur & Marine Coastal Sites)',
  certAgencyTextAr: 'شهادات PADI معتمدة دولياً',
  certAgencyTextEn: 'Internationally Accredited PADI Licenses',

  // 4. Booking CTA Card
  contactCardTitleAr: 'ابدأ رحلتك اليوم بجدة',
  contactCardTitleEn: 'Begin Your Journey Today in Jeddah',
  contactCardDescAr: 'املأ نموذج الحجز وسيقوم الكابتن بالتواصل معك لتحديد الجدول الملائم لك وإرسال المواد الدراسية.',
  contactCardDescEn: 'Fill out the booking form and the Captain will reach out directly to set your schedule and send study materials.',
  contactCardBtnAr: 'احجز موعد أو استشر الكابتن مجاناً',
  contactCardBtnEn: 'Book Appointment or Consult Free',
  availableDailyAr: 'متاح يومياً للرد على استفسارات الغواصين بجدة',
  availableDailyEn: 'Available daily to support divers in Jeddah',

  // 5. Disclaimer & Policies Modal Text
  footerDisclaimerTitleAr: 'إخلاء مسؤولية ومعايير السلامة',
  footerDisclaimerTitleEn: 'Safety Regulations & Liability Disclaimer',
  footerDisclaimerTextAr: 'رياضة الغوص بمعدات التنفس تحت الماء (Scuba Diving) تتطلب تدريباً وتأهيلاً رسمياً وحصولاً على شهادة معتمدة من منظمة دولية معترف بها. الحاسبات المعروضة هنا هي أدوات مساعدة وتثقيفية ولا تغني عن حاسوب الغوص المعتمد وخطة الغوص الرسمية.',
  footerDisclaimerTextEn: 'Scuba diving requires official accredited training and international certifications. Digital calculators here are educational guides and do not replace certified dive computers and dive plans.',
  footerPolicyBtnAr: 'عرض اللائحة الرسمية للاسترداد والتدريب والسلامة ❯',
  footerPolicyBtnEn: 'View Official Refund & Safety Regulations ❯',
};

export const DEFAULT_CONFIG: SiteConfig = {
  brand: {
    centerNameAr: 'رواء الفن',
    centerNameEn: 'Riwa Alfan',
    subtitleAr: 'دورات تدريب الغوص المعتمدة · كابتن فهد الهويملي PADI',
    subtitleEn: 'Certified PADI Diving Training · Capt. Fahad Al-Huwaimli',
    bioAr: 'رواء الفن للغوص (Riwa Alfan Diving) بجدة بقيادة كابتن فهد الهويملي (PADI MSDT). نلتزم بأعلى معايير السلامة المهنية لحماية وتأهيل الغواصين واستكشاف جمال البحر الأحمر.',
    bioEn: 'Riwa Alfan Diving in Jeddah led by Captain Fahad Al-Huwaimli (PADI MSDT). Committed to the highest safety and professional standards in the Red Sea.',
    freelanceDocNumber: '',
    owsiNumber: 'PADI Open Water Scuba Instructor (499845)',
    logoType: 'vector',
    customLogoUrl: '',
    logoBg: 'white',
    logoText: 'RIWA ALFAN',
    logoSubtext: 'رواء الفن',
    phone: '+966530549675',
    whatsappNumber: '966530549675',
    email: 'Riwaalfan@gmail.com',
    city: 'جدة',
    locationAr: 'جدة - ساحل البحر الأحمر، المملكة العربية السعودية',
    locationEn: 'Jeddah - Red Sea Coast, Saudi Arabia',
    padiNumber: 'PADI #499845',
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
    locationKickerAr: 'جدة · البحر الأحمر',
    locationKickerEn: 'Jeddah · Red Sea',
    ctaBookAr: 'احجز مغامرتك الآن',
    ctaBookEn: 'Book Your Dive',
    ctaCoursesAr: 'استكشف كافة الدورات',
    ctaCoursesEn: 'Explore Courses',
    showStats: true,
    divesStat: '1,450+',
    divesLabelAr: 'عدد الغوصات الموثقة',
    divesLabelEn: 'Logged Dives',
    studentsStat: '520+',
    studentsLabelAr: 'عدد الغواصين الخريجين',
    studentsLabelEn: 'Certified Students',
    safetyStat: '100%',
    safetyLabelAr: 'سجل الأمان والسلامة',
    safetyLabelEn: 'Safety Record',
    whyTitleAr: 'لماذا تختار التدريب معنا؟',
    whyTitleEn: 'Why Train With Us?',
    why1Ar: 'أعلى معايير السلامة المهنية ومعدات حديثة',
    why1En: 'Highest safety standards & modern equipment',
    why2Ar: 'شهادات PADI دولية معتمدة حول العالم',
    why2En: 'Internationally recognized PADI certifications',
    why3Ar: 'تدريب شخصي صبور ومجموعات صغيرة',
    why3En: 'Patient personalized coaching in small groups',
    whatsappBtnAr: 'محادثة واتساب فورية مع الكابتن',
    whatsappBtnEn: 'Instant WhatsApp with Captain'
  },
  instructor: {
    nameAr: 'كابتن فهد الهويملي',
    nameEn: 'Capt. Fahad Al-Huwaimli',
    titleAr: 'PADI Open Water Scuba Instructor',
    titleEn: 'PADI Open Water Scuba Instructor',
    accreditationAr: 'مدرب معتمد دولياً لدى منظمة PADI',
    accreditationEn: 'Internationally Certified PADI Instructor',
    bioAr: 'مدرب غوص سعودي شغوف بأعماق البحر الأحمر لأكثر من عقد من الزمان. نؤمن بأن الغوص ليس مجرد رياضة، بل رحلة استكشاف وتأمل وتناغم تام مع الطبيعة. نلتزم بأعلى معايير السلامة الدولية وأسلوب تدريب صبور ومحفز يزيل أي توتر ويمنح المتدرب ثقة مطلقة تحت الماء.',
    bioEn: 'A passionate Saudi diving instructor immersed in the depths of the Red Sea for over a decade. We believe diving is not merely a sport, but a transformative journey of exploration, contemplation, and complete harmony with nature. Committed to the highest international safety standards with a patient, empowering coaching methodology.',
    quoteAr: 'البحر لا يُعلّمنا فقط كيف نتنفس تحت الماء، بل يُعلّمنا كيف نهدأ ونتأمل ونثق بأنفسنا في عالم أزرق ساحر.',
    quoteEn: 'The sea does not merely teach us to breathe underwater; it teaches us serenity, mindfulness, and unbreakable inner trust.',
    padiMemberNumber: 'PADI Member #499845',
    owsiNumber: 'PADI Open Water Scuba Instructor (499845)',
    danNumber: '',
    efrNumber: 'مدرب معتمد للإسعافات الأولية والإنعاش القلبي (EFR Instructor)',
    certificatesListAr: [
      'PADI Open Water Scuba Instructor (499845)',
      'مدرب معتمد للإسعافات الأولية والإنعاش القلبي (EFR Instructor)'
    ],
    certificatesListEn: [
      'PADI Open Water Scuba Instructor (499845)',
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
  trustBadges: DEFAULT_TRUST_BADGES,
  designContent: DEFAULT_DESIGN_CONTENT
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
