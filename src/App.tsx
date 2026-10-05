/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { SiteConfigProvider, useSiteConfig } from './context/SiteConfigContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { InstructorSection } from './components/InstructorSection';
import { CoursesSection } from './components/CoursesSection';
import { QuickPortalsSection } from './components/QuickPortalsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { PoliciesModal } from './components/PoliciesModal';
import { DiverToolsModal } from './components/DiverToolsModal';
import { DiveSitesModal } from './components/DiveSitesModal';
import { FaqModal } from './components/FaqModal';
import { AdminPage } from './pages/AdminPage';
import { DEFAULT_VISIBLE_SECTIONS } from './data/defaultConfig';

function AppContent() {
  const { isRtl } = useLanguage();
  const { navigate, isAdmin } = useRouter();
  const { config } = useSiteConfig();
  const sections = config.visibleSections || DEFAULT_VISIBLE_SECTIONS;
  
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isSitesOpen, setIsSitesOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
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
      {sections.announcement && (
        <AnnouncementBar onClaimOffer={(courseId) => handleOpenBooking(courseId)} />
      )}

      {/* Top Header */}
      <Header 
        onOpenBooking={() => handleOpenBooking()} 
        onOpenTools={sections.diverToolsModal ? () => setIsToolsOpen(true) : undefined}
        onOpenSites={sections.diveSitesModal ? () => setIsSitesOpen(true) : undefined}
        onOpenFaq={sections.faqModal ? () => setIsFaqOpen(true) : undefined}
      />

      <main className="flex-1">
        {/* Hero Section */}
        {sections.hero && (
          <Hero
            onOpenBooking={() => handleOpenBooking()}
            onExploreCourses={handleExploreCourses}
          />
        )}

        {/* Lead Instructor Credentials & Philosophy (Captain Fahad & Ladies Training Division) */}
        {(sections.instructor || sections.femaleTraining || sections.quoteBanner) && (
          <InstructorSection 
            onOpenBooking={() => handleOpenBooking()} 
            showCaptainFahad={sections.instructor}
            showFemaleTraining={sections.femaleTraining}
            showQuote={sections.quoteBanner}
          />
        )}

        {/* Certified Courses Catalog (Streamlined Top 3 with Expansion) */}
        {sections.courses && (
          <CoursesSection onSelectCourseForBooking={(id) => handleOpenBooking(id)} />
        )}

        {/* Interactive Quick Portals: Dive Sites, FAQs, Diver Calculators */}
        {sections.quickPortals && (sections.diveSitesModal || sections.faqModal || sections.diverToolsModal) && (
          <QuickPortalsSection
            onOpenSites={() => setIsSitesOpen(true)}
            onOpenFaq={() => setIsFaqOpen(true)}
            onOpenTools={() => setIsToolsOpen(true)}
          />
        )}

        {/* Student Testimonials */}
        {sections.testimonials && (
          <TestimonialsSection />
        )}

        {/* Contact & Consultation */}
        {sections.contact && (
          <ContactSection onOpenBooking={() => handleOpenBooking()} />
        )}
      </main>

      {/* Footer with Modals Triggers */}
      {sections.footer && (
        <Footer 
          onOpenPolicies={() => setIsPoliciesOpen(true)} 
          onOpenTools={sections.diverToolsModal ? () => setIsToolsOpen(true) : undefined}
          onOpenSites={sections.diveSitesModal ? () => setIsSitesOpen(true) : undefined}
          onOpenFaq={sections.faqModal ? () => setIsFaqOpen(true) : undefined}
        />
      )}

      {/* Interactive Diver Tools & Calculators Modal */}
      <DiverToolsModal
        isOpen={isToolsOpen}
        onClose={() => setIsToolsOpen(false)}
      />

      {/* Jeddah Dive Sites & Coral Reefs Modal */}
      <DiveSitesModal
        isOpen={isSitesOpen}
        onClose={() => setIsSitesOpen(false)}
        onBookTrip={handleBookTrip}
      />

      {/* FAQs Modal */}
      <FaqModal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
      />

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
    <AuthProvider>
      <RouterProvider>
        <LanguageProvider>
          <SiteConfigProvider>
            <AppContent />
          </SiteConfigProvider>
        </LanguageProvider>
      </RouterProvider>
    </AuthProvider>
  );
}
