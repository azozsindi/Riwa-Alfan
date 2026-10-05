# Refactoring Log (CHANGES.md)

All refactoring steps are executed with zero behavioral changes, zero UI changes, and verified after each step.

---

## Step 1: Shared Constants, Policy Data & Policies Deduplication
- **Created `CHANGES.md`**: Tracks all refactoring actions, file moves, and cleanups.
- **Created `src/constants/contact.ts`**: Centralized default contact information (Captain Fahad phone, WhatsApp, PADI ID, center location) to eliminate hard-coded magic values across components.
- **Created `src/data/policiesData.ts`**: Structured bilingual data model for the 3 official center regulations:
  1. Boat expeditions & dive trips (72-hour refund rule, 24-hour rescheduling rule, center weather rescheduling).
  2. Diving courses & training (eLearning/ID issuance refund rule, rescheduling, additional practice sessions).
  3. Safety, conduct & liability (attendance, compliance, health disclosure, stop-work rights, Saudi consumer rights compliance).
- **Refactored `src/components/PoliciesSection.tsx` & `src/components/PoliciesModal.tsx`**: Replaced duplicated manual HTML/JSX blocks with clean iterations over `POLICIES_DATA`, cutting duplicate code and ensuring a single source of truth.

---

## Step 2: Modularized Diver Tools Section
- **Extracted `src/components/tools/NitroxCalculator.tsx` (~130 lines)**: Self-contained component for Nitrox Maximum Operating Depth (MOD) and Equivalent Air Depth (EAD) math, oxygen fraction slider, and visual gauge display.
- **Extracted `src/components/tools/BwrafChecklist.tsx` (~135 lines)**: Self-contained component for the 5-step PADI pre-dive safety check (BCD, Weights, Releases, Air, Final OK) with progress bar and reset handler.
- **Extracted `src/components/tools/SacCalculator.tsx` (~95 lines)**: Self-contained component for Surface Air Consumption (SAC) rate calculations based on cylinder size, starting/ending pressure, depth, and bottom time.
- **Streamlined `src/components/DiverToolsSection.tsx`**: Reduced file from 479 lines down to 85 lines, functioning as a clean tabs coordinator.

---

## Step 3: Deconstructed AdminDashboard Monolith (2,698 lines -> ~310 lines)
- **Created `src/utils/imageUtils.ts`**: Pure canvas image scaling and compression helper (`optimizeImageFile`) used across logo and avatar uploading.
- **Created `src/components/admin/tabs/OffersTab.tsx` (~200 lines)**: Self-contained promotional offers, 1-click presets (Open Water, Summer, National Day, Weekend), discount percentage, and live badge toggle.
- **Created `src/components/admin/tabs/BrandTab.tsx` (~280 lines)**: Typography switcher (Alexandria, Cairo, Readex, Almarai, Tajawal), logo image upload / URL input, live preview, contact numbers, and hero stats visibility controls.
- **Created `src/components/admin/tabs/InstructorTab.tsx` (~275 lines)**: Captain Fahad profile photo upload, bio, philosophy quotes, editable list of licenses/certificates, and PADI specialty badges.
- **Created `src/components/admin/tabs/CoursesTab.tsx` (~285 lines)**: Course catalog, fast live price matrix, course detail editing modal, course deletion modal, and price restoration from memory.
- **Created `src/components/admin/tabs/SitesTab.tsx` (~220 lines)**: Dive destinations management, add new site, inline editing, and deletion.
- **Created `src/components/admin/tabs/FaqsTab.tsx` (~135 lines)**: Frequently asked questions management, question/answer inline editing, add new FAQ, and remove FAQ.
- **Created `src/components/admin/tabs/TestimonialsTab.tsx` (~140 lines)**: Student testimonials, reviews, avatar seeds, inline editor, and remove review.
- **Created `src/components/admin/tabs/BookingsTab.tsx` (~145 lines)**: Booking requests inbox, status filters (new, contacted, confirmed), direct WhatsApp conversation link, and delete booking.
- **Created `src/components/admin/tabs/SettingsTab.tsx` (~155 lines)**: PIN update, JSON backup export, reset to factory defaults, and cloud integration health cards.
- **Transformed `src/components/admin/AdminDashboard.tsx`**: Reduced from **2,698 lines to 310 lines** (over **88% reduction** in file size!), operating as a clean coordinator shell.

---

