import { Course, Lang } from '../data/divingData';
import {
  BookingQAAnswers,
  CourseEligibilityEvaluation,
  EligibilityStatus,
  HighestCertification,
  IssuingAgency,
} from '../types/admin';

export type CourseKind =
  | 'discover_scuba'
  | 'open_water'
  | 'advanced'
  | 'nitrox'
  | 'deep'
  | 'rescue'
  | 'divemaster'
  | 'custom';

export type AdaptiveQuestionId =
  | 'highestCert'
  | 'issuingAgency'
  | 'hasAdventureAndNav'
  | 'hasValidEfrCpr'
  | 'loggedDivesRange'
  | 'lastDiveRecency'
  | 'medicalClearanceReady';

export interface QuestionOption<T extends string = string> {
  value: T;
  labelAr: string;
  labelEn: string;
  hintAr?: string;
  hintEn?: string;
}

export interface AdaptiveQuestion {
  id: AdaptiveQuestionId;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  options: QuestionOption[];
  allowOtherInput?: 'otherCertName' | 'otherAgencyName';
  otherPlaceholderAr?: string;
  otherPlaceholderEn?: string;
}

export const HIGHEST_CERT_OPTIONS: QuestionOption<HighestCertification>[] = [
  {
    value: 'none',
    labelAr: 'لا أملك شهادة',
    labelEn: 'No certification yet',
    hintAr: 'مبتدئ أو تجربة أولى في الغوص',
    hintEn: 'Beginner or first-time diver',
  },
  {
    value: 'open_water',
    labelAr: 'Open Water',
    labelEn: 'Open Water',
    hintAr: 'غواص مياه مفتوحة (حتى 18م)',
    hintEn: 'Open Water Diver (to 18m)',
  },
  {
    value: 'advanced_open_water',
    labelAr: 'Advanced Open Water',
    labelEn: 'Advanced Open Water',
    hintAr: 'غواص مياه مفتوحة متقدم (حتى 30م)',
    hintEn: 'Advanced Open Water Diver (to 30m)',
  },
  {
    value: 'rescue_diver',
    labelAr: 'Rescue Diver',
    labelEn: 'Rescue Diver',
    hintAr: 'غواص إنقاذ معتمد',
    hintEn: 'Certified Rescue Diver',
  },
  {
    value: 'divemaster',
    labelAr: 'Divemaster',
    labelEn: 'Divemaster',
    hintAr: 'مرشد غوص محترف',
    hintEn: 'Certified Dive Professional',
  },
  {
    value: 'other',
    labelAr: 'شهادة أخرى',
    labelEn: 'Other certification',
    hintAr: 'شهادة تخصص أو مسمى آخر من أي منظمة',
    hintEn: 'Another dive rating or specialty title',
  },
];

export const ISSUING_AGENCY_OPTIONS: QuestionOption<Exclude<IssuingAgency, 'none'>>[] = [
  { value: 'PADI', labelAr: 'PADI', labelEn: 'PADI' },
  { value: 'SSI', labelAr: 'SSI', labelEn: 'SSI' },
  { value: 'NAUI', labelAr: 'NAUI', labelEn: 'NAUI' },
  { value: 'SDI', labelAr: 'SDI', labelEn: 'SDI' },
  { value: 'RAID', labelAr: 'RAID', labelEn: 'RAID' },
  { value: 'CMAS', labelAr: 'CMAS', labelEn: 'CMAS' },
  { value: 'other', labelAr: 'منظمة أخرى', labelEn: 'Other organization' },
];

export const CERT_RANK: Record<HighestCertification, number> = {
  none: 0,
  other: 1, // Evaluated dynamically by Captain for equivalency
  open_water: 1,
  advanced_open_water: 2,
  rescue_diver: 3,
  divemaster: 4,
};

export function getHighestCertLabel(cert: HighestCertification | undefined, lang: Lang, otherName?: string): string {
  if (!cert) return lang === 'ar' ? 'غير محدد' : 'Not specified';
  const match = HIGHEST_CERT_OPTIONS.find((o) => o.value === cert);
  const base = match ? (lang === 'ar' ? match.labelAr : match.labelEn) : cert;
  if (cert === 'other' && otherName?.trim()) {
    return `${base} (${otherName.trim()})`;
  }
  return base;
}

