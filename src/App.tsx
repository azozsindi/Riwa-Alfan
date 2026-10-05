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
import { PoliciesSection } from './components/PoliciesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { PoliciesModal } from './components/PoliciesModal';
import { AdminPage } from './pages/AdminPage';
import { MessageCircle, Phone, Anchor } from 'lucide-react';

function AppContent() {
  const { isRtl, language } = useLanguage();
  const { navigate, isAdmin } = useRouter();
  
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);
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

        {/* Official Policies & Regulations (Trips, Courses & Safety) */}
        <PoliciesSection />

        {/* Contact & Consultation */}
        <ContactSection onOpenBooking={() => handleOpenBooking()} />
      </main>

      {/* Footer */}
      <Footer onOpenPolicies={() => setIsPoliciesOpen(true)} />

      {/* Booking and Consultation Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        preSelectedCourseId={selectedCourseId}
        preSelectedTripSite={selectedTripSite}
      />

      {/* Official Policies, Refund & Safety Modal */}
      <PoliciesModal
        isOpen={isPoliciesOpen}
        onClose={() => setIsPoliciesOpen(false)}
      />
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