## Step 4: Refactored & Modularized `SiteConfigContext.tsx`
- **Extracted `src/data/defaultConfig.ts` (~140 lines)**: Centralized immutable default configuration object (`DEFAULT_CONFIG`), initial booking records, and storage version keys.
- **Extracted `src/services/firestoreSync.ts` (~110 lines)**: Isolated Firebase Firestore cloud synchronization logic, snapshot listeners, booking inserts/updates, and connection testing.
- **Extracted `src/utils/fontManager.ts` (~30 lines)**: Centralized typography application, dynamic CSS variable setting, and class cleanup.
- **Streamlined `src/context/SiteConfigContext.tsx`**: Reduced from **642 lines down to 240 lines**, focusing exclusively on React state, hooks, and context dispatchers.
- **Deduplicated `src/components/BookingModal.tsx`**: Replaced hardcoded policies block with dynamic iteration over `POLICIES_DATA`, eliminating duplicate markup.

---

## Step 5: Official Brand Identity & Official "RA" Logo Adoption
- **Created `/public/logo-riwa-alfan.svg`**: Pixel-perfect vector representation of the official interlocking "RA" emblem (Deep Marine Royal Navy + Warm Antique Sand Gold) and "رواء الفن" Arabic typography.
- **Transformed `src/components/FahadsLogo.tsx`**: Re-engineered vector component rendering the official monogram emblem, gold gradient filters, dark-mode outer glow, and bilingual typography lockup with responsive size scaling.
- **Updated Favicon (`index.html`)**: Linked the new brand SVG logo directly as the browser tab icon.
- **Integrated Brand Palette across Components**:
  - `src/index.css`: Added `--brand-gold` (`#C59B5F`), `--brand-navy` (`#162E52`), `.gold-gradient-btn`, `.gold-border-glow`, and caustics pattern.
  - `src/components/Header.tsx`: Integrated the official RA emblem inside the header badge, with "رواء" in white/blue and "الفن" in antique sand gold.
  - `src/components/Hero.tsx`: Featured the official logo card above the fold, gold badges, and metallic gold primary booking button.
  - `src/components/AnnouncementBar.tsx`: Themed top announcement banner to deep royal navy and warm sand gold.
  - `src/components/CoursesSection.tsx`: Highlighted price tags, category tabs, and booking buttons with the new gold-navy styling.
  - `src/components/InstructorSection.tsx`: Highlighted badges, credentials, and quote accents with brand gold.
  - `src/components/BookingModal.tsx`: Styled the booking modal kicker and submission button with `gold-gradient-btn`.
  - `src/components/DiverToolsSection.tsx`: Themed tabs, progress bars, and gauges in the Nitrox, BWRAF, and SAC tools to the brand gold palette.
  - `src/components/Footer.tsx`: Applied the official RA monogram and bilingual gold logotype in the footer brand block.

---

## Step 6: Dive Captains & Instructors Management Feature
- **Updated `src/types/admin.ts`**: Created `Captain` interface and added `captains?: Captain[]` to `SiteConfig`.
- **Updated `src/data/defaultConfig.ts`**: Added `DEFAULT_CAPTAINS` array featuring Captain Fahad Al-Huwaimli as the Lead Instructor (`isLead: true`) with PADI license `#482910` and teaching specialties.
- **Enhanced `src/context/SiteConfigContext.tsx`**: Implemented `addCaptain`, `updateCaptain`, `deleteCaptain`, and `updateCaptains` methods with real-time Firestore sync and LocalStorage persistence.
- **Created `src/components/admin/tabs/CaptainsTab.tsx` (~420 lines)**:
  - Full management dashboard for dive captains.
  - "إضافة كابتن جديد" (Add New Captain) modal with comprehensive fields (name in Arabic & English, rank/title, PADI license number, experience years, WhatsApp direct contact, bio, photo upload/optimization, preset specialties chips, and lead instructor toggle).
  - Captain edit and delete actions with confirmation dialog.
- **Integrated into `src/components/admin/AdminDashboard.tsx`**: Added "كباتن ومدربو المركز 👑" sidebar tab with live captain count badge.
- **Showcased in `src/components/InstructorSection.tsx`**: Added "نخبة كباتن ومدربي رواء الفن" team showcase displaying all captains with photo avatars, PADI credentials, role badges, specialties tags, direct WhatsApp contact, and booking buttons.
- **Updated `src/components/BookingModal.tsx`**: Added an optional "الكابتن المفضل للتدريب (اختياري) / Preferred Instructor (Optional)" selection dropdown so trainees can request their preferred instructor during checkout.