export function getIssuingAgencyLabel(agency: IssuingAgency | undefined, lang: Lang, otherName?: string): string {
  if (!agency || agency === 'none') {
    return lang === 'ar' ? 'لا يوجد (بدون شهادة)' : 'None (No certification)';
  }
  const match = ISSUING_AGENCY_OPTIONS.find((o) => o.value === agency);
  const base = match ? (lang === 'ar' ? match.labelAr : match.labelEn) : agency;
  if (agency === 'other' && otherName?.trim()) {
    return `${base} (${otherName.trim()})`;
  }
  return base;
}

export function getEligibilityStatusLabel(status: EligibilityStatus | undefined, lang: Lang): string {
  switch (status) {
    case 'eligible':
      return lang === 'ar' ? 'مؤهل مبدئياً' : 'Preliminarily Eligible';
    case 'missing_requirements':
      return lang === 'ar' ? 'توجد متطلبات ناقصة' : 'Missing Requirements';
    case 'pending_instructor_review':
      return lang === 'ar' ? 'بانتظار مراجعة الكابتن' : 'Pending Captain Review';
    case 'approved':
      return lang === 'ar' ? 'موافق عليه نهائياً' : 'Approved (Payment Open)';
    case 'rejected':
      return lang === 'ar' ? 'مرفوض' : 'Rejected';
    default:
      return lang === 'ar' ? 'بانتظار المراجعة' : 'Pending Review';
  }
}

export function detectCourseKind(course: Pick<Course, 'id' | 'category' | 'title' | 'prerequisites'>): CourseKind {
  const id = (course.id || '').toLowerCase();
  const text = `${id} ${course.title?.en || ''} ${course.title?.ar || ''}`.toLowerCase();

  if (id === 'discover-scuba' || text.includes('discover scuba') || text.includes('تجربة الغوص') || text.includes('try dive')) {
    return 'discover_scuba';
  }
  if (id === 'open-water' || (text.includes('open water') && !text.includes('advanced'))) {
    return 'open_water';
  }
  if (id === 'advanced-open-water' || text.includes('advanced open water') || text.includes('المتقدم')) {
    return 'advanced';
  }
  if (id === 'nitrox-specialty' || text.includes('nitrox') || text.includes('نيتروكس') || text.includes('الهواء المخصب')) {
    return 'nitrox';
  }
  if (id === 'deep-specialty' || text.includes('deep diver') || text.includes('الغوص العميق') || text.includes('40 متر')) {
    return 'deep';
  }
  if (id === 'rescue-diver' || text.includes('rescue') || text.includes('الإنقاذ')) {
    return 'rescue';
  }
  if (id === 'divemaster' || text.includes('divemaster') || text.includes('مرشد الغوص')) {
    return 'divemaster';
  }
  return 'custom';
}

export function isExternalAgency(answers: Partial<BookingQAAnswers>): boolean {
  if (!answers.highestCert || answers.highestCert === 'none') return false;
  if (answers.highestCert === 'other') return true;
  if (answers.issuingAgency && answers.issuingAgency !== 'PADI' && answers.issuingAgency !== 'none') {
    return true;
  }
  return false;
}

/**
 * Generates the exact minimal list of adaptive questions required for the selected courses.
 * - Never repeats known info.
 * - Skips agency if customer has no certification.
 * - Asks Adventure Diver + Navigation dive ONLY when Rescue is chosen and user is Open Water / Other.
 * - Asks EFR/CPR ONLY when Rescue or Divemaster is chosen (and user has a cert).
 * - Asks logged dive count & last dive date ONLY when Divemaster (or a course requiring dive count) is chosen.
 */
