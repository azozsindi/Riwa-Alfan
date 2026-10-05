/**
 * Centralized contact constants and default center information.
 * Used across the app to eliminate magic strings and duplicate phone numbers.
 */

export const DEFAULT_CONTACT = {
  phone: '+966530549675',
  phoneDisplay: '053 054 9675',
  whatsappNumber: '966530549675',
  email: 'fahad@riwaalfan.com',
  locationAr: 'جدة، المملكة العربية السعودية - أبحر الشمالية',
  locationEn: 'Jeddah, Saudi Arabia - North Obhur',
  padiMemberNumber: '482910',
} as const;

export const generateWhatsAppLink = (number: string, message: string): string => {
  const cleanNumber = number.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};