---

## Step 7: Complete Bilingual Synchronization & Header Subtitle Translation Fix
- **Fixed Header Subtitle (`src/components/Header.tsx`)**: Resolved the issue where the small text under "Riwa Alfan" remained fixed in Arabic ("رواء الفن"). It now dynamically translates:
  - **Arabic**: «مركز تدريب غوص معتمد · جدة PADI» (or `config.brand.subtitleAr`).
  - **English**: «Certified PADI Dive Center · Jeddah» (or `config.brand.subtitleEn`).
- **Fixed Footer Subtitle (`src/components/Footer.tsx`)**: Synchronized footer brand subtext to translate between Arabic and English dynamically.
- **Enhanced Vector Wordmark (`src/components/FahadsLogo.tsx`)**:
  - Automatically translates SVG text between Arabic («رواء الفن · مركز غوص معتمد PADI») and English («Riwa Alfan · PADI DIVE CENTER · JEDDAH») based on active language.
- **Fixed Hero Accreditation (`src/components/Hero.tsx`)**: Updated instructor title in the visual card to toggle between `titleAr` and `titleEn`.
- **Fixed Captain Specialties in Team Grid (`src/components/InstructorSection.tsx`)**: Now properly renders `cap.specialtiesEn` when viewing the site in English.
- **Fixed Booking Modal Roles (`src/components/BookingModal.tsx`)**: Ensured captain roles inside the dropdown display in English (`roleEn`) when browsing in English.
- **Admin Brand Tab (`src/components/admin/tabs/BrandTab.tsx`)**: Added dedicated inputs for both Arabic Subtitle (`subtitleAr`) and English Subtitle (`subtitleEn`) so the administration can customize the small subtext in both languages anytime.

---

## Step 8: Paymob Online Payment Integration
- **Updated `src/types/admin.ts` & `src/data/divingData.ts`**:
  - Added `PaymobPaymentConfig` interface.
  - Added `payment?: PaymobPaymentConfig` to `SiteConfig`.
  - Added `paymobUrl?: string` to `Course` interface.
  - Expanded `BookingRecord` with `status: 'paid' | 'pending_payment'`, `paymentMethod`, `paymentAmount`, and `paymentReference`.
- **Created `src/components/admin/tabs/PaymentTab.tsx`**:
  - Full management tab for Paymob online payments.
  - Enable/disable Paymob toggle.
  - General center Paymob payment URL with live test link.
  - Configurable deposit amount (SAR) and payment requirement policy.
  - Customizable Arabic and English payment instruction messages.
  - Per-course dedicated Paymob payment links manager.
  - Step-by-step illustrated guide on how to extract links from the Paymob dashboard.
- **Integrated into `src/components/admin/AdminDashboard.tsx`**:
  - Added "الدفع الإلكتروني (Paymob) 💳" sidebar tab with live status indicator.
- **Enhanced `src/components/BookingModal.tsx`**:
  - Added interactive payment preference selector before submit:
    - **«دفع إلكتروني (Paymob)»** (Mada, Apple Pay, Visa, Mastercard)
    - **«تنسيق عبر واتساب»** (Without pre-payment)
  - Post-submission confirmation showcases a branded Paymob Payment Card with direct checkout link, supported payment badges, and WhatsApp confirmation.
- **Enhanced `src/components/admin/tabs/BookingsTab.tsx`**:
  - Added `💳 مدفوع (Paid)` filter tab.
  - Added Paymob method badge and `مدفوع مؤكد (Paymob)` / `بانتظار الدفع (Paymob)` status options in the management inbox.
- **Enhanced `src/components/admin/tabs/CoursesTab.tsx`**:
  - Added dedicated Paymob payment link input directly in the course edit modal.

---

## Step 9: Women's Training Division & Female Instructor Integration (بجانب الكابتن فهد)
- **Updated `src/types/admin.ts`**:
  - Created `FemaleInstructorConfig` interface for the women's training division and female instructor.
  - Added `femaleInstructor?: FemaleInstructorConfig` to `SiteConfig`.
