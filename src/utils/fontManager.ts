/**
 * Font management and dynamic typography application for Riwa Alfan.
 */

export const FONT_VARIABLE_MAP: Record<string, string> = {
  alexandria: "'Alexandria', 'Plus Jakarta Sans', system-ui, sans-serif",
  cairo: "'Cairo', 'Plus Jakarta Sans', system-ui, sans-serif",
  readex: "'Readex Pro', 'Plus Jakarta Sans', system-ui, sans-serif",
  almarai: "'Almarai', 'Plus Jakarta Sans', system-ui, sans-serif",
  tajawal: "'Tajawal', 'Plus Jakarta Sans', system-ui, sans-serif"
};

export const ALL_FONT_CLASSES = [
  'font-alexandria', 
  'font-cairo', 
  'font-readex', 
  'font-almarai', 
  'font-tajawal'
];

export const applySiteFont = (fontFamily = 'alexandria') => {
  document.body.classList.remove(...ALL_FONT_CLASSES);
  document.body.classList.add(`font-${fontFamily}`);

  if (FONT_VARIABLE_MAP[fontFamily]) {
    document.documentElement.style.setProperty('--font-primary', FONT_VARIABLE_MAP[fontFamily]);
  }
};
