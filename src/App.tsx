/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LocationProvider, useLocationContext } from './contexts/LocationContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LocationPromptBanner } from './components/location/LocationPromptBanner';
import { LocationSelectorModal } from './components/location/LocationSelectorModal';
import { SystemBroadcastBanner } from './components/layout/SystemBroadcastBanner';
import { useEffect, useState, lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollToTop } from './components/common/ScrollToTop';

// Eagerly loaded for instant First Contentful Paint
import Home from './pages/Home';

// Lazy-loaded routes for code-splitting (dramatically lowers TBT & initial JS parse time)
const Auth = lazy(() => import('./pages/Auth'));
const AddListing = lazy(() => import('./pages/AddListing'));
const EditListing = lazy(() => import('./pages/EditListing'));
const ListingDetails = lazy(() => import('./pages/ListingDetails'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Search = lazy(() => import('./pages/Search'));
const Profile = lazy(() => import('./pages/Profile'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const SellItem = lazy(() => import('./pages/SellItem'));
const BudgetCalculator = lazy(() => import('./pages/BudgetCalculator'));
const Legal = lazy(() => import('./pages/Legal'));
const AiChatPage = lazy(() => import('./pages/AiChatPage'));
const AccountSettingsPage = lazy(() => import('./pages/AccountSettingsPage'));
const SavedListingsPage = lazy(() => import('./pages/SavedListingsPage'));
const MyMarketplacePage = lazy(() => import('./pages/MyMarketplacePage'));
const MyListingsPage = lazy(() => import('./pages/MyListingsPage'));
const RoommatesPage = lazy(() => import('./pages/RoommatesPage'));
const Help = lazy(() => import('./pages/Help'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const HubsPage = lazy(() => import('./pages/HubsPage'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Defer floating assistant so it does not block main thread
const AiFloatingAssistant = lazy(() => 
  import('./components/ai/AiFloatingAssistant').then(m => ({ default: m.AiFloatingAssistant }))
);

import { InstallAppPrompt } from './components/common/InstallAppPrompt';
import { PageTransitionSkeleton } from './components/common/SkeletonLoaders';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LocationPermissionModal } from './components/location/LocationPermissionModal';

const RouteFallback = () => <PageTransitionSkeleton />;

function AppLayout() {
  const { isLocationModalOpen, closeLocationModal } = useLocationContext();
  const { currentUser, userProfile, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [adminViewMode, setAdminViewMode] = useState<'admin' | 'student'>(() => {
    return (localStorage.getItem('admin_view_mode') as 'admin' | 'student') || 'admin';
  });

  // Keep admin mode in sync with events
  useEffect(() => {
    const handleModeChange = () => {
      const mode = (localStorage.getItem('admin_view_mode') as 'admin' | 'student') || 'admin';
      setAdminViewMode(mode);
    };
    window.addEventListener('admin_mode_change', handleModeChange);
    return () => window.removeEventListener('admin_mode_change', handleModeChange);
  }, []);

  // If user explicitly navigates to /admin, ensure admin mode is active
  useEffect(() => {
    if (location.pathname === '/admin' && adminViewMode !== 'admin') {
      setAdminViewMode('admin');
      localStorage.setItem('admin_view_mode', 'admin');
    }
  }, [location.pathname, adminViewMode]);

  // If the user is an Admin AND currently in Admin Console Mode:
  // (Either on /admin OR on root / when in admin mode)
  const isViewingAdminConsole = isAdmin && (location.pathname === '/admin' || (location.pathname === '/' && adminViewMode === 'admin'));

  if (isViewingAdminConsole) {
    return (
      <div className="min-h-screen bg-[#07090E] flex flex-col">
        <Toaster position="top-center" theme="dark" />
        <AdminDashboard
          onSwitchToStudentView={() => {
            setAdminViewMode('student');
            localStorage.setItem('admin_view_mode', 'student');
            navigate('/');
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Toaster position="top-center" theme="dark" />

      {/* If logged in as admin browsing student app, show executive switch banner */}
      {isAdmin && location.pathname !== '/admin' && (
        <div className="sticky top-0 z-[60] bg-gradient-to-r from-[#8A2BE2] via-[#00E5FF] to-[#8A2BE2] p-[1px] shadow-lg">
          <div className="bg-[#07090E]/95 backdrop-blur-xl px-4 py-2 flex items-center justify-between gap-3 text-xs font-bold text-white">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
              <span className="text-[#00E5FF] font-black tracking-wide">ADMIN CONSOLE ACTIVE</span>
              <span className="text-gray-400 font-medium hidden sm:inline">— You are previewing the student portal as an administrator</span>
            </div>
            <button
              onClick={() => {
                setAdminViewMode('admin');
                localStorage.setItem('admin_view_mode', 'admin');
                navigate('/admin');
              }}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2] text-black font-black text-xs hover:brightness-110 transition-all shadow-[0_0_12px_rgba(0,229,255,0.4)] active:scale-95 cursor-pointer"
            >
              Return to Admin Console &rarr;
            </button>
          </div>
        </div>
      )}

      <ScrollToTop />
      <Navbar />
      <SystemBroadcastBanner />
      <LocationPromptBanner />
      <LocationSelectorModal isOpen={isLocationModalOpen} onClose={closeLocationModal} />
      <LocationPermissionModal />
      <main className="flex-grow pb-24 md:pb-0 overflow-x-hidden">
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/roommates" element={<RoommatesPage />} />
            <Route path="/flatmates" element={<RoommatesPage />} />
            <Route path="/budget" element={<BudgetCalculator />} />
            <Route path="/budget-calculator" element={<BudgetCalculator />} />
            <Route path="/chat" element={<AiChatPage />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="/listing/:id" element={<ListingDetails />} />
            
            {/* Legal & Policy Routes */}
            <Route path="/legal" element={<Legal />} />
            <Route path="/privacy" element={<Legal defaultTab="privacy" />} />
            <Route path="/terms" element={<Legal defaultTab="terms" />} />
            <Route path="/safety" element={<Legal defaultTab="safety" />} />

            {/* Help, About & Hubs Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/hubs" element={<HubsPage />} />
            <Route path="/student-hubs" element={<HubsPage />} />
            <Route path="/help" element={<Help />} />
            <Route path="/support" element={<Help />} />
            
            {/* Direct In-App Chat Routes */}
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/messages/:conversationId" 
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/sell" 
              element={
                <ProtectedRoute>
                  <SellItem />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sell-item" 
              element={
                <ProtectedRoute>
                  <SellItem />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <AccountSettingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/account-settings" 
              element={
                <ProtectedRoute>
                  <AccountSettingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/saved-listings" 
              element={
                <ProtectedRoute>
                  <SavedListingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/saved" 
              element={
                <ProtectedRoute>
                  <SavedListingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-marketplace" 
              element={
                <ProtectedRoute>
                  <MyMarketplacePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-listings" 
              element={
                <ProtectedRoute>
                  <MyListingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/add-listing" 
              element={
                <ProtectedRoute>
                  <AddListing />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-listing/:id" 
              element={
                <ProtectedRoute>
                  <EditListing />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard 
                    onSwitchToStudentView={() => {
                      setAdminViewMode('student');
                      localStorage.setItem('admin_view_mode', 'student');
                      navigate('/');
                    }}
                  />
                </ProtectedRoute>
              } 
            />

            {/* 404 Not Found Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <InstallAppPrompt />
      {location.pathname === '/' && (
        <Suspense fallback={null}>
          <AiFloatingAssistant />
        </Suspense>
      )}
      <BottomNav />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'system';
    if (theme === 'light' || (theme === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <LanguageProvider>
          <LocationProvider>
            <Router>
              <AppLayout />
            </Router>
          </LocationProvider>
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
