/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Shield, MessageCircle } from 'lucide-react';

function AppContent() {
  const { isRtl, language } = useLanguage();
  const { isAdminOpen, setIsAdminOpen } = useSiteConfig();
  
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(undefined);
  const [selectedTripSite, setSelectedTripSite] = useState<string | undefined>(undefined);
  
  // Admin auth modal state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const handleOpenAdminTrigger = () => {
    if (isAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    setIsAdminOpen(true);
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white ${
      isRtl ? 'dir-rtl' : 'dir-ltr'
    }`}>
      {/* Top Promotional Announcement Bar */}
      <AnnouncementBar onClaimOffer={(courseId) => handleOpenBooking(courseId)} />

      {/* Top Header */}
      <Header 
        onOpenBooking={() => handleOpenBooking()} 
        onOpenAdmin={handleOpenAdminTrigger}
      />

      <main className="flex-1">
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
      <Footer onOpenAdmin={handleOpenAdminTrigger} />

      {/* Booking and Consultation Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        preSelectedCourseId={selectedCourseId}
        preSelectedTripSite={selectedTripSite}
      />

      {/* Admin Login Modal (PIN check) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Full Admin Control Panel Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Floating Quick Admin Trigger Badge for Captain Fahad */}
      <button
        onClick={handleOpenAdminTrigger}
        className="fixed bottom-5 start-5 z-40 p-3 rounded-2xl bg-blue-600/90 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/40 backdrop-blur-md border border-blue-400/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer group"
        title={language === 'ar' ? 'لوحة تحكم الكابتن للموقع والعروض' : 'Captain Admin Dashboard'}
      >
        <Shield className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold hidden sm:inline">
          {language === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}
        </span>
      </button>

      {/* Floating Quick WhatsApp Chat Button */}
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
        <span className="text-xs font-bold hidden sm:inline">
          {language === 'ar' ? 'تواصل واتساب' : 'WhatsApp Us'}
        </span>
      </a>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <SiteConfigProvider>
        <AppContent />
      </SiteConfigProvider>
    </LanguageProvider>
  );
}
