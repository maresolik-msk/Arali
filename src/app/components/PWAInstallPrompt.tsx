import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if user previously dismissed the prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    // Show prompt again after 7 days
    if (daysSinceDismissed < 7) {
      return;
    }

    // Listen for install prompt (Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after 30 seconds of usage
      setTimeout(() => setShowPrompt(true), 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show instructions after 30 seconds
    if (iOS && !dismissed) {
      setTimeout(() => setShowPrompt(true), 30000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSInstructions(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81]/95 via-[#082032]/95 to-black/95 backdrop-blur-2xl border border-white/10 shadow-2xl">
            {/* Ambient Background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white to-transparent rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6">
              {!showIOSInstructions ? (
                <>
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-[#0F4C81] blur-xl opacity-50" />
                      <div className="relative p-3 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20">
                        <Smartphone className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white tracking-tight mb-1">
                        Install Arali App
                      </h3>
                      <p className="text-xs text-white/60 leading-relaxed">
                        Add to your home screen for quick access and offline use
                      </p>
                    </div>
                    <button
                      onClick={handleDismiss}
                      className="p-1 text-white/60 hover:text-white transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-xs text-white/70">
                      <Check className="h-4 w-4 text-green-400" />
                      <span>Works offline</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/70">
                      <Check className="h-4 w-4 text-green-400" />
                      <span>Fast & reliable</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/70">
                      <Check className="h-4 w-4 text-green-400" />
                      <span>Native app experience</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={handleInstall}
                      className="flex-1 bg-white/15 hover:bg-white/20 text-white border border-white/20"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Install App
                    </Button>
                    <Button
                      onClick={handleDismiss}
                      variant="ghost"
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      Maybe Later
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* iOS Instructions */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-[#0F4C81] blur-xl opacity-50" />
                      <div className="relative p-3 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20">
                        <Smartphone className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white tracking-tight mb-1">
                        Install on iOS
                      </h3>
                      <p className="text-xs text-white/60 leading-relaxed">
                        Follow these steps to add Arali to your home screen
                      </p>
                    </div>
                    <button
                      onClick={handleDismiss}
                      className="p-1 text-white/60 hover:text-white transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Steps */}
                  <div className="space-y-3 mb-6">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <span className="text-xs text-white">1</span>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed">
                        Tap the <strong className="text-white">Share</strong> button (square with arrow)
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <span className="text-xs text-white">2</span>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed">
                        Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong>
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <span className="text-xs text-white">3</span>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed">
                        Tap <strong className="text-white">"Add"</strong> to confirm
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    onClick={handleDismiss}
                    className="w-full bg-white/15 hover:bg-white/20 text-white border border-white/20"
                  >
                    Got it
                  </Button>
                </>
              )}
            </div>

            {/* Footer Branding */}
            <div className="relative z-10 px-6 py-3 border-t border-white/10 bg-gradient-to-t from-black/20 to-transparent">
              <div className="flex items-center justify-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                <span className="text-[9px] uppercase tracking-[0.15em] text-white/30">
                  MARESOLIK INC
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
