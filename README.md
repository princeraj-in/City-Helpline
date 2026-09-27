# 🌟 City Helpline

<p align="center">
  <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80" alt="City Helpline Hero Banner" width="100%" style="border-radius: 16px; max-height: 400px; object-fit: cover;" />
</p>

<p align="center">
  <strong>A hyper-local student ecosystem platform connecting students and coaching aspirants with verified PGs, Hostels, Mess facilities, Study Libraries, Second-Hand Marketplace, Roommate Discovery, and Monthly Budget Intelligence across India.</strong>
</p>

<p align="center">
  <a href="https://github.com/princeraj-in/City-Helpline/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License: MIT"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/TailwindCSS-v4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Firebase-v12.19.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Google%20GenAI-Gemini%203.8%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google GenAI"></a>
  <a href="#-key-features"><img src="https://img.shields.io/badge/PWA-Installable-blueviolet?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA Ready"></a>
</p>

---

## 📌 Overview

**City Helpline** is a comprehensive full-stack web application engineered to eliminate the stress, high brokerages, and misinformation students face when relocating to premier educational and coaching hubs across India (including Kota, Patna, Delhi NCR, Sikar, Prayagraj, Lucknow, Indore, Pune, and Nawada).

Finding affordable accommodation, hygienic food, and reliable study infrastructure often involves middleman fees and unverified listings. City Helpline solves this with:
- **Zero-Brokerage Verified Listings**: Verified PGs, hostels, mess/tiffin services, and 24x7 study libraries with direct owner contact.
- **AI Mitra (Intelligent Student Advisor)**: A localized AI assistant powered by Google Gemini with 4-tier cascading fallback for hostel guidance, student living benchmarks, and mental health support.
- **Direct In-App Messaging**: Real-time 1-on-1 chat between students, property owners, and marketplace sellers.
- **Trust & Verification Badges**: "Verified Student" and "Verified PG" credential checking to eliminate scams and unreasonable electricity tariffs.
- **Student Budget Estimator**: Intelligent expense calculator tailored to living costs in Indian coaching hubs.
- **Peer-to-Peer Marketplace**: Buy and sell pre-owned academic essentials (books, notes, tables, coolers, bicycles).
- **Roommate Matching**: Connect with compatible study partners based on competitive exam goals and lifestyle.
- **Progressive Web App (PWA)**: Installable on Android, iOS Safari, and Desktop with offline asset caching.
- **Bilingual Interface**: Full Hindi and English localization for seamless student accessibility.

---

## ✨ Key Features

### 🔍 1. Hyper-Local Discovery & Smart Filtering
- **Multi-Category Exploration**: Instant search and filtering across *PGs, Hostels, Mess & Tiffin Services, Libraries, Coaching Institutes, and Study Rooms*.
- **Geolocation & Target Cities**: Automatic browser geolocation detection with reverse-geocoding, plus pre-mapped city hierarchies across major Indian student hubs.
- **Instant Search**: Real-time client-side search across listings by title, address, description, and amenities.
- **Zero-Brokerage Guarantee**: Direct contact with owners via phone call, WhatsApp, or integrated in-app messaging.

### 🤖 2. City Helpline AI Mitra (`/ai-chat`)
- **Dedicated Student AI Guide**: Official AI mentor ("सिटी हेल्पलाइन एआई मित्र") communicating in natural Hinglish, Hindi, or English.
- **Cascading Multi-Model Fallback**:
  1. `gemini-3.8-flash` (Primary high-intelligence model)
  2. `gemini-3.6-flash` (First fallback)
  3. `gemini-3.5-flash-lite` (Lightweight secondary fallback)
  4. `gemini-flash-latest` (Final safety alias)
