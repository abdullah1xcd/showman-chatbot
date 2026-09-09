/**
 * Detects whether the primary script of the text is Arabic or Latin
 * for proper RTL/LTR rendering and font pairing.
 */
export function isArabic(text: string): boolean {
  if (!text) return true;
  // Arabic Unicode ranges
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  const matchCount = (text.match(new RegExp(arabicRegex, 'g')) || []).length;
  const latinCount = (text.match(/[a-zA-Z]/g) || []).length;
  
  // Default to Arabic if Arabic characters are present or predominant
  return matchCount >= latinCount;
}

export function getTextDirection(text: string): 'rtl' | 'ltr' {
  return isArabic(text) ? 'rtl' : 'ltr';
}
