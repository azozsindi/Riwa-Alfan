/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { SiteConfigProvider, useSiteConfig } from './context/SiteConfigContext';
import { UnderConstructionBanner } from './components/UnderConstructionBanner';
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
import { BookingStatusModal } from './components/BookingStatusModal';
import { AdminPage } from './pages/AdminPage';
import { DEFAULT_VISIBLE_SECTIONS } from './data/defaultConfig';
import { CartProvider } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer';
import { FloatingCartButton } from './components/FloatingCartButton';

function AppContent() {
  const { isRtl } = useLanguage();
  const { navigate, isAdmin } = useRouter();
  const { config } = useSiteConfig();
  const sections = config.visibleSections || DEFAULT_VISIBLE_SECTIONS;
  
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isStatusTrackerOpen, setIsStatusTrackerOpen] = useState(false);
  const [statusTrackerRef, setStatusTrackerRef] = useState<string | undefined>(undefined);
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

  const handleOpenStatusTracker = (bookingRef?: string) => {
    setStatusTrackerRef(bookingRef);
    setIsStatusTrackerOpen(true);
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
      {/* Top Under Construction Banner (Highest Priority Banner) */}
      <UnderConstructionBanner />

      {/* Top Promotional Announcement Bar */}
      {sections.announcement && (
        <AnnouncementBar onClaimOffer={(courseId) => handleOpenBooking(courseId)} />
      )}

      {/* Top Header */}
      <Header 
        onOpenBooking={() => handleOpenBooking()} 
        onOpenAdmin={() => navigate('/admin')}
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
          <ContactSection
            onOpenBooking={() => handleOpenBooking()}
            onOpenStatusTracker={() => handleOpenStatusTracker()}
          />
        )}
      </main>

      {/* Footer with Modals Triggers */}
      {sections.footer && (
        <Footer 
          onOpenPolicies={() => setIsPoliciesOpen(true)} 
          onOpenTools={sections.diverToolsModal ? () => setIsToolsOpen(true) : undefined}
          onOpenSites={sections.diveSitesModal ? () => setIsSitesOpen(true) : undefined}
          onOpenFaq={sections.faqModal ? () => setIsFaqOpen(true) : undefined}
          onOpenStatusTracker={() => handleOpenStatusTracker()}
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

      {/* Booking and Q&A Eligibility Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        preSelectedCourseId={selectedCourseId}
        preSelectedTripSite={selectedTripSite}
        onOpenStatusTracker={handleOpenStatusTracker}
      />

      {/* Customer Status Tracker & Post-Approval Payment Gate Modal */}
      <BookingStatusModal
        isOpen={isStatusTrackerOpen}
        onClose={() => setIsStatusTrackerOpen(false)}
        initialBookingId={statusTrackerRef}
      />

      {/* Official Policies, Refund & Safety Modal */}
      <PoliciesModal
        isOpen={isPoliciesOpen}
        onClose={() => setIsPoliciesOpen(false)}
      />

      {/* Shopping Cart Drawer & Floating Button */}
      <CartDrawer onOpenStatusTracker={handleOpenStatusTracker} />
      <FloatingCartButton />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <LanguageProvider>
          <SiteConfigProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </SiteConfigProvider>
        </LanguageProvider>
      </RouterProvider>
    </AuthProvider>
  );
}
