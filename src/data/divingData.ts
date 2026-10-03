export type Lang = 'ar' | 'en';

export interface Course {
  id: string;
  category: 'beginner' | 'advanced' | 'specialty' | 'professional';
  certAgency: 'PADI';
  seaDives: number;
  poolSessions: number;
  title: Record<Lang, string>;
  depth: Record<Lang, string>;
  duration: Record<Lang, string>;
  price: Record<Lang, string>;
  summary: Record<Lang, string>;
  prerequisites: Record<Lang, string>;
  highlights: Record<Lang, string[]>;
  curriculum: Record<Lang, string[]>;
}

export interface DiveSite {
  id: string;
  name: Record<Lang, string>;
  location: Record<Lang, string>;
  depth: Record<Lang, string>;
  level: Record<Lang, string>;
  visibility: Record<Lang, string>;
  current: Record<Lang, string>;
  marineLife: Record<Lang, string[]>;
  description: Record<Lang, string>;
}

export interface Testimonial {
  id: string;
  name: Record<Lang, string>;
  role: Record<Lang, string>;
  course: Record<Lang, string>;
  quote: Record<Lang, string>;
  date: Record<Lang, string>;
  avatarSeed: string;
}

export interface FAQItem {
  question: Record<Lang, string>;
  answer: Record<Lang, string>;
}

export const INSTRUCTOR_INFO = {
  name: {
    ar: "كابتن فهد الهويملي",
    en: "Capt. Fahad Al-Huwaimli"
  },
  title: {
    ar: "PADI Open Water Scuba Instructor (OWSI)",
    en: "PADI Open Water Scuba Instructor (OWSI)"
  },
  agencies: ["PADI OWSI #482910", "PADI EFR Emergency First Response Instructor"],
  experienceYears: 10,
  loggedDives: 1450,
  certifiedStudents: 520,
  safetyRecord: "100%",
  phone: "+966530549675",
  whatsappNumber: "966530549675",
  email: "Riwaalfan@gmail.com",
  location: {
    ar: "جدة - ساحل البحر الأحمر، المملكة العربية السعودية",
    en: "Jeddah - Red Sea Coast, Saudi Arabia"
  },
  bio: {
    ar: "مدرب غوص سعودي شغوف بأعماق البحر الأحمر لأكثر من عقد من الزمان. نؤمن بأن الغوص ليس مجرد رياضة، بل رحلة استكشاف وتأمل وتناغم تام مع الطبيعة. نلتزم بأعلى معايير السلامة الدولية وأسلوب تدريب صبور ومحفز يزيل أي توتر ويمنح المتدرب ثقة مطلقة تحت الماء.",
    en: "A passionate Saudi scuba diving instructor exploring and teaching across the Red Sea for over a decade. We believe diving is more than an adrenaline sport; it is an expedition of inner serenity and harmony with nature. We commit to world-class safety protocols and patient, encouraging coaching that dispels any apprehension."
  },
  specialties: {
    ar: [
      "مدرب غوص المياه المفتوحة والمتقدم",
      "مدرب تخصص الهواء المخصب (النيتروكس EANx)",
      "مدرب غوص الأعماق والغوص الليلي",
      "مدرب الإسعافات الأولية والإنعاش القلبي الرئوي (EFR)",
      "مدرب طفو احترافي وحماية البيئة البحرية",
      "تنظيم رحلات السفاري البحرية واليخوت"
    ],
    en: [
      "Open Water & Advanced Scuba Instructor",
      "Enriched Air Nitrox (EANx) Specialty Instructor",
      "Deep Diver & Night Diver Specialty Instructor",
      "Emergency First Response (EFR) & CPR Instructor",
      "Peak Performance Buoyancy & Coral Conservation",
      "Liveaboard Expeditions & Boat Safari Organizer"
    ]
  }
};