export function getAdaptiveQuestions(
  selectedCourses: Course[],
  answers: Partial<BookingQAAnswers>
): AdaptiveQuestion[] {
  const kinds = new Set(selectedCourses.map(detectCourseKind));
  const needsRescue = kinds.has('rescue');
  const needsDivemaster = kinds.has('divemaster');
  const needsCustomDiveCheck = selectedCourses.some((c) => {
    const k = detectCourseKind(c);
    if (k !== 'custom') return false;
    const prereqText = `${c.prerequisites?.ar || ''} ${c.prerequisites?.en || ''}`.toLowerCase();
    return /غطسة|logged dive|dive count/.test(prereqText);
  });

  const questions: AdaptiveQuestion[] = [];

  // Q1: Always ask highest diving certification
  questions.push({
    id: 'highestCert',
    titleAr: 'ما أعلى شهادة غوص حصلت عليها؟',
    titleEn: 'What is the highest diving certification you hold?',
    subtitleAr: 'نعتمد على مؤهلاتك الفعلية دون اشتراط أي سجل مشتريات سابق في المركز.',
    subtitleEn: 'We evaluate your actual qualifications directly—no prior center purchase history needed.',
    options: HIGHEST_CERT_OPTIONS,
    allowOtherInput: 'otherCertName',
    otherPlaceholderAr: 'اكتب اسم الشهادة باختصار (اختياري)...',
    otherPlaceholderEn: 'Enter certification name briefly (optional)...',
  });

  const cert = answers.highestCert;
  // If user hasn't answered Q1 yet or has no certification, stop asking cert-dependent questions
  if (!cert || cert === 'none') {
    return questions;
  }

  // Q2: Issuing organization (only when certified)
  questions.push({
    id: 'issuingAgency',
    titleAr: 'من أي منظمة حصلت على الشهادة؟',
    titleEn: 'Which organization issued your certification?',
    subtitleAr: 'نقبل الشهادات الدولية ونُحيل الشهادات غير التابعة لـ PADI للكابتن للتحقق من المعادلة.',
    subtitleEn: 'External agencies are welcomed and referred to the Captain for equivalency verification.',
    options: ISSUING_AGENCY_OPTIONS,
    allowOtherInput: 'otherAgencyName',
    otherPlaceholderAr: 'اسم المنظمة (اختياري)...',
    otherPlaceholderEn: 'Organization name (optional)...',
  });

  // Q3a: Adventure Diver + Navigation Dive (ONLY if Rescue is selected AND cert is Open Water or Other)
  if (needsRescue && (cert === 'open_water' || cert === 'other')) {
    questions.push({
      id: 'hasAdventureAndNav',
      titleAr: 'هل أكملت شهادة Adventure Diver مع غطسة الملاحة تحت الماء (Navigation Dive)؟',
      titleEn: 'Have you completed Adventure Diver including the Underwater Navigation Dive?',
      subtitleAr: 'سؤال إضافي مخصص لتحديد جاهزيتك لدورة غواص الإنقاذ (Rescue Diver).',
      subtitleEn: 'Targeted check required specifically for Rescue Diver eligibility.',
      options: [
        {
          value: 'yes',
          labelAr: 'نعم، أكملت Adventure Diver وغطسة الملاحة',
          labelEn: 'Yes, completed Adventure Diver & Navigation dive',
        },
        {
          value: 'no',
          labelAr: 'لا، لم أكملها بعد',
          labelEn: 'No, not completed yet',
        },
        {
          value: 'unsure',
          labelAr: 'لست متأكداً / أحتاج مراجعة الكابتن',
          labelEn: 'Not sure / Need Captain check',
        },
      ],
    });
  }

  // Q3b: EFR / CPR & First Aid (ONLY if Rescue or Divemaster is selected)
  if (needsRescue || needsDivemaster) {
    questions.push({
      id: 'hasValidEfrCpr',
      titleAr: 'هل لديك شهادة إسعافات أولية وإنعاش قلبي رئوي (EFR / CPR & First Aid) سارية خلال آخر 24 شهراً؟',
      titleEn: 'Do you hold a valid CPR & First Aid certification (EFR Primary & Secondary Care) within the last 24 months?',
      subtitleAr: 'متطلب إلزامي لدورات الإنقاذ وإرشاد الغوص وفق معايير PADI.',
      subtitleEn: 'Required credential for Rescue Diver and Divemaster per PADI standards.',
      options: [
        {
          value: 'yes',
          labelAr: 'نعم، لدي شهادة إسعافات وإنعاش سارية',
          labelEn: 'Yes, I hold a valid CPR & First Aid cert',
        },
        {
          value: 'no',
          labelAr: 'لا، لا أملكها أو انتهت صلاحيتها',
          labelEn: 'No, I do not have a current one',
        },
        {
          value: 'unsure',
          labelAr: 'لست متأكداً من صلاحيتها',
          labelEn: 'Unsure about validity',
        },
      ],
    });
  }

  // Q3c & Q3d: Logged dives & last dive date ONLY when Divemaster or custom dive-log course requires it
  if (needsDivemaster || needsCustomDiveCheck) {
    questions.push({
      id: 'loggedDivesRange',
      titleAr: 'كم عدد الغطسات المسجلة (Logged Dives) لديك تقريباً؟',
      titleEn: 'Approximately how many logged dives do you have?',
      subtitleAr: 'يُطلب عدد الغطسات فقط للبرامج الاحترافية التي تشترط حداً أدنى من الغوصات.',
      subtitleEn: 'Dive count is only requested for professional courses with minimum dive requirements.',
      options: [
        {
          value: '0-19',
          labelAr: 'أقل من 20 غطسة',
          labelEn: 'Fewer than 20 dives',
        },
        {
          value: '20-39',
          labelAr: 'من 20 إلى 39 غطسة',
          labelEn: '20 to 39 logged dives',
        },
        {
          value: '40+',
          labelAr: '40 غطسة فأكثر',
          labelEn: '40+ logged dives',
        },
      ],
    });

    questions.push({
      id: 'lastDiveRecency',
      titleAr: 'متى كانت آخر غطسة قمت بها؟',
      titleEn: 'When was your most recent dive?',
      subtitleAr: 'يساعد الكابتن على التأكد من الجاهزية العملية للالتحاق بالبرنامج الاحترافي.',
      subtitleEn: 'Helps the Captain confirm practical readiness for professional training.',
      options: [
        {
          value: 'within_6m',
          labelAr: 'خلال آخر 6 أشهر',
          labelEn: 'Within the last 6 months',
        },
        {
          value: '6m_to_1y',
          labelAr: 'من 6 أشهر إلى سنة',
          labelEn: '6 to 12 months ago',
        },
        {
          value: 'over_1y',
          labelAr: 'أكثر من سنة',
          labelEn: 'Over 1 year ago',
        },
      ],
    });
  }

  return questions;
}

