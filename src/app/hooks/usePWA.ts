import { useState, useEffect } from 'react';
import * as pwaUtils from '../utils/pwa';

interface PWAState {
  isInstalled: boolean;
  isOnline: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  displayMode: 'browser' | 'standalone' | 'fullscreen' | 'minimal-ui';
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
}

interface PWAActions {
  requestNotificationPermission: () => Promise<NotificationPermission>;
  showNotification: (title: string, options?: NotificationOptions) => Promise<void>;
  checkForUpdates: () => Promise<boolean>;
  applyUpdate: () => Promise<void>;
  share: (data: ShareData) => Promise<boolean>;
  vibrate: (pattern: number | number[]) => boolean;
  clearCache: () => Promise<void>;
  getCacheSize: () => Promise<number>;
}

export function usePWA(): PWAState & PWAActions {
  const [state, setState] = useState<PWAState>({
    isInstalled: pwaUtils.isPWA(),
    isOnline: navigator.onLine,
    isStandalone: pwaUtils.isStandalone(),
    canInstall: pwaUtils.canInstallPWA(),
    displayMode: pwaUtils.getDisplayMode(),
    platform: pwaUtils.isIOS() ? 'ios' : pwaUtils.isAndroid() ? 'android' : 'desktop'
  });

  useEffect(() => {
    // Update online status
    const cleanup = pwaUtils.onNetworkChange((status) => {
      setState(prev => ({ ...prev, isOnline: status === 'online' }));
    });

    // Update display mode on change
    const updateDisplayMode = () => {
      setState(prev => ({ ...prev, displayMode: pwaUtils.getDisplayMode() }));
    };

    window.matchMedia('(display-mode: standalone)').addEventListener('change', updateDisplayMode);
    window.matchMedia('(display-mode: fullscreen)').addEventListener('change', updateDisplayMode);
    window.matchMedia('(display-mode: minimal-ui)').addEventListener('change', updateDisplayMode);

    return () => {
      cleanup();
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', updateDisplayMode);
      window.matchMedia('(display-mode: fullscreen)').removeEventListener('change', updateDisplayMode);
      window.matchMedia('(display-mode: minimal-ui)').removeEventListener('change', updateDisplayMode);
    };
  }, []);

  return {
    ...state,
    requestNotificationPermission: pwaUtils.requestNotificationPermission,
    showNotification: pwaUtils.showNotification,
    checkForUpdates: pwaUtils.checkForUpdates,
    applyUpdate: pwaUtils.applyUpdate,
    share: pwaUtils.share,
    vibrate: pwaUtils.vibrate,
    clearCache: pwaUtils.clearCache,
    getCacheSize: pwaUtils.getCacheSize
  };
}

// Hook for network status only
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkSpeed, setNetworkSpeed] = useState<'online' | 'offline' | 'slow'>(
    pwaUtils.getNetworkStatus()
  );

  useEffect(() => {
    const cleanup = pwaUtils.onNetworkChange((status) => {
      setIsOnline(status === 'online');
      setNetworkSpeed(pwaUtils.getNetworkStatus());
    });

    // Update speed when connection changes
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    if (connection) {
      const updateSpeed = () => {
        setNetworkSpeed(pwaUtils.getNetworkStatus());
      };
      connection.addEventListener('change', updateSpeed);
      return () => {
        cleanup();
        connection.removeEventListener('change', updateSpeed);
      };
    }

    return cleanup;
  }, []);

  return { isOnline, networkSpeed };
}

// Hook for install prompt
export function useInstallPrompt() {
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      return false;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setCanInstall(false);
      setDeferredPrompt(null);
      return true;
    }

    return false;
  };

  return { canInstall, promptInstall };
}