export const COURSES_DATA: Course[] = [
  {
    id: "open-water",
    category: "beginner",
    certAgency: "PADI",
    seaDives: 4,
    poolSessions: 5,
    title: {
      ar: "دورة غواص المياه المفتوحة",
      en: "Open Water Diver Course"
    },
    depth: {
      ar: "18 متر",
      en: "18 meters (60 ft)"
    },
    duration: {
      ar: "4 - 5 أيام (مرن)",
      en: "4 - 5 days (flexible)"
    },
    price: {
      ar: "1,850 ر.س",
      en: "1,850 SAR"
    },
    summary: {
      ar: "الشهادة الدولية الأولى التي تفتح لك أبواب الغوص في أي مكان حول العالم بمرافقة غواص زميل.",
      en: "The world's most popular scuba certification, qualifying you to dive anywhere globally with a buddy."
    },
    prerequisites: {
      ar: "عمر 10 سنوات فما فوق، صحة بدنية عامة، والقدرة على الطفو والسباحة الأساسية.",
      en: "Age 10+, reasonable physical health, and basic swimming & floating comfort."
    },
    highlights: {
      ar: [
        "شهادة ورخصة غوص دولية مدى الحياة",
        "جلسات مسبح تدريبية غير محدودة حتى إتقان المهارات",
        "4 غوصات حقيقية في مياه البحر الأحمر الصافية",
        "شامل كامل المعدات والكتب الرقمية"
      ],
      en: [
        "Lifetime internationally accredited certification",
        "Unlimited pool sessions until complete skill mastery",
        "4 real open sea dives in pristine Red Sea waters",
        "Full gear rental and digital learning materials included"
      ]
    },
    curriculum: {
      ar: [
        "الفيزياء والفسيولوجيا الأساسية للغوص وتأثير الضغط",
        "مهارات تنظيف القناع واسترجاع المنظم تحت الماء",
        "تقنيات الطفو الإيجابي والمحايد والتحكم بالوزن",
        "خطة الصعود الآمن وإجراءات التوقف الآمن للسلامة",
        "نظام الغوص مع زميل (Buddy System) والتواصل بالإشارات"
      ],
      en: [
        "Scuba physics, physiology, and pressure equalization",
        "Underwater mask clearing and regulator recovery techniques",
        "Neutral buoyancy mastery and proper ballast weight trim",
        "Ascent rate monitoring and 5-meter safety stop protocols",
        "Buddy system operations and underwater hand signals"
      ]
    }
  },
  {
    id: "advanced-open-water",
    category: "advanced",
    certAgency: "PADI",
    seaDives: 5,
    poolSessions: 0,
    title: {
      ar: "دورة غواص المياه المفتوحة المتقدم",
      en: "Advanced Open Water Diver"
    },
    depth: {
      ar: "30 متر",
      en: "30 meters (100 ft)"
    },
    duration: {
      ar: "2 - 3 أيام",
      en: "2 - 3 days"
    },
    price: {
      ar: "1,650 ر.س",
      en: "1,650 SAR"
    },
    summary: {
      ar: "طوّر مهاراتك واختبر أعماقاً جديدة وملاحة دقيقة وغوص ليلي مذهل تحت إشراف مباشر.",
      en: "Elevate your skills to 30 meters with compass navigation, thrilling night diving, and peak buoyancy."
    },
    prerequisites: {
      ar: "حاصل على رخصة غواص المياه المفتوحة (Open Water Diver).",
      en: "Hold an Open Water Diver certification or equivalent qualifying rating."
    },
    highlights: {
      ar: [
        "تأهيل رسمي للغوص حتى عمق 30 متراً",
        "5 غوصات مغامرة تخصصية مختلفة",
        "إتقان البوصلة والملاحة الطبيعية تحت الماء",
        "شامل الرخص والكتب والشهادة المعتمدة"
      ],
      en: [
        "Official qualification for depths down to 30 meters",
        "5 specialized adventure training dives",
        "Underwater compass and natural landmark navigation",
        "All certification processing fees and digital crew-pack included"
      ]
    },
    curriculum: {
      ar: [
        "غوصة الأعماق الإلزامية (حتى 30 متراً) وفهم التخدير النيتروجيني",
        "غوصة الملاحة تحت الماء باستخدام البوصلة والتضاريس",
        "غوصة الأداء المثالي للطفو (Peak Performance Buoyancy)",
        "غوصة ليلية لاستكشاف الكائنات البحرية المتوهجة",
        "غوصة استكشاف حطام سفينة أو غوص بيئي محمي"
      ],
      en: [
        "Deep Adventure Dive (30m) & managing nitrogen narcosis",
        "Underwater Navigation using magnetic compass & contours",
        "Peak Performance Buoyancy for effortless gliding",
        "Night Adventure Dive discovering nocturnal marine life",
        "Wreck or marine naturalist elective adventure dive"
      ]
    }
  },
  {
    id: "rescue-diver",
    category: "advanced",
    certAgency: "PADI",
    seaDives: 4,
    poolSessions: 2,
    title: {
      ar: "دورة غواص الإنقاذ والإسعافات الأولية",
      en: "Rescue Diver & EFR"
    },
    depth: {
      ar: "30 متر",
      en: "30 meters"
    },
    duration: {
      ar: "3 - 4 أيام",
      en: "3 - 4 days"
    },
    price: {
      ar: "2,200 ر.س",
      en: "2,200 SAR"
    },
    summary: {
      ar: "الدورة الأكثر تحدياً ومكافأة! تعلم كيف تتوقع المشكلات وتمنعها وتتصرف بهدوء في الطوارئ.",
      en: "The most challenging and rewarding diver program. Learn emergency management, panic resolution, and life-saving rescue techniques."
    },
    prerequisites: {
      ar: "غواص متقدم + دورة إسعافات أولية حديثة (EFR Primary & Secondary Care).",
      en: "Advanced Open Water + valid CPR/First Aid training within 24 months."
    },
    highlights: {
      ar: [
        "بناء ثقة حديدية بالنفس وسرعة بديهة قيادية",
        "سيناريوهات واقعية تحاكي أصعب حالات الإنقاذ",
        "شهادة الإنعاش القلبي وإدارة الأكسجين الطبي",
        "المرحلة الأساسية قبل التأهيل كمرشد غوص محترف"
      ],
      en: [
        "Rock-solid underwater composure and leadership presence",
        "Realistic open-water simulated rescue scenarios",
        "CPR & Emergency Oxygen administration certification",
        "The vital cornerstone stepping stone toward Divemaster"
      ]
    },
    curriculum: {
      ar: [
        "التعرف على التوتر والإجهاد لدى الزملاء والتعامل معه",
        "مساعدة الغواص المذعور أو المتعب على السطح وفي القاع",
        "تقنيات البحث المنهجي تحت الماء عن غواص مفقود",
        "إجراءات إخراج الغواص فاقد الوعي وتقديم التنفس الاصطناعي",
        "إدارة خطط الطوارئ واستدعاء الدعم الطبي المتخصص"
      ],
      en: [
        "Recognizing stress and diver panic indicators early",
        "Managing tired and panicked divers at surface and depth",
        "Underwater search patterns for missing divers",
        "Surfacing unconscious divers and in-water rescue breaths",
        "Emergency Action Plan formulation and DAN liaison"
      ]
    }
  },
  {
    id: "nitrox-specialty",
    category: "specialty",
    certAgency: "PADI",
    seaDives: 2,
    poolSessions: 0,
    title: {
      ar: "تخصص غوص الهواء المخصب (نيتروكس)",
      en: "Enriched Air (Nitrox) Specialty"
    },
    depth: {
      ar: "حسب رخصتك الحالية",
      en: "Matches current license"
    },
    duration: {
      ar: "يوم واحد مكثف",
      en: "1 intensive day"
    },
    price: {
      ar: "950 ر.س",
      en: "950 SAR"
    },
    summary: {
      ar: "التخصص الأكثر طلباً عالمياً؛ يمنحك وقتاً أطول في القاع وفترات استراحة أقصر وتعباً أقل بعد الغوص.",
      en: "The most sought-after specialty worldwide, extending no-decompression limits and reducing post-dive fatigue."
    },
    prerequisites: {
      ar: "حاصل على رخصة غواص مياه مفتوحة أو أعلى.",
      en: "Certified Open Water Diver or higher."
    },
    highlights: {
      ar: [
        "زيادة وقت القاع دون تخفيف الضغط (No-Decompression Limit)",
        "تعلم قياس نسبة الأكسجين بجهاز التحليل الرقمي",
        "برمجة حاسوب الغوص لخلائط النيتروكس حتى 40% O2",
        "مثالية لرحلات السفاري واليخوت ذات الغوص المتكرر"
      ],
      en: [
        "Extended No-Decompression bottom times on repeat dives",
        "Digital oxygen analyzer calibration and tank analysis",
        "Dive computer programming for mixtures up to 40% O2",
        "Essential credential for liveaboards and multiple daily dives"
      ]
    },
    curriculum: {
      ar: [
        "فوائد ومخاطر استخدام خلطات الهواء المخصب بالأكسجين",
        "إدارة التعرض للأكسجين وحدود الضغط الجزئي (PO2)",
        "حساب العمق التشغيلي الأقصى (MOD) بدقة متناهية",
        "معايرة الأسطوانات وتحليل الغاز وتوثيقه بسجل المحطة"
      ],
      en: [
        "Benefits and physiology of oxygen-enriched breathing gas",
        "Oxygen exposure tracking and partial pressure (PO2) ceilings",
        "Computing Maximum Operating Depths (MOD) and EAD",
        "Gas cylinder labeling, fill station documentation & analysis"
      ]
    }
  },
  {
    id: "deep-specialty",
    category: "specialty",
    certAgency: "PADI",
    seaDives: 4,
    poolSessions: 0,
    title: {
      ar: "تخصص الغوص العميق (40 متر)",
      en: "Deep Diver Specialty (40m)"
    },
    depth: {
      ar: "40 متر (الحد الترفيهي الأقصى)",
      en: "40 meters (Recreational Limit)"
    },
    duration: {
      ar: "يومان",
      en: "2 days"
    },
    price: {
      ar: "1,450 ر.س",
      en: "1,450 SAR"
    },
    summary: {
      ar: "اكتشف عالم الأعماق الساحر وحطام السفن الغارقة في أعماق لا يصل إليها أغلب الغواصين.",
      en: "Unlock the absolute recreational depth limit (40m / 130ft) to explore deep wrecks and deep-water pelagics."
    },
    prerequisites: {
      ar: "حاصل على رخصة غواص متقدم (Advanced Open Water).",
      en: "Advanced Open Water certification required."
    },
    highlights: {
      ar: [
        "الوصول للحد الأقصى للغوص الترفيهي (40 متراً / 130 قدماً)",
        "تخطيط استهلاك الغاز ومراقبة استهلاك الهواء في الأعماق",
        "التدريب على استخدام أسطوانات النجاة الاحتياطية",
        "رؤية مخلوقات المياه العميقة والكائنات النادرة"
      ],
      en: [
        "Certified down to the maximum recreational ceiling (40m)",
        "Advanced gas consumption management and reserve planning",
        "Pony bottle and drop cylinder emergency protocols",
        "Encounter pelagic species and deeper wreck structures"
      ]
    },
    curriculum: {
      ar: [
        "معدات الغوص العميق المتخصصة وأضواء الأعماق",
        "التخطيط لاستهلاك الغاز وحدود وقت القاع الصارمة",
        "التعامل مع تأثير تخدير النيتروجين في الأعماق",
        "إجراءات التوقفات الإضافية للسلامة والتعامل مع الطوارئ"
      ],
      en: [
        "Specialized deep-diving gear configurations & high-lumen lights",
        "Nitrogen narcosis recognition and situational coping drills",
        "Ascent rate discipline and deep safety stops",
        "Emergency decompression precautions and buddy gas sharing"
      ]
    }
  },
  {
    id: "divemaster",
    category: "professional",
    certAgency: "PADI",
    seaDives: 20,
    poolSessions: 10,
    title: {
      ar: "برنامج مرشد الغوص المحترف",
      en: "Divemaster (Professional Level)"
    },
    depth: {
      ar: "40 متر",
      en: "40 meters"
    },
    duration: {
      ar: "2 - 4 أسابيع (توجيه وتطبيق عملي)",
      en: "2 - 4 weeks (mentorship)"
    },
    price: {
      ar: "5,800 ر.س",
      en: "5,800 SAR"
    },
    summary: {
      ar: "بداية رحلتك كغواص محترف! قُد المجموعات وساعد في تدريب الطلاب واجعل البحر مهنتك وشغفك.",
      en: "Join the ranks of scuba professionals. Lead certified divers, assist instructors, and launch your global career."
    },
    prerequisites: {
      ar: "غواص إنقاذ + 40 غوصة مسجلة على الأقل + فحص طبي لائق للغوص.",
      en: "Rescue Diver + 40 logged dives + medical dive clearance."
    },
    highlights: {
      ar: [
        "أول رتبة قيادية واحترافية مسجلة دولياً",
        "الحصول على رقم عضوية ورخصة احترافية للعمل عالمياً",
        "تدريب ميداني واقعي مع طلاب حقيقيين ورحلات بحرية",
        "إتقان كافة مهارات الإنقاذ والطفو بمستوى نموذجي للمدربين"
      ],
      en: [
        "First leadership rating accredited worldwide",
        "Professional membership number and worldwide working privileges",
        "Hands-on mentorship conducting actual courses & boat charters",
        "Demonstration-quality skill performance and watermanship stamina"
      ]
    },
    curriculum: {
      ar: [
        "نظريات الغوص المتقدمة (فيزياء، فسيولوجيا، معدات، بيئة)",
        "إدارة مواقع الغوص والإحاطة الشاملة قبل الغوص (Briefing)",
        "رسم خرائط مواقع الغوص وقياس الأعماق والتيارات",
        "مساعدة المدرب في الفصول الدراسية والمسبح والبحار المفتوحة",
        "اختبارات اللياقة المائية وقدرات التحمل العالية"
      ],
      en: [
        "Comprehensive dive theory (physics, physiology, environmental dynamics)",
        "Professional dive briefing delivery and risk management",
        "Underwater site mapping and current evaluation",
        "Instructor assistance during pool training and ocean sessions",
        "Timed watermanship endurance evaluations"
      ]
    }
  }
];

