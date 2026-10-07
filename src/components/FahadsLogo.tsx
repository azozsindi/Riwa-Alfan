import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';

interface FahadsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light';
  variant?: 'riwa-alfan' | 'dive-family' | 'fahads';
  customImageUrl?: string;
  customTitle?: string;
  customSubtext?: string;
  fontFamily?: string;
  showWordmark?: boolean;
  language?: 'ar' | 'en';
}

export const FahadsLogo: React.FC<FahadsLogoProps> = ({ 
  className = '', 
  size = 'md', 
  theme = 'dark', 
  customImageUrl, 
  customTitle, 
  showWordmark = true, 
  language 
}) => {
  const uid = React.useId().replace(/:/g, '');
  const isDark = theme === 'dark';
  
  const langContext = useLanguage();
  const siteConfig = useSiteConfig();

  const currentLang = language || langContext?.language || 'ar';

  // Global automatic fallback to active site config
  let siteCustomImage: string | undefined;
  let siteTitle: string | undefined;
  let siteSubtext: string | undefined;
  let siteLogoBg: 'white' | 'dark' | 'transparent' = 'white';

  if (siteConfig?.config?.brand) {
    const b = siteConfig.config.brand;
    if (b.logoType === 'custom-image' && b.customLogoUrl) {
      siteCustomImage = b.customLogoUrl;
    }
    siteTitle = b.logoText || (currentLang === 'ar' ? b.centerNameAr : b.centerNameEn);
    siteSubtext = b.logoSubtext;
    if (b.logoBg) {
      siteLogoBg = b.logoBg;
    }
  }

  const activeImageUrl = customImageUrl !== undefined ? customImageUrl : siteCustomImage;
  const activeTitle = customTitle !== undefined ? customTitle : siteTitle;

  // Responsive height scale
  const heightClasses = {
    sm: 'h-10 sm:h-11',
    md: 'h-14 sm:h-16',
    lg: 'h-20 sm:h-24',
    xl: 'h-28 sm:h-32'
  };

  // If a custom image logo is configured, display it globally with pristine aspect ratio
  if (activeImageUrl) {
    const isWhiteBg = siteLogoBg !== 'dark' && siteLogoBg !== 'transparent';
    return (
      <div className={`inline-flex items-center justify-center select-none ${isWhiteBg ? 'bg-white rounded-xl p-1 shadow-sm' : ''} ${heightClasses[size]} ${className}`}>
        <img 
          src={activeImageUrl} 
          alt={activeTitle || "رواء الفن - Riwa Alfan"} 
          className="h-full w-auto object-contain max-w-[260px] drop-shadow-sm transition-all" 
        />
      </div>
    );
  }

  // Color values matching user's official brand identity
  // Primary 1: Warm Antique Sand Gold
  const goldPrimary = '#C59B5F';
  const goldLight = '#D8B077';
  const goldDark = '#A87D43';

  // Primary 2: Deep Red Sea Marine Navy
  const navyPrimary = isDark ? '#244578' : '#142749';
  const navySecondary = isDark ? '#18315B' : '#0F1E38';
  const navyStroke = isDark ? '#3D68A8' : '#1B3666';

  return (
    <div className={`inline-flex items-center justify-center select-none ${heightClasses[size]} ${className}`}>
      <svg 
        viewBox={showWordmark ? "0 0 340 130" : "0 0 160 130"} 
        className="h-full w-auto overflow-visible"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic Antique Gold Gradient */}
          <linearGradient id={`goldGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={goldLight} />
            <stop offset="50%" stopColor={goldPrimary} />
            <stop offset="100%" stopColor={goldDark} />
          </linearGradient>

          {/* Luxury Marine Royal Navy Gradient */}
          <linearGradient id={`navyGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={navyStroke} />
            <stop offset="60%" stopColor={navyPrimary} />
            <stop offset="100%" stopColor={navySecondary} />
          </linearGradient>

          {/* Subtle Outer Glow Filter for Dark Mode Presence */}
          {isDark && (
            <filter id={`goldGlow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#C59B5F" floodOpacity="0.35" />
            </filter>
          )}
        </defs>

        {/* 1. EMBLEM: The Interlocking 'RA' Monogram */}
        <g transform="translate(10, 8) scale(0.92)">
          {/* The Navy Blue 'R' component */}
          {/* Top curve, loop and waist of R */}
          <path 
            d="M 12 18 C 36 18 78 22 84 56 C 88 78 70 90 50 92 L 78 126 L 54 126 L 27 94 L 12 94 L 12 75 L 44 75 C 57 75 66 69 64 56 C 62 43 49 37 28 37 L 12 37 Z" 
            fill={`url(#navyGrad-${uid})`} 
            stroke={isDark ? navyStroke : 'none'} 
            strokeWidth={isDark ? "0.6" : "0"} 
          />

          {/* Central bottom wedge of the A counter */}
          <path 
            d="M 75 126 L 89 104 C 94 96 102 96 107 104 L 121 126 Z" 
            fill={`url(#navyGrad-${uid})`} 
            stroke={isDark ? navyStroke : 'none'} 
            strokeWidth={isDark ? "0.6" : "0"} 
          />

          {/* The Antique Gold 'A' diagonal stroke */}
          <path 
            d="M 98 48 L 113 72 L 152 126 L 127 126 L 98 86 L 88 72 Z" 
            fill={`url(#goldGrad-${uid})`} 
            filter={isDark ? `url(#goldGlow-${uid})` : undefined} 
          />
        </g>

        {/* 2. TYPOGRAPHY: Logotype "رواء الفن" / "Riwa Alfan" */}
        {showWordmark && (
          <g transform="translate(155, 20)">
            {/* Main Center Title */}
            <text 
              x="0" 
              y="58" 
              fontFamily={currentLang === 'ar' ? "'Alexandria', 'Cairo', 'Readex Pro', sans-serif" : "'Plus Jakarta Sans', sans-serif"} 
              fontSize={currentLang === 'ar' ? "40" : "36"} 
              fontWeight="900" 
              letterSpacing={currentLang === 'ar' ? "-0.5" : "0.2"} 
            >
              {currentLang === 'ar' ? (
                <>
                  <tspan fill={`url(#navyGrad-${uid})`}>رواء </tspan>
                  <tspan fill={`url(#goldGrad-${uid})`}>الفن</tspan>
                </>
              ) : (
                <>
                  <tspan fill={`url(#navyGrad-${uid})`}>Riwa </tspan>
                  <tspan fill={`url(#goldGrad-${uid})`}>Alfan</tspan>
                </>
              )}
            </text>

            {/* Subtitle */}
            <text 
              x="0" 
              y="86" 
              fill={isDark ? "#94A3B8" : "#475569"} 
              fontFamily="'Alexandria', 'Plus Jakarta Sans', sans-serif" 
              fontSize="12" 
              fontWeight="700" 
              letterSpacing="0.8" 
            >
              {currentLang === 'ar' ? (
                <>
                  <tspan fill={`url(#goldGrad-${uid})`}>غوص معتمد</tspan>
                  <tspan fill={isDark ? "#64748B" : "#94A3B8"}> · كابتن فهد PADI</tspan>
                </>
              ) : (
                <>
                  <tspan fill={`url(#goldGrad-${uid})`}>PADI DIVE</tspan>
                  <tspan fill={isDark ? "#64748B" : "#94A3B8"}> · JEDDAH</tspan>
                </>
              )}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
