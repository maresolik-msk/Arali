/**
 * PWA Readiness Checker
 * Run this in browser console to verify PWA setup
 */

(function checkPWAReadiness() {
  console.log('🔍 Checking PWA Readiness for Arali...\n');

  const checks = {
    manifest: false,
    serviceWorker: false,
    https: false,
    icons: false,
    themeColor: false,
    viewport: false,
    offline: false
  };

  const warnings = [];
  const errors = [];

  // Check 1: Manifest
  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (manifestLink) {
    checks.manifest = true;
    console.log('✅ Manifest linked');
    
    fetch(manifestLink.href)
      .then(r => r.json())
      .then(manifest => {
        console.log('   - Name:', manifest.name);
        console.log('   - Short name:', manifest.short_name);
        console.log('   - Icons:', manifest.icons?.length || 0);
        console.log('   - Start URL:', manifest.start_url);
        console.log('   - Display:', manifest.display);
      })
      .catch(() => {
        errors.push('Manifest file not found or invalid');
      });
  } else {
    errors.push('Manifest not linked in HTML');
  }

  // Check 2: Service Worker
  if ('serviceWorker' in navigator) {
    checks.serviceWorker = true;
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg) {
        console.log('✅ Service Worker registered');
        console.log('   - Scope:', reg.scope);
        console.log('   - State:', reg.active?.state || 'installing');
      } else {
        warnings.push('Service Worker not yet registered (refresh page)');
      }
    });
  } else {
    errors.push('Service Worker not supported in this browser');
  }

  // Check 3: HTTPS
  if (location.protocol === 'https:' || location.hostname === 'localhost') {
    checks.https = true;
    console.log('✅ Secure context (HTTPS or localhost)');
  } else {
    errors.push('HTTPS required for PWA (localhost is OK for testing)');
  }

  // Check 4: Icons
  const icons = document.querySelectorAll('link[rel*="icon"]');
  if (icons.length > 0) {
    checks.icons = true;
    console.log('✅ Icons found:', icons.length);
  } else {
    warnings.push('No icons found in HTML');
  }

  // Check 5: Theme Color
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    checks.themeColor = true;
    console.log('✅ Theme color:', themeColor.content);
  } else {
    warnings.push('Theme color not set');
  }

  // Check 6: Viewport
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    checks.viewport = true;
    console.log('✅ Viewport configured');
  } else {
    errors.push('Viewport meta tag missing');
  }

  // Check 7: Display Mode
  const displayMode = 
    window.matchMedia('(display-mode: standalone)').matches ? 'standalone' :
    window.matchMedia('(display-mode: fullscreen)').matches ? 'fullscreen' :
    window.matchMedia('(display-mode: minimal-ui)').matches ? 'minimal-ui' :
    'browser';
  
  console.log('📱 Display mode:', displayMode);
  if (displayMode === 'standalone' || displayMode === 'fullscreen') {
    console.log('✅ Running as installed PWA');
  }

  // Check 8: Platform Detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  console.log('📱 Platform:', 
    isIOS ? 'iOS' : 
    isAndroid ? 'Android' : 
    'Desktop'
  );

  // Check 9: Online Status
  console.log('🌐 Network:', navigator.onLine ? 'Online' : 'Offline');

  // Check 10: Notification Permission
  if ('Notification' in window) {
    console.log('🔔 Notifications:', Notification.permission);
  }

  // Check 11: Cache Storage
  if ('caches' in window) {
    caches.keys().then(names => {
      console.log('💾 Cache storage:', names.length, 'cache(s)');
      names.forEach(name => console.log('   -', name));
    });
  }

  // Summary
  setTimeout(() => {
    console.log('\n📊 Summary:');
    const passed = Object.values(checks).filter(Boolean).length;
    const total = Object.keys(checks).length;
    console.log(`   ${passed}/${total} checks passed`);

    if (errors.length > 0) {
      console.log('\n❌ Errors:');
      errors.forEach(e => console.log('   -', e));
    }

    if (warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      warnings.forEach(w => console.log('   -', w));
    }

    if (errors.length === 0 && warnings.length === 0) {
      console.log('\n🎉 PWA is production ready!');
      console.log('   Next steps:');
      console.log('   1. Generate app icons (see /public/icons/README.md)');
      console.log('   2. Test on real devices');
      console.log('   3. Run Lighthouse audit');
      console.log('   4. Deploy to HTTPS');
    } else if (errors.length === 0) {
      console.log('\n✅ PWA is functional with minor warnings');
    } else {
      console.log('\n🔧 Fix errors above before deploying');
    }
  }, 1000);

})();

// Export for use in code
if (typeof module !== 'undefined' && module.exports) {
  module.exports = checkPWAReadiness;
}