export const DIVE_SITES: DiveSite[] = [
  {
    id: "abu-tair",
    name: {
      ar: "حطام أبو طير (سفينة الكيبل) - جدة",
      en: "Abu Tair Wreck (The Cable Wreck) - Jeddah"
    },
    location: {
      ar: "جنوب غرب أبحر - جدة",
      en: "Southwest of Obhur - Jeddah"
    },
    depth: {
      ar: "14 - 32 متر",
      en: "14 - 32 meters"
    },
    level: {
      ar: "غواص متقدم",
      en: "Advanced Diver"
    },
    visibility: {
      ar: "25 - 35 متر",
      en: "25 - 35 meters"
    },
    current: {
      ar: "متوسط",
      en: "Moderate"
    },
    marineLife: {
      ar: ["أسماك الباراكودا العملاقة", "شِعاب مرجانية ناعمة", "سلاحف صقرية المنقار", "أسماك الراي"],
      en: ["Great Barracuda Schools", "Soft Corals", "Hawksbill Turtles", "Eagle Rays"]
    },
    description: {
      ar: "واحدة من أشهر غوصات الحطام في جدة. سفينة شحن بريطانية غرقت عام 1978، محملة بلفائف الكابلات الضخمة التي تحولت إلى موطن هائل للأسماك والأنيمون.",
      en: "One of Jeddah's premier wreck sites. A British freighter that sank in 1978 carrying massive spools of cable, creating an artificial reef teeming with marine biodiversity."
    }
  },
  {
    id: "mismari",
    name: {
      ar: "شِعاب المسماري البحرية",
      en: "Al-Mismari Reefs"
    },
    location: {
      ar: "شمال جدة",
      en: "North Jeddah"
    },
    depth: {
      ar: "5 - 45 متر",
      en: "5 - 45 meters"
    },
    level: {
      ar: "جميع المستويات (جدار عميق للمتقدمين)",
      en: "All Levels (Deep wall for Advanced)"
    },
    visibility: {
      ar: "30 - 40 متر",
      en: "30 - 40 meters"
    },
    current: {
      ar: "خفيف",
      en: "Gentle"
    },
    marineLife: {
      ar: ["دلافين دوارة", "قروش الشعاب ذات الطرف الأبيض", "شِعاب مروحية جورجونية", "أسماك التونة"],
      en: ["Spinner Dolphins", "Whitetip Reef Sharks", "Gorgonian Sea Fans", "Yellowfin Tuna"]
    },
    description: {
      ar: "جدار مرجاني عمودي مذهل يسقط في زرقة البحر اللامتناهية. تتميز بوضوح رؤية استثنائي وتجمع أسراب الأسماك الكبيرة وتشكيلات المرجان العذراء.",
      en: "A breathless vertical wall plunging into oceanic blue. Renowned for sapphire water clarity, vibrant sea fan gardens, and regular pelagic action."
    }
  },
  {
    id: "boiler-wreck",
    name: {
      ar: "حطام سفينة البويلر وشِعاب أبو فراميش - جدة",
      en: "Boiler Wreck & Abu Faramish Reefs - Jeddah"
    },
    location: {
      ar: "شمال غرب جدة",
      en: "Northwest Jeddah"
    },
    depth: {
      ar: "12 - 38 متر",
      en: "12 - 38 meters"
    },
    level: {
      ar: "متوسط إلى متقدم",
      en: "Intermediate to Advanced"
    },
    visibility: {
      ar: "30 - 45 متر",
      en: "30 - 45 meters"
    },
    current: {
      ar: "متوسط",
      en: "Moderate"
    },
    marineLife: {
      ar: ["قروش الشعاب (Reef Sharks)", "سلاحف خضراء", "أسماك التونة والماكريل", "مستعمرات مرجان المروحة"],
      en: ["Reef Sharks", "Green Sea Turtles", "Pelagic Tuna", "Giant Sea Fans"]
    },
    description: {
      ar: "حطام سفينة بخارية عريقة استقرت على عمق يتيح رؤية مراجلها الضخمة وهيكلها المليء بالحياة البحرية والأسماك الكبيرة في مياه جدة الصافية.",
      en: "An iconic historic steamship wreck resting on coral shelves off Jeddah, featuring massive preserved steam boilers cloaked in vibrant soft corals and pelagic life."
    }
  },
  {
    id: "farasan",
    name: {
      ar: "محمية جزر فرسان البكر",
      en: "Farasan Islands Marine Reserve"
    },
    location: {
      ar: "منطقة جازان - جنوب البحر الأحمر",
      en: "Jizan - Southern Red Sea"
    },
    depth: {
      ar: "6 - 35 متر",
      en: "6 - 35 meters"
    },
    level: {
      ar: "جميع المستويات",
      en: "All Levels"
    },
    visibility: {
      ar: "30 - 45 متر",
      en: "30 - 45 meters"
    },
    current: {
      ar: "خفيف",
      en: "Mild"
    },
    marineLife: {
      ar: ["عرائس البحر (الأطوم Dugong)", "دلافين", "حيتان قرشية موسمية", "غابات مرجانية سوداء"],
      en: ["Dugongs (Sea Cows)", "Wild Dolphins", "Whale Sharks (seasonal)", "Black Coral Forests"]
    },
    description: {
      ar: "جنة التنوع البيولوجي في جنوب البحر الأحمر. بيئة بكر تماماً تضم أكبر تجمع للتنوع السمكي والمرجاني ومحمية طبيعية محمية بحرية مسجلة عالمياً.",
      en: "A pristine marine biosphere sanctuary in the southern Red Sea featuring untouched coral archipelagos, dugong sightings, and gentle slopes."
    }
  },
  {
    id: "sharm-obhur",
    name: {
      ar: "شاطئ وميدان شرم أبحر التدريبي",
      en: "Sharm Obhur Training Bay - Jeddah"
    },
    location: {
      ar: "أبحر الشمالية - جدة",
      en: "North Obhur - Jeddah"
    },
    depth: {
      ar: "3 - 18 متر",
      en: "3 - 18 meters"
    },
    level: {
      ar: "مبتدئين وتدريب",
      en: "Beginner & Skill Training"
    },
    visibility: {
      ar: "15 - 25 متر",
      en: "15 - 25 meters"
    },
    current: {
      ar: "هادئ جداً",
      en: "Calm / Protected"
    },
    marineLife: {
      ar: ["سمك المهرج (نيمو)", "أسماك الموراي والأسد", "أخطبوط البحر الأحمر", "مرجان الشجيرات"],
      en: ["Clownfish (Nemo)", "Moray Eels & Lionfish", "Red Sea Octopus", "Branching Corals"]
    },
    description: {
      ar: "الموقع المثالي والآمن لبدء أولى خطوات الغوص. مدخل شاطئي مريح ومدرج طبيعي ومسبح مفتوح محمي من التيارات والأمواج.",
      en: "The ideal, comfortable entry site for first-time divers. Protected lagoon waters, gentle gradual entry, and vibrant shallow coral nurseries."
    }
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: {
      ar: "م. أحمد الغامدي",
      en: "Eng. Ahmed Al-Ghamdi"
    },
    role: {
      ar: "غواص متقدم مرخص",
      en: "Certified Advanced Diver"
    },
    course: {
      ar: "دورة Open Water + Advanced",
      en: "Open Water + Advanced Course"
    },
    quote: {
      ar: "تجربة غيرت مفهومي عن البحر تماماً. كابتن فهد قمة في الأخلاق والهدوء والاحتراف، صبره معي في مهارات تفريغ القناع تحت الماء أزال خوفي تماماً. الآن لا يمر شهر دون أن أخرج معه في رحلة غوص!",
      en: "A transformative life experience. Captain Fahad is the pinnacle of patience, calm demeanor, and consummate professionalism. His coaching through mask-clearing skills completely conquered my fear. Now I join his boat charters every single month!"
    },
    date: {
      ar: "فبراير 2026",
      en: "February 2026"
    },
    avatarSeed: "Ahmed"
  },
  {
    id: "2",
    name: {
      ar: "د. سارة الحربي",
      en: "Dr. Sarah Al-Harbi"
    },
    role: {
      ar: "طبيبة وغواصة مياه مفتوحة",
      en: "Physician & Open Water Diver"
    },
    course: {
      ar: "دورة غواص المياه المفتوحة",
      en: "Open Water Diver Course"
    },
    quote: {
      ar: "كان لدي فوبيا قديمة من الأعماق، لكن أسلوب كابتن فهد في التدريب المتدرج داخل المسبح خطوة بخطوة أعطاني ثقة غير طبيعية. في أول غطسة بحرية في شرم أبحر شعرت بسلام واسترخاء لم أعشه من قبل.",
      en: "I previously struggled with a persistent water phobia, but Captain Fahad's progressive pool training gave me extraordinary composure. On my first open water dive in Sharm Obhur, I felt unprecedented tranquility."
    },
    date: {
      ar: "يناير 2026",
      en: "January 2026"
    },
    avatarSeed: "Sarah"
  },
  {
    id: "3",
    name: {
      ar: "أ. راكان باعقيل",
      en: "Rakan Ba-Akeel"
    },
    role: {
      ar: "غواص إنقاذ ونيتروكس",
      en: "Rescue Diver & Nitrox Diver"
    },
    course: {
      ar: "دورة غواص الإنقاذ (Rescue Diver)",
      en: "Rescue Diver Course"
    },
    quote: {
      ar: "دورة الإنقاذ مع كابتن فهد كانت تجربة مليئة بالتحدي واللياقة العالية. السيناريوهات الواقعية التي أعدها لنا في البحر كانت دقيقة ومفصلة جداً وصنعت منا غواصين يمكن الاعتماد عليهم في أصعب الظروف.",
      en: "The Rescue course under Captain Fahad's mentorship was rigorously challenging. The realistic drills he staged at sea shaped us into divers who can manage emergencies with coolheaded certainty."
    },
    date: {
      ar: "ديسمبر 2025",
      en: "December 2025"
    },
    avatarSeed: "Rakan"
  },
  {
    id: "4",
    name: {
      ar: "سلطان العتيبي",
      en: "Sultan Al-Otaibi"
    },
    role: {
      ar: "مرشح مرشد غوص (Divemaster)",
      en: "Divemaster Candidate"
    },
    course: {
      ar: "تخصص النيتروكس وغوص الحطام بجدة",
      en: "Nitrox & Jeddah Wreck Diving Specialty"
    },
    quote: {
      ar: "تنظيم رحلات السفاري مع كابتن فهد أسطوري! كل تفصيلة من معدات وتحليل نسب الأكسجين في أسطوانات النيتروكس إلى اختيار أوقات الغوص حسب المد والتيار مدروسة بعناية فائقة.",
      en: "Liveaboard expedition planning with Captain Fahad is world-class. From strict cylinder gas analysis to timing dive drops against tidal currents, every detail is masterfully executed."
    },
    date: {
      ar: "نوفمبر 2025",
      en: "November 2025"
    },
    avatarSeed: "Sultan"
  }
];