export function evaluateCourseEligibility(
  course: Course,
  answers: BookingQAAnswers
): CourseEligibilityEvaluation {
  const kind = detectCourseKind(course);
  const cert = answers.highestCert;
  const external = isExternalAgency(answers);
  const missingAr: string[] = [];
  const missingEn: string[] = [];

  if (kind === 'open_water' || kind === 'discover_scuba') {
    // Open Water and Discover Scuba are open to anyone (even with no prior cert)
  } else if (kind === 'advanced' || kind === 'nitrox') {
    if (cert === 'none') {
      missingAr.push('شهادة غواص المياه المفتوحة (Open Water Diver) أو ما يعادلها.');
      missingEn.push('Open Water Diver certification (or recognized equivalent).');
    }
  } else if (kind === 'deep') {
    if (cert === 'none') {
      missingAr.push('شهادة غواص المياه المفتوحة (Open Water Diver).');
      missingAr.push('شهادة غواص المياه المفتوحة المتقدم (Advanced Open Water).');
      missingEn.push('Open Water Diver certification.');
      missingEn.push('Advanced Open Water Diver certification.');
    } else if (cert === 'open_water') {
      missingAr.push('شهادة غواص المياه المفتوحة المتقدم (Advanced Open Water) أو ما يعادلها.');
      missingEn.push('Advanced Open Water Diver certification (or equivalent).');
    }
  } else if (kind === 'rescue') {
    const hasAdvOrAdventureNav =
      cert === 'advanced_open_water' ||
      cert === 'rescue_diver' ||
      cert === 'divemaster' ||
      ((cert === 'open_water' || cert === 'other') && answers.hasAdventureAndNav === 'yes');

    const hasValidEfr = answers.hasValidEfrCpr === 'yes';

    if (!hasAdvOrAdventureNav) {
      if (cert === 'none') {
        missingAr.push('استيفاء شهادة غواص المياه المفتوحة (Open Water) ثم شهادة Adventure Diver وإكمال غطسة الملاحة المطلوبة.');
        missingEn.push('Open Water Diver followed by Adventure Diver with the Underwater Navigation Dive.');
      } else {
        missingAr.push('استيفاء متطلبات شهادة Adventure Diver وإكمال غطسة الملاحة المطلوبة (أو شهادة Advanced Open Water).');
        missingEn.push('Adventure Diver requirements including the Underwater Navigation Dive (or Advanced Open Water).');
      }
    }

    if (!hasValidEfr) {
      missingAr.push('شهادة إسعافات أولية وإنعاش قلبي سارية (EFR Primary & Secondary Care خلال آخر 24 شهراً) حسب معايير PADI.');
      missingEn.push('Valid CPR & First Aid certification (EFR Primary & Secondary Care within 24 months) per PADI standards.');
    }
  } else if (kind === 'divemaster') {
    const hasRescueOrHigher = cert === 'rescue_diver' || cert === 'divemaster';
    if (!hasRescueOrHigher && cert !== 'other') {
      missingAr.push('شهادة غواص الإنقاذ (Rescue Diver) أو ما يعادلها.');
      missingEn.push('Rescue Diver certification (or recognized equivalent).');
    }
    if (answers.hasValidEfrCpr !== 'yes') {
      missingAr.push('شهادة إسعافات أولية وإنعاش قلبي سارية (EFR خلال آخر 24 شهراً).');
      missingEn.push('Valid CPR & First Aid certification (EFR within 24 months).');
    }
    if (answers.loggedDivesRange !== '40+') {
      missingAr.push('إتمام 40 غطسة مسجلة على الأقل للالتحاق بالبرنامج (و60 غطسة عند التخرج).');
      missingEn.push('Minimum 40 logged dives to begin training (60 logged dives for certification).');
    }
  } else {
    // Custom course added in admin: check if it requires prior cert
    const prereq = `${course.prerequisites?.ar || ''} ${course.prerequisites?.en || ''}`.toLowerCase();
    if (
      cert === 'none' &&
      (prereq.includes('open water') || prereq.includes('رخصة') || prereq.includes('متقدم') || prereq.includes('rescue'))
    ) {
      missingAr.push(course.prerequisites?.ar || 'استيفاء متطلبات التأهيل المسبقة للدورة.');
      missingEn.push(course.prerequisites?.en || 'Prior certification prerequisite for this course.');
    }
  }

  const isEligible = missingAr.length === 0;
  let guidanceMessageAr = '';
  let guidanceMessageEn = '';

  if (isEligible) {
    if (external) {
      guidanceMessageAr =
        'مؤهل مبدئياً بناءً على إجاباتك، ونظراً لأن شهادتك من منظمة أخرى سيقوم الكابتن بمراجعة معادلة الشهادة واعتمادها قبل فتح الدفع.';
      guidanceMessageEn =
        'Preliminarily eligible based on your answers. Because your credential is from an external agency, the Captain will verify equivalency before opening payment.';
    } else {
      guidanceMessageAr = 'مؤهل مبدئياً للتسجيل؛ يخضع الطلب لمراجعة وموافقة الكابتن النهائية قبل تفعيل الدفع.';
      guidanceMessageEn = 'Preliminarily eligible; subject to final Captain review and approval before payment opens.';
    }
  } else if (kind === 'rescue') {
    const missingAdv = missingAr.some((m) => m.includes('Adventure Diver'));
    const missingEfr = missingAr.some((m) => m.includes('إسعافات'));

    if (missingAdv && missingEfr) {
      guidanceMessageAr =
        'للتسجيل في دورة Rescue Diver، تحتاج أولاً إلى استيفاء متطلبات شهادة Adventure Diver وإكمال غطسة الملاحة المطلوبة، بالإضافة إلى شهادة إسعافات أولية وإنعاش قلبي سارية حسب معايير PADI.\nيمكنك استكمال هذه المتطلبات ثم التقديم على الدورة.';
      guidanceMessageEn =
        'To enroll in Rescue Diver, you first need to complete the Adventure Diver requirements including the Underwater Navigation Dive, along with a valid CPR and First Aid certification per PADI standards.\nYou can complete these prerequisites and apply for the course.';
    } else if (missingAdv) {
      guidanceMessageAr =
        'للتسجيل في دورة Rescue Diver، تحتاج أولاً إلى استيفاء متطلبات شهادة Adventure Diver وإكمال غطسة الملاحة المطلوبة حسب معايير PADI.\nيمكنك استكمال هذا المتطلب ثم التقديم على الدورة.';
      guidanceMessageEn =
        'To enroll in Rescue Diver, you first need to complete the Adventure Diver requirements including the Underwater Navigation Dive per PADI standards.\nYou can complete this requirement and apply.';
    } else {
      guidanceMessageAr =
        'للتسجيل في دورة Rescue Diver، تحتاج إلى شهادة إسعافات أولية وإنعاش قلبي سارية (EFR Primary & Secondary Care خلال آخر 24 شهراً) حسب معايير PADI.\nيمكنك استكمال هذا المتطلب أو طلب إضافته مع الكابتن.';
      guidanceMessageEn =
        'To enroll in Rescue Diver, you need a valid CPR and First Aid certification (EFR within 24 months) per PADI standards.\nYou can complete this requirement or arrange it with the Captain.';
    }
  } else {
    guidanceMessageAr = `للتسجيل في ${course.title.ar}، تحتاج أولاً إلى استيفاء المتطلبات التالية:\n• ${missingAr.join('\n• ')}\nيمكنك استكمال المتطلبات الناقصة أو إرسال الطلب ليستعرضه الكابتن ويوجهك للخطوة التالية.`;
    guidanceMessageEn = `To enroll in ${course.title.en}, you first need to meet:\n• ${missingEn.join('\n• ')}\nYou may complete these prerequisites or submit the request for Captain guidance.`;
  }

  return {
    courseId: course.id,
    titleAr: course.title.ar,
    titleEn: course.title.en,
    priceAr: course.price.ar,
    priceEn: course.price.en,
    status: isEligible ? 'eligible' : 'missing_requirements',
    needsEquivalency: external && kind !== 'open_water' && kind !== 'discover_scuba',
    missingRequirementsAr: missingAr,
    missingRequirementsEn: missingEn,
    guidanceMessageAr,
    guidanceMessageEn,
  };
}

export function evaluateAllSelectedCourses(courses: Course[], answers: BookingQAAnswers) {
  const evaluations = courses.map((c) => evaluateCourseEligibility(c, answers));
  const eligibleCount = evaluations.filter((e) => e.status === 'eligible').length;
  const missingCount = evaluations.filter((e) => e.status === 'missing_requirements').length;
  const anyEquivalencyRequired = evaluations.some((e) => e.needsEquivalency) || isExternalAgency(answers);
  const overallPreliminaryStatus: 'eligible' | 'missing_requirements' =
    missingCount === 0 && evaluations.length > 0 ? 'eligible' : 'missing_requirements';

  return {
    evaluations,
    eligibleCount,
    missingCount,
    anyEquivalencyRequired,
    overallPreliminaryStatus,
  };
}

export function parseCoursePriceSar(priceStr: string): number {
  const digits = String(priceStr || '').replace(/[^\d.]/g, '');
  const num = parseFloat(digits);
  return Number.isFinite(num) ? num : 0;
}