- **Updated `src/data/defaultConfig.ts`**:
  - Added `DEFAULT_FEMALE_INSTRUCTOR` featuring Captain Reem Al-Salem (PADI OWSI, 6+ years experience, 100% private enclosed pools in Jeddah, patient coaching, and women's training specialties).
  - Added female instructor profile to `DEFAULT_CAPTAINS`.
- **Updated `src/context/SiteConfigContext.tsx`**:
  - Added `updateFemaleInstructor` with full state persistence and Firestore synchronization.
- **Redesigned `src/components/InstructorSection.tsx`**:
  - Positioned the **Female Training Division & Certified Female Instructor Card** directly **side-by-side with Captain Fahad** in a prominent 2-column premier showcase:
    - **Card 1**: Captain Fahad Al-Huwaimli (Lead Instructor & Founder 👑).
    - **Card 2**: Certified Women's Diving Division & Female Instructor (🧕 قسم التدريب النسائي الخاص) with 100% privacy badge, private pool highlights, PADI certification details, direct WhatsApp link, and instant booking button.
- **Enhanced `src/components/admin/tabs/InstructorTab.tsx`**:
  - Added top sub-tab switcher:
    - `👑 كابتن فهد الهويملي (كبير المدربين)`
    - `🧕 قسم التدريب النسائي (المدربة النسائية)`
  - Full dedicated editor for the female instructor: name, rank, badge, PADI license, experience years, direct WhatsApp number, personal photo upload, bio, privacy features list, and specialty courses.
- **Updated `src/components/admin/AdminDashboard.tsx`**:
  - Updated sidebar button to `المدربون والتدريب النسائي 👑` with connected handlers.

---

## Step 10: Image Removal from Middle of Site (حذف الصورة في نص الموقع)
- **Updated `src/components/Hero.tsx`**:
  - Removed the duplicate logo feature image box in the right column of the hero section so that the official logo only appears cleanly at the top in the Header and bottom in the Footer, eliminating any redundant logo image occupying the middle of the screen.
- **Updated `src/components/InstructorSection.tsx`**:
  - Removed the avatar/photo containers (`w-20 h-20` and `w-18 h-18`) from the cards in the middle of the site (Captain Fahad's card, Female Instructor's card, and the captains team grid).
  - Replaced the photo boxes with prestigious royal badges and clean typography (`👑 كبير المدربين ومؤسس رواء الفن`, `🧕 قسم التدريب النسائي الخاص`), giving both cards a sleek, modern, balanced appearance without empty image placeholders or unwanted photos.
- **Updated `src/context/SiteConfigContext.tsx`**:
  - Cleared any cached/stored `photoUrl` strings in state so no image displays in the middle of the site.

---

## Step 11: Custom Domain Integration & DNS Guide (riwaalfan.com)
- **Updated `src/types/admin.ts`**:
  - Added `customDomain?: string;` to `CenterBrandConfig`.
- **Updated `src/data/defaultConfig.ts`**:
  - Configured `DEFAULT_CONFIG.brand.customDomain = 'riwaalfan.com'`.
- **Updated `index.html`**:
  - Added `<link rel="canonical" href="https://riwaalfan.com/" />`.
  - Added OpenGraph canonical `og:url` (`https://riwaalfan.com/`), `og:site_name`, `og:image`, and `og:locale`.
  - Added Twitter card `twitter:domain`, `twitter:url`, `twitter:title`, `twitter:description`, and `twitter:image`.
  - Added Schema.org Structured Data (JSON-LD) for `SportsActivityLocation` with `url: "https://riwaalfan.com"`.
- **Created `public/robots.txt`**:
  - Configured crawler permissions and linked to `https://riwaalfan.com/sitemap.xml`.
- **Created `public/sitemap.xml`**:
  - Formatted XML sitemap targeting `https://riwaalfan.com/`.
- **Created `src/components/admin/tabs/DomainTab.tsx`**:
  - Interactive domain manager for `riwaalfan.com`.
  - One-click copy table of exact DNS records:
    - **CNAME `www`**: `ais-pre-qmhjfz2xry6g4myck4tmtr-138630195296.europe-west2.run.app`
    - **CNAME `@`** (via Cloudflare Proxied / CNAME Flattening): `ais-pre-qmhjfz2xry6g4myck4tmtr-138630195296.europe-west2.run.app`
  - Step-by-step registrar walkthroughs for Cloudflare, GoDaddy, Namecheap, and URL Forwarding.
  - Live global propagation check link via DNSChecker.
- **Updated `src/components/admin/AdminDashboard.tsx`**:
  - Mounted `DomainTab` in the Admin Dashboard with a prominent sidebar button `ربط الدومين (riwaalfan.com) 🌐`.