- **Local Hub Intelligence**: Deep local knowledge of coaching districts (Patna's Boring Road & Musallahpur Hat, Kota's Landmark City & Rajiv Gandhi Nagar, Delhi's Mukherjee Nagar & Kalu Sarai, Nawada, Sikar, Prayagraj, etc.).
- **Anti-Fraud & Scam Advisory**: Alerts students against advance token scams and enforces electricity tariff awareness (standard sub-meter rate ₹7–₹10/unit).
- **24/7 Mental Health Support Integration**: Empathy-first counseling with direct referral to the Government of India Tele-MANAS helpline (**14416** / **1800-891-4416**).
- **Dual Interfaces**: Access via the floating quick-action assistant (`AiFloatingAssistant`) or the full dedicated chat interface (`AiChatPage`).

### 💬 3. Direct In-App Messaging (`/messages`)
- **Real-Time 1-on-1 Chat**: Secure conversation threads between students and property owners or marketplace sellers.
- **Listing Context Embedded**: Conversations retain active listing metadata (room title, price, category, photo) for clear negotiations.
- **Unread Counters & Glowing Badges**: Real-time unread badge counts in desktop navbar and mobile bottom navigation (`NavbarChatButton`).
- **Participant Privacy**: Communication occurs within the platform without requiring personal phone number disclosure.

### 🛡️ 4. Student & PG Trust Verification System
- **Verified Student Badge (`VerifiedStudentBadge`)**:
  - Live camera photo capture or student ID upload.
  - Institution/coaching verification (roll number, target exam).
  - Prominent verified badge displayed across marketplace cards and user profiles.
  - **Protected Private Storage**: Document proofs and sensitive roll numbers are secured in private Firestore subcollections (`/users/{uid}/private/verification`).
- **Verified PG Badge (`PGVerificationModal`)**:
  - Property electricity consumer / K-number verification.
  - Declared sub-meter electricity tariff guarantee (₹7–₹10/unit).
  - Mandatory daylight room photo certification and student ambassador physical inspection agreement.

### 🛍️ 5. Student Second-Hand Marketplace (`/marketplace`)
- **Peer-to-Peer Exchange**: Buy and sell pre-owned study essentials directly without commissions or platform charges.
- **Tailored Academic Categories**:
  - 📚 *Books & Handwritten Notes* (JEE, NEET, UPSC, SSC, Banking, GATE)
  - 🪑 *Study Furniture* (Tables, ergonomic chairs, bookshelves)
  - ❄️ *Coolers & Fans* (Desert coolers, high-speed fans)
  - 🚲 *Cycles & Bikes* (Standard/geared cycles for coaching commute)
  - 🔌 *Electronics & Appliances* (Study lamps, calculators, kettles)
- **Direct Multi-Channel Contact**: Instant in-app chat, 1-tap WhatsApp chat, and phone dialer.
- **Simple Selling Flow (`/sell-item`)**: Cloudinary image upload, condition tags (*Brand New, Like New, Good, Fair*), price negotiation flag, and location tagging.

### 🤝 6. Roommate Matching (`/roommates`)
- **Find Study Roommates**: Connect with like-minded students targeting the same competitive exams.
- **Compatibility Filters**: Filter by target examination (JEE, NEET, UPSC, State PCS, SSC, CA), budget range, dietary preference (Veg / Non-Veg), study schedule, and lifestyle habits.

### 💰 7. Student Monthly Budget Estimator (`/budget`)
- **Flexible Calculation Modes**:
  - **Manual Entry**: Input rent, food/mess, library pass, commute, laundry, and pocket money.
  - **Custom Expenses**: Add dynamic custom items (gym, recharge, medicine, milk/fruits) with instant color-coded chart inclusion.
  - **Guided Options & Target Budget**: Auto-balance monthly expenses to match target budget limits based on city benchmarks.
- **City Living Benchmarks**: Calibrated monthly expenditure indexes for Kota, Patna, Delhi, Sikar, Prayagraj, Lucknow, Pune, Indore, and Jaipur.
- **Visual Analytics**: Interactive SVG donut chart showing expense category percentages and affordability ratings.
- **Multi-Channel Sharing**: Formatted WhatsApp budget statements for parents/roommates, clipboard copy, and printable/downloadable statements.

### 📱 8. Progressive Web App (PWA) & Offline Capabilities
- **Installable Experience**: Supports direct installation as a standalone app on Android, iOS Safari (via "Add to Home Screen"), and Chromium Desktop.
- **Early Install Trap**: Captures `beforeinstallprompt` early in `index.html` to guarantee instant responsiveness in custom UI banners.
- **Guided Install Sheet (`InstallAppPrompt`)**: Bilingual interactive modal with step-by-step visual instructions tailored for iOS Safari and Android Chrome.
- **Service Worker (`public/sw.js`)**: Implements network-first caching with offline fallback for core assets, icons, and shell HTML.

### 🌐 9. Bilingual Localization (Hindi / English)
- **LanguageProvider (`LanguageContext`)**: Global context supporting English and Hindi.
- **Compact Language Selector**: Header and mobile controls for instant language switching across help, verification, and navigation.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                          City Helpline Client                           │
│              React 19 • TypeScript • Vite • Tailwind CSS v4             │
│                     PWA Service Worker & Offline Cache                  │
└──────────────┬──────────────────┬─────────────────┬─────────────────────┘
               │                  │                 │
               ▼                  ▼                 ▼
     ┌──────────────────┐ ┌──────────────┐ ┌──────────────────────────────┐
     │  Firebase Auth   │ │  Cloudinary  │ │       AI Mitra Engine        │
     │  OAuth / Email   │ │   Image CDN  │ │   @google/genai (Gemini)     │
     └─────────┬────────┘ └───────┬──────┘ └──────────────┬───────────────┘
               │                  │                       │
               │                  │                       ▼
               │                  │        ┌──────────────────────────────┐
               │                  │        │  Vercel Serverless / Express │
               │                  │        │  /api/chat • 4-tier fallback │
               │                  │        │  IP Rate Limiter & Sanitize  │
               │                  │        └──────────────┬───────────────┘
               ▼                  ▼                       │
┌─────────────────────────────────────────────────────────▼───────────────┐
│                        Cloud Firestore Database                         │
│  • /users/{userId}                       → User profiles, RBAC, auth    │
│  • /users/{userId}/private/verification  → Protected ID card proofs     │
│  • /listings/{listingId}                 → PGs, Hostels, Mess, Library  │
│  • /reviews/{reviewId}                   → Atomic ratings & reviews     │
│  • /marketplace_items/{itemId}           → Student buy & sell posts     │
│  • /conversations/{convId}               → 1-on-1 direct chat threads   │
│  • /conversations/{convId}/messages      → Real-time messages           │
│  • /roles_admins/{adminUid}              → Authoritative admin records  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 💻 Tech Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | React | `^19.0.0` | Reactive component architecture & hooks |
| **Language** | TypeScript | `~5.8.2` | Strict end-to-end type safety |
| **Build Tooling** | Vite | `^6.2.0` | Fast build pipeline and Hot Module Replacement (HMR) |
| **Styling & UI** | Tailwind CSS | `@tailwindcss/vite` | Modern utility-first styling & glassmorphism |
| **Animations** | Motion (Framer) | `^12.23.24` | 60fps spring transitions & layout animations |
| **Mobile / PWA** | Web App Manifest & SW | Service Worker v1 | Offline caching & installable home screen app |
| **Database** | Cloud Firestore | `12.19.0` | Real-time NoSQL data store with security rules |
| **Authentication** | Firebase Auth | `12.19.0` | Google OAuth, GitHub OAuth, Email/Password |
| **AI Integration** | Google Gen AI SDK | `@google/genai` | Multi-tier cascading Gemini model orchestration |
| **Backend / API** | Express / Vercel Functions | Node.js / Serverless | `/api/chat` and `/api/health` endpoints |
| **Media Hosting** | Cloudinary REST API | Unsigned Preset | Client-side photo uploads & optimized CDN delivery |
| **Icons & Feedback**| Lucide React, Sonner | Latest | Modern vector iconography & toast alerts |

---

## 📂 Project Directory Structure

```text
City-Helpline/
├── api/
│   ├── chat.ts                  # Vercel serverless AI chat handler (Gemini fallback)
│   └── health.ts                # Serverless health check endpoint
├── index.html                   # HTML entry point with OpenGraph meta tags & PWA prompt trap
├── package.json                 # Dependencies and build scripts
├── public/
│   ├── manifest.json            # PWA manifest metadata
│   ├── sw.js                    # Service worker for asset caching & offline support
│   └── ...                      # Static app logos & icons
├── server.ts                    # Express development server with rate-limiting & chat API
├── tsconfig.json                # TypeScript compiler configuration
├── vercel.json                  # Vercel deployment routing configuration
├── vite.config.ts               # Vite bundler configuration
├── firestore.rules              # Cloud Firestore security rules
├── firebase-blueprint.json      # Firestore collection schema blueprints
├── metadata.json                # Application metadata
├── CONTRIBUTING.md              # Open-source contribution guidelines & setup
├── CODE_OF_CONDUCT.md           # Community standards & behavior rules
├── src/
│   ├── main.tsx                 # Application root entry point & SW registration
│   ├── App.tsx                  # Main router, route guards, and global layout
│   ├── index.css                # Global styling, liquid glassmorphism, animations
│   ├── types/
│   │   └── index.ts             # Domain interfaces (User, Listing, Review, Chat, Marketplace)
│   ├── contexts/
│   │   ├── AuthContext.tsx      # Auth state, session, and role-based permissions
│   │   ├── LocationContext.tsx  # Geolocation and selected city state
│   │   └── LanguageContext.tsx  # Bilingual localization provider (EN / HI)
│   ├── hooks/
│   │   └── useUnreadChatCount.ts# Real-time unread messages listener hook
│   ├── lib/
│   │   ├── appConfig.ts         # Global app constants and configuration
│   │   ├── authError.ts         # User-friendly Firebase auth error mapping
│   │   ├── budgetBenchmarks.ts  # City expenditure indices & budget algorithms
│   │   ├── chatService.ts       # Firestore 1-on-1 chat operations & message dispatch
│   │   ├── constants.ts         # Categories & State-City relational database
│   │   ├── emergencyData.ts     # National student helplines & emergency contacts
│   │   ├── firebase.ts          # Firebase SDK initialization & auth providers
│   │   ├── firestoreError.ts    # Firestore error parsing utility
│   │   ├── locationService.ts   # Geolocation & reverse-geocoding service
│   │   ├── marketplaceData.ts   # Marketplace starter catalog & category metadata
│   │   ├── roommateService.ts   # Roommate profile matching & Firestore queries
│   │   ├── storage.ts           # Cloudinary unsigned upload client handler
│   │   ├── translations/        # Multi-language dictionary files
│   │   └── utils.ts             # General utility functions (cn class merger)
│   ├── components/
│   │   ├── AccountSettings.tsx  # Profile, contact, and security settings
│   │   ├── ListingCard.tsx      # Service listing preview card
│   │   ├── admin/
│   │   │   ├── AdminConsole.tsx       # Multi-tab admin moderation command center
│   │   │   ├── AdminListingsTab.tsx   # Listing approval/rejection moderation
│   │   │   ├── AdminUsersTab.tsx      # User governance and verification review
│   │   │   └── ListingInspectModal.tsx# Deep listing inspection dialog
│   │   ├── ai/
│   │   │   └── AiFloatingAssistant.tsx# Kinetic floating AI Mitra button & modal
│   │   ├── common/
│   │   │   ├── InstallAppPrompt.tsx   # Guided PWA installation banner & sheet
│   │   │   ├── LanguageSelector.tsx   # Hindi/English language toggle
│   │   │   ├── TrustBadge.tsx         # Verified Student & Verified PG trust badges
│   │   │   └── UserAvatar.tsx         # Standardized avatar with fallback
│   │   ├── layout/
│   │   │   ├── Navbar.tsx             # Desktop glassmorphic navigation bar
│   │   │   ├── NavbarChatButton.tsx   # Chat action button with unread counter
│   │   │   ├── BottomNav.tsx          # Mobile navigation bar with active indicators
│   │   │   └── ProtectedRoute.tsx     # Role-aware route guard
│   │   ├── marketplace/
│   │   │   ├── MarketplaceCard.tsx        # Item card with quick-contact actions
│   │   │   └── MarketplaceDetailModal.tsx # Full item details & in-app chat trigger
│   │   ├── profile/
│   │   │   ├── StudentVerificationModal.tsx # Student ID & camera verification modal
│   │   │   └── PGVerificationModal.tsx      # PG electricity bill verification modal
│   │   ├── roommate/
│   │   │   ├── RoommateCard.tsx       # Student roommate compatibility card
│   │   │   └── RoommateModal.tsx      # Roommate details & connect modal
│   │   ├── budget/
│   │   │   ├── BudgetChart.tsx        # SVG donut visualizer component
│   │   │   ├── RecommendedServices.tsx# Budget-matched service recommendations
│   │   │   └── BudgetShareModal.tsx   # WhatsApp share & statement export
│   │   └── ui/
│   │       ├── GlassCard.tsx          # Backdrop-blur container
│   │       ├── LiquidGlassCard.tsx    # Specular ambient border card
│   │       ├── LiquidButton.tsx       # Primary gradient button
│   │       └── SearchableSelect.tsx   # Grouped searchable dropdown
│   └── pages/
│       ├── Home.tsx             # Landing experience, hero search, category links
│       ├── Search.tsx           # Multi-facet search directory with filters
│       ├── ListingDetails.tsx   # Detailed specs, photo gallery, reviews, contact
│       ├── AiChatPage.tsx       # Fullscreen AI Mitra chat experience
│       ├── MessagesPage.tsx     # In-app real-time messaging interface
│       ├── RoommatesPage.tsx    # Roommate finder & study partner matching
│       ├── BudgetCalculator.tsx # Student budget planner & expense visualizer
│       ├── Marketplace.tsx      # Second-hand marketplace directory
│       ├── SellItem.tsx         # Post marketplace item with photo upload
│       ├── AddListing.tsx       # Service provider listing submission form
│       ├── EditListing.tsx      # Listing update & photo gallery manager
│       ├── AdminDashboard.tsx   # Administrative overview desk
│       ├── Help.tsx             # Help center, FAQs, safety guidelines
│       ├── Legal.tsx            # Terms of service, privacy policy, disclaimers
│       ├── Profile.tsx          # User profile, verified badges, saved listings
│       └── Auth.tsx             # Unified login/signup with dual-slider UI
```

---

## 🔒 Security Architecture

Cloud Firestore and API routes are protected by defense-in-depth security:
- **Authentication Required**: Write operations require a validated Firebase Auth session (`request.auth != null`).
- **Owner Access Control**: Users can only update or delete listings, marketplace posts, and profile documents that they own.
- **Admin Governance**: Sensitive moderation operations (approving listings, verifying badges, assigning roles) require verified admin credentials (`hasAdminClaim()`, `isDatabaseAdmin()`, or super admin configuration).
- **Private Subcollections**: Sensitive student ID proofs and roll numbers are stored exclusively in `/users/{userId}/private/verification`, strictly shielded from public profile reads.
- **Strict Schema Boundaries**: String lengths, required fields, and valid enum values are strictly enforced by schema validators (`isValidListing`, `isValidUser`, `isValidMarketplaceItem`).
- **Conversation Confidentiality**: Access to `/conversations/{convId}` and nested messages is restricted strictly to conversation participants and administrators.
- **API Rate Limiting & Sanitization**: Serverless and Express chat endpoints enforce in-memory IP sliding-window rate limiting (25 req/min) and prompt sanitization against injection attacks.

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** or **bun**

### 1. Clone the Repository
```bash
git clone https://github.com/princeraj-in/City-Helpline.git
cd City-Helpline
npm install
```

### 2. Environment Configuration
Create a `.env` file in the project root:
```bash
cp .env.example .env
```

Configure your environment variables:
```env
# Cloudinary Media Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=cityhelpline_upload

# Firebase Web Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Google Gemini AI Configuration (for AI Mitra)
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run Locally
Start the development server (runs Express backend + Vite with HMR):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note**: `server.ts` handles `/api/chat` and `/api/health` locally. Make sure `GEMINI_API_KEY` is provided in `.env` to test City Helpline AI Mitra.

### 4. Build for Production
To compile and bundle for production deployment:
```bash
npm run build
```

To run type checking and lint validation:
```bash
npm run lint
```

---

## 🌟 Contributing & Community

We welcome contributions from the community!

- Please review our **[CONTRIBUTING.md](CONTRIBUTING.md)** for detailed local setup instructions, branching conventions, and the pull request workflow.
- All contributors and participants are expected to adhere to our **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)**.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Crafted with precision for students across India • <strong>City Helpline</strong>
</p>
