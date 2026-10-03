/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { SiteConfigProvider, useSiteConfig } from './context/SiteConfigContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { InstructorSection } from './components/InstructorSection';
import { CoursesSection } from './components/CoursesSection';
import { DiverToolsSection } from './components/DiverToolsSection';
import { DiveSitesSection } from './components/DiveSitesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AdminPage } from './pages/AdminPage';
import { MessageCircle, Phone, Anchor } from 'lucide-react';

function AppContent() {
  const { isRtl, language } = useLanguage();
  const { navigate, isAdmin } = useRouter();
  
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(undefined);
  const [selectedTripSite, setSelectedTripSite] = useState<string | undefined>(undefined);

  // Hidden keyboard shortcut for Captain Fahad: (Alt + A) or (Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        navigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // If URL is /admin, render dedicated Admin Page
  if (isAdmin) {
    return <AdminPage />;
  }

  const handleOpenBooking = (courseId?: string) => {
    setSelectedCourseId(courseId);
    setSelectedTripSite(undefined);
    setIsBookingOpen(true);
  };

  const handleBookTrip = (siteName: string) => {
    setSelectedCourseId(undefined);
    setSelectedTripSite(siteName);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedCourseId(undefined);
    setSelectedTripSite(undefined);
  };

  const handleExploreCourses = () => {
    const el = document.getElementById('courses');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white ${
      isRtl ? 'dir-rtl' : 'dir-ltr'
    }`}>
      {/* Top Promotional Announcement Bar */}
      <AnnouncementBar onClaimOffer={(courseId) => handleOpenBooking(courseId)} />

      {/* Top Header (Zero visible admin buttons for visitors) */}
      <Header 
        onOpenBooking={() => handleOpenBooking()} 
      />

      <main className="flex-1 pb-20 sm:pb-0">
        {/* Hero Section */}
        <Hero
          onOpenBooking={() => handleOpenBooking()}
          onExploreCourses={handleExploreCourses}
        />

        {/* Instructor Credentials & Philosophy */}
        <InstructorSection onOpenBooking={() => handleOpenBooking()} />

        {/* Certified Courses Catalog */}
        <CoursesSection onSelectCourseForBooking={(id) => handleOpenBooking(id)} />

        {/* Interactive Diver Tools & Calculators */}
        <DiverToolsSection />

        {/* Red Sea Dive Sites & Boat Safaris */}
        <DiveSitesSection onBookTrip={handleBookTrip} />

        {/* Student Testimonials */}
        <TestimonialsSection />

        {/* FAQs */}
        <FaqSection />

        {/* Contact & Consultation */}
        <ContactSection onOpenBooking={() => handleOpenBooking()} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Booking and Consultation Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        preSelectedCourseId={selectedCourseId}
        preSelectedTripSite={selectedTripSite}
      />

      {/* Desktop Floating WhatsApp Button */}
      <div className="hidden sm:block">
        <a
          href={`https://wa.me/966530549675?text=${encodeURIComponent(
            language === 'ar' 
              ? 'السلام عليكم كابتن فهد، أود الاستفسار عن تفاصيل دورات الغوص والرحلات القادمة بجدة' 
              : 'Hello Captain Fahad, I would like to inquire about certified scuba courses in Jeddah.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 end-5 z-40 p-3 sm:px-4 sm:py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/40 backdrop-blur-md border border-emerald-400/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer group"
          title={language === 'ar' ? 'محادثة واتساب مباشرة مع كابتن فهد' : 'Direct WhatsApp with Capt. Fahad'}
        >
          <MessageCircle className="w-5 h-5 fill-white text-emerald-600 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold">
            {language === 'ar' ? 'واتساب كابتن فهد' : 'WhatsApp'}
          </span>
        </a>
      </div>

      {/* Mobile Sticky Bottom Action Dock Bar (Optimized for Customer Conversions) */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-4 py-2 flex items-center justify-between gap-3 shadow-2xl safe-area-bottom">
        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/966530549675?text=${encodeURIComponent(
            language === 'ar' 
              ? 'السلام عليكم كابتن فهد، أود الاستفسار عن تفاصيل دورات الغوص والرحلات القادمة بجدة' 
              : 'Hello Captain Fahad, I would like to inquire about certified scuba courses in Jeddah.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-2 px-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold active:scale-95 transition-all text-center"
        >
          <MessageCircle className="w-4 h-4 mb-0.5 fill-current" />
          <span>{language === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
        </a>

        {/* Book Course Primary CTA */}
        <button
          onClick={() => handleOpenBooking()}
          className="flex-[2] flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-blue-600 active:bg-blue-500 text-white text-xs font-extrabold shadow-lg shadow-blue-600/40 active:scale-95 transition-all text-center cursor-pointer"
        >
          <Anchor className="w-4 h-4 shrink-0" />
          <span>{language === 'ar' ? 'احجز دورتك الآن' : 'Book Now'}</span>
        </button>

        {/* Direct Phone Call Button */}
        <a
          href="tel:+966530549675"
          className="flex-1 flex flex-col items-center justify-center py-2 px-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold active:scale-95 transition-all text-center"
        >
          <Phone className="w-4 h-4 mb-0.5 text-blue-400" />
          <span>{language === 'ar' ? 'اتصال' : 'Call'}</span>
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <LanguageProvider>
        <SiteConfigProvider>
          <AppContent />
        </SiteConfigProvider>
      </LanguageProvider>
    </RouterProvider>
  );
}
