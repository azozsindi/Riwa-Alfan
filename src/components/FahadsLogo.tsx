import React from 'react';

interface FahadsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
  variant?: 'riwa-alfan' | 'dive-family' | 'fahads';
  customImageUrl?: string;
  customTitle?: string;
  customSubtext?: string;
}

export const FahadsLogo: React.FC<FahadsLogoProps> = ({ 
  className = '', 
  size = 'md',
  theme = 'dark',
  variant = 'riwa-alfan',
  customImageUrl,
  customTitle,
  customSubtext
}) => {
  const isDark = theme === 'dark';
  
  // Sizing variants
  const heightClasses = {
    sm: 'h-10',
    md: 'h-14 sm:h-16',
    lg: 'h-24 sm:h-28'
  };

  if (customImageUrl) {
    return (
      <div className={`inline-flex items-center justify-center select-none ${heightClasses[size]} ${className}`}>
        <img 
          src={customImageUrl} 
          alt={customTitle || "Center Logo"} 
          className="h-full w-auto object-contain max-w-[200px]" 
        />
      </div>
    );
  }

  const diverColor = isDark ? '#E2E8F0' : '#2D3748';
  const textColor = '#256BE4'; // Exact vibrant blue from the logo
  const subtextColor = isDark ? '#CBD5E1' : '#1A202C';
  const lineColor = isDark ? '#64748B' : '#718096';

  let titleText = customTitle || "RIWA ALFAN";
  let subText = customSubtext || "DIVE CENTER · PADI";
  let fontSize = "42";

  if (variant === 'fahads') {
    titleText = "FAHAD'S";
    subText = "DIVING TRAINING";
    fontSize = "56";
  } else if (variant === 'dive-family') {
    titleText = "DIVE FAMILY";
    subText = "BY CAPT. FAHAD · PADI";
    fontSize = "44";
  }

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${heightClasses[size]} ${className}`}>
      <svg 
        viewBox="0 0 320 220" 
        className="h-full w-auto overflow-visible"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Scuba Diver Silhouette ascending/hovering */}
        <g transform="translate(132, 10) scale(0.95)">
          {/* Tank & Back mounted gear */}
          <rect x="18" y="24" width="13" height="34" rx="6" fill={diverColor} />
          <rect x="22" y="19" width="5" height="6" rx="2" fill={diverColor} />
          
          {/* Diver Head & Mask */}
          <circle cx="28" cy="12" r="8" fill={diverColor} />
          <path d="M33 11 C35 11, 37 13, 35 15 C34 16, 32 16, 31 15 Z" fill={textColor} opacity="0.9" />

          {/* Diver Torso & Wetsuit */}
          <path d="M22 24 C25 21, 33 21, 37 25 C40 30, 39 42, 36 50 C33 54, 25 54, 23 48 Z" fill={diverColor} />

          {/* Arms with hand signal */}
          <path d="M36 28 Q44 26 48 20 Q52 14 50 12 Q48 10 45 15 Q40 22 36 31 Z" fill={diverColor} />
          {/* Left arm balancing */}
          <path d="M22 28 Q14 32 16 38 Q18 40 22 36 Z" fill={diverColor} />

          {/* Legs & Fins in diving posture */}
          {/* Left Leg */}
          <path d="M25 50 Q23 66 18 80 Q16 86 14 96 L21 98 Q24 88 27 75 L31 52 Z" fill={diverColor} />
          {/* Left Fin */}
          <path d="M14 96 L6 122 Q12 124 20 114 L21 98 Z" fill={diverColor} />

          {/* Right Leg */}
          <path d="M33 51 Q36 68 40 82 Q42 88 47 96 L53 94 Q48 85 43 72 L37 51 Z" fill={diverColor} />
          {/* Right Fin */}
          <path d="M47 96 L62 118 Q55 122 47 114 L53 94 Z" fill={diverColor} />
        </g>

        {/* Wordmark in signature blue */}
        <text 
          x="160" 
          y="155" 
          textAnchor="middle" 
          fill={textColor}
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Segoe UI', Roboto, sans-serif" 
          fontWeight="900" 
          fontSize={fontSize}
          letterSpacing="2"
        >
          {titleText}
        </text>

        {/* Horizontal rule with subtext */}
        <g transform="translate(0, 168)">
          {/* Left Line */}
          <line x1="16" y1="14" x2="74" y2="14" stroke={lineColor} strokeWidth="2.2" strokeLinecap="round" />
          
          {/* Subtext */}
          <text 
            x="160" 
            y="18" 
            textAnchor="middle" 
            fill={subtextColor}
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Segoe UI', Roboto, sans-serif" 
            fontWeight="800" 
            fontSize="12.5"
            letterSpacing="2"
          >
            {subText}
          </text>

          {/* Right Line */}
          <line x1="246" y1="14" x2="304" y2="14" stroke={lineColor} strokeWidth="2.2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};
