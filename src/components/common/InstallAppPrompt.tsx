import React, { useState, useEffect } from 'react';
import { X, Sparkles, Share, PlusSquare, ArrowUp } from 'lucide-react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallAppPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // 1. Check if already installed in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    // 2. Check if user dismissed it in this session
    const isDismissed = sessionStorage.getItem('pwa_install_dismissed');
    if (isDismissed) return;

    // 3. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // 4. Listen for Chromium/Android install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      toast.success('City Helpline app installed successfully! 🎉');
    });

    // On iOS or mobile web where beforeinstallprompt isn't fired immediately, show top prompt after a brief 2-second delay
    const timer = setTimeout(() => {
      if (!isStandalone && !isDismissed) {
        setShowPrompt(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setShowPrompt(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
      return;
    }

    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    // Generic fallback for desktop / other browsers without direct prompt
    toast.info(
      "To install: Tap your browser menu (⋮ / Share) and select 'Install App' or 'Add to Home screen'.",
      { duration: 5000 }
    );
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa_install_dismissed', 'true');
  };

  if (!showPrompt) return null;

  const currentHost = typeof window !== 'undefined' ? (window.location.hostname || 'app.imprince.me') : 'app.imprince.me';

  return (
    <>
      {/* Native-Style Top Floating Install Bar (Matching Screenshot) */}
      <aside 
        aria-label="Install Application Banner"
        className="fixed top-3 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-[440px] z-[9999] animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto"
      >
        <div className="relative flex items-center justify-between gap-3 bg-[#1F1B24]/95 hover:bg-[#231E2A] backdrop-blur-2xl border border-white/15 rounded-2xl px-3.5 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_20px_rgba(0,229,255,0.15)] transition-all">
          
          {/* Left: App Squircle Icon */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00E5FF] via-[#6B11FF] to-[#FF9900] p-[1.5px] shadow-md shrink-0 overflow-hidden group">
              <div className="w-full h-full rounded-[10px] bg-[#121624] flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.png"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/logo.svg';
                  }}
                  alt="City Helpline App"
                  className="w-full h-full object-contain p-1"
                />
              </div>
            </div>

            {/* Center: Title & Hostname */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-[14px] font-bold text-white tracking-tight leading-tight truncate">
                  Install City Helpline
                </h4>
              </div>
              <p className="text-[12px] text-gray-400 tracking-wide font-normal truncate mt-0.5">
                {currentHost}
              </p>
            </div>
          </div>

          {/* Right: Install Action & Close Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 rounded-xl bg-[#FFB74D] hover:bg-[#FFA726] active:scale-95 text-[#1F1B24] font-bold text-[13px] tracking-wide transition-all shadow-sm cursor-pointer"
            >
              Install
            </button>

            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 active:scale-90 transition-colors"
              title="Dismiss"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* iOS Safari Guided Install Bottom Sheet */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#161926] border border-white/15 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00E5FF] to-[#8A2BE2] p-0.5">
                  <div className="w-full h-full bg-[#0E1320] rounded-[6px] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white">Install on iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                <span className="w-5 h-5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <p>
                  Tap the <strong className="text-white">Share</strong> button <Share className="w-3.5 h-3.5 inline text-[#00E5FF] mx-0.5" /> in your Safari bottom bar.
                </p>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                <span className="w-5 h-5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <p>
                  Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-[#00E5FF] mx-0.5" />.
                </p>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                <span className="w-5 h-5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <p>
                  Tap <strong className="text-white">"Add"</strong> in the top right corner. The City Helpline app will appear on your home screen!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2] text-white font-bold text-xs hover:brightness-110 active:scale-98 transition-all"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
