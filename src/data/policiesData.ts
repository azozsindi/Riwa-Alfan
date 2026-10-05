/**
 * Official center policy data for Riwa Alfan Dive Center.
 * Compliant with PADI standards and Saudi Arabian consumer protection regulations.
 */

export interface PolicyRuleItem {
  id: string;
  label: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  variant: 'emerald' | 'amber' | 'blue';
}

export interface PolicySectionItem {
  id: string;
  title: {
    ar: string;
    en: string;
  };
  iconType: 'ship' | 'graduation' | 'shield';
  badgeNote: {
    ar: string;
    en: string;
  };
  rules: PolicyRuleItem[];
}

export const POLICIES_DATA: PolicySectionItem[] = [
  {
    id: 'boat-trips',
    title: {
      ar: '1. الرحلات البحرية ورحلات الغوص',
      en: '1. Boat Expeditions & Dive Trips',
    },
    iconType: 'ship',
    badgeNote: {
      ar: 'مرونة تنظيمية تضمن سلامتك أولاً',
      en: 'Prioritizing marine safety above all',
    },
    rules: [
      {
        id: 'refund-72h',
        label: {
          ar: 'قبل الموعد بـ 72 ساعة أو أكثر:',
          en: '72 Hours or More Before Trip:',
        },
        description: {
          ar: 'استرداد كامل للمبلغ المدفوع.',
          en: 'Full 100% refund of the paid amount.',
        },
        variant: 'emerald',
      },
      {
        id: 'no-refund-24h',
        label: {
          ar: 'أقل من 24 ساعة / عدم الحضور:',
          en: 'Less Than 24 Hours / No-Show:',
        },
        description: {
          ar: 'لا يوجد استرداد، ويتم إعادة الجدولة مع مراعاة الحقوق النظامية.',
          en: 'No refund; rescheduling is offered in accordance with statutory consumer rights.',
        },
        variant: 'amber',
      },
      {
        id: 'center-cancel',
        label: {
          ar: 'إلغاء الرحلة من قِبل المركز (لسوء الأحوال الجوية مثلاً):',
          en: 'Trip Cancellation by Center (e.g., Weather Conditions):',
        },
        description: {
          ar: 'يتم تقديم خيار إعادة الجدولة لأقرب موعد مناسب للعميل أو الخيارات النظامية البديلة.',
          en: 'Free rescheduling option is provided to the next suitable date or statutory alternatives.',
        },
        variant: 'blue',
      },
    ],
  },
  {
    id: 'courses',
    title: {
      ar: '2. دورات الغوص والتدريب',
      en: '2. Scuba Diving Courses & Training',
    },
    iconType: 'graduation',
    badgeNote: {
      ar: 'شهادات دولية معتمدة من PADI',
      en: 'Official PADI Worldwide Certifications',
    },
    rules: [
      {
        id: 'before-elearning',
        label: {
          ar: 'قبل إصدار الكتب الرقمية ورقم العضوية (PADI eLearning):',
          en: 'Before Issuing Digital Materials & PADI Member ID:',
        },
        description: {
          ar: 'يُقيَّم طلب الاسترداد وفق حالة التسجيل والأنظمة المعمول بها.',
          en: 'Refund request is evaluated according to registration status and regulations.',
        },
        variant: 'emerald',
      },
      {
        id: 'after-elearning',
        label: {
          ar: 'بعد إصدار الكتب الرقمية ورقم العضوية:',
          en: 'After Issuing Digital Books & Member ID:',
        },
        description: {
          ar: 'لا يمكن استرداد المبلغ نظراً لارتباط المواد باسم المتدرب دولياً، ولكن يُتاح طلب إعادة الجدولة وفق ضوابط ومواعيد المركز المتاحة.',
          en: 'Non-refundable due to personalized international licensing; rescheduling is readily offered based on available dates.',
        },
        variant: 'amber',
      },
      {
        id: 'extra-training',
        label: {
          ar: 'القصور أو الاحتياج لتدريب إضافي:',
          en: 'Additional Remedial Training Requirements:',
        },
        description: {
          ar: 'إذا احتاج المتدرب حصصاً إضافية لعدم إتقانه المهارات المطلوبة لاجتياز معايير PADI للسلامة، فتكون على حسابه الشخصي خارج رسوم الدورة.',
          en: 'If a student diver requires additional pool or open water sessions to meet mandatory PADI mastery standards, extra sessions are charged separately.',
        },
        variant: 'blue',
      },
    ],
  },
  {
    id: 'safety',
    title: {
      ar: '3. السلامة والمسؤولية',
      en: '3. Safety & Liability',
    },
    iconType: 'shield',
    badgeNote: {
      ar: 'السلامة أولاً وفق أعلى المعايير الدولية',
      en: 'Safety First · Highest Global Standards',
    },
    rules: [
      {
        id: 'instructions',
        label: {
          ar: 'الالتزام بالتعليمات والإفصاح الصحي:',
          en: 'Compliance with Instructions & Health Disclosure:',
        },
        description: {
          ar: 'يجب حضور المواعيد المحددة بدقة، واتباع تعليمات المدربين وطاقم القارب بدقة، والإفصاح الكامل عن أي حالات صحية تؤثر على أمان الغوص.',
          en: 'Punctual attendance, strict compliance with instructors and boat crew commands, and truthful medical history disclosure are mandatory.',
        },
        variant: 'blue',
      },
      {
        id: 'stop-work',
        label: {
          ar: 'إيقاف المشاركة لغايات السلامة:',
          en: 'Suspension of Participation for Safety:',
        },
        description: {
          ar: 'يحق للمركز أو المدرب منع أي شخص من المشاركة إذا كانت حالته أو سلوكه يمثل خطراً على السلامة العامة أو سلامته الشخصية.',
          en: 'The center or instructor reserves the right to halt participation if an individual’s condition or conduct poses a hazard.',
        },
        variant: 'amber',
      },
      {
        id: 'liability',
        label: {
          ar: 'حدود المسؤولية والحقوق النظامية:',
          en: 'Liability Limits & Statutory Rights:',
        },
        description: {
          ar: 'المركز غير مسؤول عن الإصابات الناتجة عن إهمال المتدرب أو مخالفَتِه لتعليمات السلامة، مع الالتزام التام بكافة الحقوق النظامية للمستهلك وفق أنظمة المملكة العربية السعودية.',
          en: 'The center is not liable for injuries resulting from trainee negligence or violation of safety directives, while fully honoring all consumer rights under Saudi Arabian regulations.',
        },
        variant: 'emerald',
      },
    ],
  },
];
