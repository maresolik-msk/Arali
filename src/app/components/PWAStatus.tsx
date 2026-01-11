import React from 'react';
import { Smartphone, Wifi, Bell, Download, HardDrive, CheckCircle, XCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { usePWA } from '../hooks/usePWA';

export function PWAStatus() {
  const pwa = usePWA();
  const [cacheSize, setCacheSize] = React.useState<string>('Calculating...');
  const [hasNotificationPermission, setHasNotificationPermission] = React.useState(
    'Notification' in window && Notification.permission === 'granted'
  );

  React.useEffect(() => {
    loadCacheSize();
  }, []);

  const loadCacheSize = async () => {
    const size = await pwa.getCacheSize();
    const sizeMB = (size / (1024 * 1024)).toFixed(2);
    setCacheSize(`${sizeMB} MB`);
  };

  const handleRequestNotifications = async () => {
    const permission = await pwa.requestNotificationPermission();
    setHasNotificationPermission(permission === 'granted');
    
    if (permission === 'granted') {
      await pwa.showNotification('Notifications Enabled', {
        body: 'You will now receive important updates from Arali',
        icon: '/icons/icon-192x192.png'
      });
    }
  };

  const handleClearCache = async () => {
    if (confirm('This will clear all cached data and reload the app. Continue?')) {
      await pwa.clearCache();
      window.location.reload();
    }
  };

  const handleCheckUpdates = async () => {
    const hasUpdate = await pwa.checkForUpdates();
    
    if (hasUpdate) {
      if (confirm('A new version is available. Update now?')) {
        await pwa.applyUpdate();
      }
    } else {
      alert('You\'re running the latest version!');
    }
  };

  const StatusRow = ({ 
    icon: Icon, 
    label, 
    value, 
    status 
  }: { 
    icon: any; 
    label: string; 
    value: string; 
    status: 'success' | 'error' | 'neutral';
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${
          status === 'success' ? 'bg-green-50' :
          status === 'error' ? 'bg-red-50' :
          'bg-gray-50'
        }`}>
          <Icon className={`h-4 w-4 ${
            status === 'success' ? 'text-green-600' :
            status === 'error' ? 'text-red-600' :
            'text-gray-600'
          }`} />
        </div>
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-900">{value}</span>
        {status === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
        {status === 'error' && <XCircle className="h-4 w-4 text-red-600" />}
      </div>
    </div>
  );

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-gray-900 mb-1">App Status</h3>
        <p className="text-sm text-gray-600">
          Monitor your Progressive Web App health and features
        </p>
      </div>

      <div className="space-y-0">
        <StatusRow
          icon={Smartphone}
          label="Installation Status"
          value={pwa.isStandalone ? 'Installed' : 'Browser Mode'}
          status={pwa.isStandalone ? 'success' : 'neutral'}
        />

        <StatusRow
          icon={Smartphone}
          label="Display Mode"
          value={pwa.displayMode}
          status="neutral"
        />

        <StatusRow
          icon={Smartphone}
          label="Platform"
          value={pwa.platform.charAt(0).toUpperCase() + pwa.platform.slice(1)}
          status="neutral"
        />

        <StatusRow
          icon={Wifi}
          label="Network Status"
          value={pwa.isOnline ? 'Online' : 'Offline'}
          status={pwa.isOnline ? 'success' : 'error'}
        />

        <StatusRow
          icon={Bell}
          label="Notifications"
          value={hasNotificationPermission ? 'Enabled' : 'Disabled'}
          status={hasNotificationPermission ? 'success' : 'neutral'}
        />

        <StatusRow
          icon={HardDrive}
          label="Cache Size"
          value={cacheSize}
          status="neutral"
        />
      </div>

      <div className="mt-6 space-y-3">
        {!hasNotificationPermission && (
          <Button
            onClick={handleRequestNotifications}
            variant="outline"
            className="w-full"
          >
            <Bell className="h-4 w-4 mr-2" />
            Enable Notifications
          </Button>
        )}

        <Button
          onClick={handleCheckUpdates}
          variant="outline"
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          Check for Updates
        </Button>

        <Button
          onClick={handleClearCache}
          variant="outline"
          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <HardDrive className="h-4 w-4 mr-2" />
          Clear Cache
        </Button>
      </div>

      {!pwa.isStandalone && pwa.canInstall && (
        <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-900 mb-2">
            <strong>💡 Tip:</strong> Install Arali as an app for a better experience
          </p>
          <p className="text-xs text-blue-700">
            Look for the install prompt or add to your home screen from your browser menu
          </p>
        </div>
      )}

      {pwa.isStandalone && (
        <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200">
          <p className="text-sm text-green-900">
            <strong>✅ App Installed</strong>
          </p>
          <p className="text-xs text-green-700 mt-1">
            You're using Arali as an installed app with full offline support
          </p>
        </div>
      )}
    </Card>
  );
}
