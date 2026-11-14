import { useEffect } from 'react';
import { SiteConfig } from '../types/admin';
import { Lang } from '../data/divingData';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function extractNumericPrice(priceText: string): string | undefined {
  const cleaned = priceText.replace(/,/g, '').match(/\d+(?:\.\d+)?/);
  return cleaned ? cleaned[0] : undefined;
}

export function useSeoSync(config: SiteConfig, language: Lang, isAdmin: boolean) {
  useEffect(() => {
    const isAr = language === 'ar';
    const host = window.location.hostname;
    const isPrimaryDomain = host.includes('riwaalfan.com');
    const origin = isPrimaryDomain ? 'https://riwaalfan.com' : window.location.origin;
    const cleanPath = isAdmin ? '/admin' : '/';
    const canonicalUrl = `${origin}${cleanPath}`;

    const brandNameAr = config.brand?.centerNameAr || 'رواء الفن';
    const brandNameEn = config.brand?.centerNameEn || 'Riwa Alfan';

    const title = isAdmin
      ? `${isAr ? 'لوحة الإدارة' : 'Admin Dashboard'} | ${isAr ? brandNameAr : brandNameEn}`
      : isAr
      ? `${brandNameAr} للغوص (${brandNameEn}) | دورات PADI ورحلات الغوص في جدة`
      : `${brandNameEn} Diving Center | PADI Scuba Courses & Red Sea Dives in Jeddah`;

    const description = isAdmin
      ? 'لوحة التحكم الإدارية لمركز رواء الفن للغوص بجدة.'
      : isAr
      ? `مركز ${brandNameAr} للغوص في ${config.brand?.locationAr || 'أبحر الشمالية - جدة'} بقيادة كابتن فهد الهويملي PADI. تجربة الغوص للمبتدئين، دورة غواص المياه المفتوحة والمتقدمة، تدريب نسائي خاص، ورحلات البحر الأحمر.`
      : `${brandNameEn} Diving Center in ${config.brand?.locationEn || 'North Obhur - Jeddah'} led by PADI Instructor Capt. Fahad Al-Huwaimli. Discover Scuba, PADI Open Water & Advanced courses, ladies training, and Red Sea expeditions.`;

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta(
      'name',
      'robots',
      isAdmin
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
    upsertCanonical(canonicalUrl);

    // OpenGraph & Twitter sync
    const coverImage = `${origin}/og-cover.jpg`;
    const logoImage = `${origin}/pwa-512x512.png`;

    upsertMeta('property', 'og:site_name', isAr ? `${brandNameAr} للغوص` : `${brandNameEn} Diving`);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', coverImage);
    upsertMeta('property', 'og:locale', isAr ? 'ar_SA' : 'en_US');

    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:url', canonicalUrl);
    upsertMeta('name', 'twitter:image', coverImage);

    if (isAdmin) {
      return;
    }

    // Structured data (@graph: WebSite, SportsActivityLocation + LocalBusiness, OfferCatalog, Course[], FAQPage)
    const socialUrls = [
      config.socialLinks?.instagram,
      config.socialLinks?.tiktok,
      config.socialLinks?.snapchat,
      config.socialLinks?.twitter,
      config.socialLinks?.youtube,
    ].filter((u): u is string => Boolean(u && u.trim()));

    const courses = config.courses || [];
    const faqs = config.faqs || [];

    const offerCatalogItems = courses.map((course, idx) => {
      const numericPrice = extractNumericPrice(course.price.ar || course.price.en);
      return {
        '@type': 'Offer',
        ...(numericPrice ? { price: numericPrice, priceCurrency: 'SAR' } : {}),
        availability: 'https://schema.org/InStock',
        url: `${origin}/#courses`,
        itemOffered: {
          '@type': 'Service',
          name: `${idx + 1}- ${course.title[language]}`,
          description: course.summary[language],
          provider: { '@id': `${origin}/#organization` },
        },
      };
    });

    if (config.femaleInstructor?.enabled !== false) {
      offerCatalogItems.push({
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        url: `${origin}/#instructor`,
        itemOffered: {
          '@type': 'Service',
          name: isAr
            ? 'القسم النسائي لتدريب الغوص في جدة'
            : "Private Women's Diving Training in Jeddah",
          description: isAr
            ? config.femaleInstructor?.bioAr || 'برامج تدريب غوص نسائية بإشراف مدربات PADI معتمدات في مسابح خاصة مغلقة بجدة.'
            : config.femaleInstructor?.bioEn || 'Private women scuba courses by certified female PADI instructors in Jeddah.',
          provider: { '@id': `${origin}/#organization` },
        },
      });
    }

    const courseEntities = courses.slice(0, 3).map((course) => {
      const numericPrice = extractNumericPrice(course.price.ar || course.price.en);
      return {
        '@type': 'Course',
        name: course.title[language],
        description: course.summary[language],
        provider: {
          '@type': 'Organization',
          name: `${brandNameAr} للغوص - ${brandNameEn}`,
          sameAs: origin,
        },
        ...(numericPrice
          ? {
              offers: {
                '@type': 'Offer',
                category: 'Paid',
                price: numericPrice,
                priceCurrency: 'SAR',
              },
            }
          : {}),
      };
    });

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${origin}/#website`,
          url: `${origin}/`,
          name: `${brandNameAr} للغوص`,
          alternateName: [brandNameAr, brandNameEn, `${brandNameEn} Diving`],
          inLanguage: ['ar', 'en'],
          publisher: { '@id': `${origin}/#organization` },
        },
        {
          '@type': ['SportsActivityLocation', 'LocalBusiness'],
          '@id': `${origin}/#organization`,
          name: `${brandNameAr} للغوص - ${brandNameEn} Diving`,
          alternateName: [brandNameAr, brandNameEn, 'كابتن فهد الهويملي PADI'],
          url: `${origin}/`,
          description,
          logo: {
            '@type': 'ImageObject',
            url: logoImage,
            width: 512,
            height: 512,
          },
          image: [coverImage, logoImage],
          telephone: config.brand?.phone || '+966530549675',
          email: config.brand?.email || 'Riwaalfan@gmail.com',
          priceRange: '$$',
          address: {
            '@type': 'PostalAddress',
            streetAddress: config.brand?.locationAr || 'أبحر الشمالية',
            addressLocality: 'جدة',
            addressRegion: 'منطقة مكة المكرمة',
            addressCountry: 'SA',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 21.741,
            longitude: 39.092,
          },
          areaServed: [
            { '@type': 'City', name: 'جدة' },
            { '@type': 'Place', name: 'أبحر الشمالية' },
            { '@type': 'Place', name: 'البحر الأحمر' },
          ],
          ...(socialUrls.length > 0 ? { sameAs: socialUrls } : {}),
          founder: {
            '@type': 'Person',
            name: config.instructor?.nameAr || 'كابتن فهد الهويملي',
            jobTitle: 'PADI Open Water Scuba Instructor',
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: isAr ? 'برامج ودورات الغوص المعتمدة في جدة' : 'Certified PADI Diving Programs in Jeddah',
            itemListElement: offerCatalogItems,
          },
        },
        ...courseEntities,
        ...(faqs.length > 0
          ? [
              {
                '@type': 'FAQPage',
                '@id': `${origin}/#faq`,
                mainEntity: faqs.slice(0, 6).map((item) => ({
                  '@type': 'Question',
                  name: item.question[language],
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer[language],
                  },
                })),
              },
            ]
          : []),
      ],
    };

    let script = document.getElementById('riwa-structured-data') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'riwa-structured-data';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, [config, language, isAdmin]);
}