export const FAQS: FAQItem[] = [
  {
    question: {
      ar: "هل يشترط أن أكون سباحاً محترفاً للتسجيل في دورة الغوص؟",
      en: "Do I need to be an expert swimmer to learn scuba diving?"
    },
    answer: {
      ar: "لا يشترط الاحتراف على الإطلاق! المطلوب فقط هو قدرتك الأساسية على السباحة الحرة لمسافة 200 متر بأي أسلوب مريح وبدون قيود زمنية، والطفو على ظهرك في الماء لمدة 10 دقائق. مهارات الغوص نفسها تعتمد على الزعانف وسترة الطفو والمعدات.",
      en: "Not at all! You only need basic water comfort: completing a 200-meter continuous surface swim (any stroke, untimed) and floating/treading water for 10 minutes. Scuba equipment provides all the propulsion and buoyancy."
    }
  },
  {
    question: {
      ar: "كم تستغرق دورة المياه المفتوحة وما هي مواعيدها؟",
      en: "How long does the Open Water course take and what is the schedule?"
    },
    answer: {
      ar: "تستغرق الدورة عادة من 4 إلى 5 أيام. نحن نتميز بمرونة الجداول لتناسب أوقات عملك أو دراستك، حيث يمكن تقسيمها على عطلات نهاية الأسبوع (خميس - جمعة - سبت) أو أيام منتصف الأسبوع المسائية.",
      en: "The course generally spans 4 to 5 days. We offer flexible scheduling tailored around your career or academic commitments, easily spread over weekends (Thu/Fri/Sat) or weekday twilight sessions."
    }
  },
  {
    question: {
      ar: "هل المعدات مشمولة في سعر الدورة؟",
      en: "Is scuba equipment included in the course tuition?"
    },
    answer: {
      ar: "نعم بالكامل! سعر الدورة شامل جميع معدات الغوص الحديثة والمعقمة (بدلة الغوص، القناع، الزعانف، جهاز الطفو BCD، المنظمات، والأسطوانات) طوال فترة التدريب في المسبح والبحر، بالإضافة إلى الكتب الرقمية ورسوم إصدار الشهادة الدولية.",
      en: "Yes, 100% all-inclusive! Your tuition covers sanitized modern gear (wetsuit, mask, fins, BCD, regulators, and cylinders) throughout both pool and sea phases, plus official digital materials and certification processing."
    }
  },
  {
    question: {
      ar: "هل الشهادة معترف بها دولياً؟",
      en: "Is the certification internationally recognized?"
    },
    answer: {
      ar: "بالتأكيد. الشهادة صادرة من المنظمة العالمية الأولى للغوص (PADI) ومعترف بها في أكثر من 180 دولة حول العالم مدى الحياة، وتتيح لك استئجار المعدات والغوص في أي مركز غوص عالمي.",
      en: "Absolutely. Credentials are issued directly by the world's leading scuba agency (PADI), valid for a lifetime in over 180 countries, empowering you to rent gear and dive at any center worldwide."
    }
  },
  {
    question: {
      ar: "ما هو الحد الأدنى للعمر المسموح به؟",
      en: "What is the minimum age requirement for scuba certification?"
    },
    answer: {
      ar: "يبدأ الغوص من سن 10 سنوات (يحصل على رخصة غواص مياه مفتوحة ناشئ Junior Open Water حتى سن 15 عاماً ليتحول تلقائياً إلى غواص بالغ). لا يوجد حد أعلى للعمر طالما أن الحالة الصحية والبدنية لائقة.",
      en: "Children as young as 10 can certify (earning a Junior Open Water rating which automatically upgrades at age 15). There is no upper age limit as long as general medical fitness is maintained."
    }
  }
];
