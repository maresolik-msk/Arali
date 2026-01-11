# 🧪 Quick PWA Testing Guide

## Step 1: Check PWA Setup (5 minutes)

### In Browser Console
1. Open your app in Chrome/Edge
2. Press F12 to open DevTools
3. Paste this in Console tab:
```javascript
// Copy from /public/pwa-check.js
```
Or add this to your URL bar:
```
javascript:(function(){fetch('/pwa-check.js').then(r=>r.text()).then(eval)})()
```

Look for:
- ✅ All green checkmarks
- 📊 Summary showing high pass rate
- 🎉 "PWA is production ready!" message

---

## Step 2: Test Service Worker (2 minutes)

### Chrome DevTools
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers** in left sidebar

Should see:
- ✅ Service Worker: "activated and running"
- ✅ Green dot next to status
- ✅ Update and Unregister buttons available

### Test Offline
1. In same Application tab, click **Service Workers**
2. Check "Offline" checkbox
3. Reload page (Ctrl+R)
4. **Should still load!**
5. Uncheck "Offline" when done

---

## Step 3: Test Manifest (2 minutes)

### Chrome DevTools
1. Go to **Application** > **Manifest**

Should show:
- ✅ Name: "Arali - Premium Retail Management"
- ✅ Short name: "Arali"
- ✅ Start URL: "/"
- ✅ Display: "standalone"
- ✅ Theme color: "#0F4C81"
- ✅ Icons: List of icons (may show errors if not generated yet)

---

## Step 4: Test Install Prompt (Desktop)

### Chrome/Edge Desktop
1. Visit your app
2. Wait 30 seconds
3. Look for bottom-right popup with "Install App" button

**OR manually:**
1. Look for install icon in address bar (⊕ or computer icon)
2. Click it
3. Click "Install"
4. App opens in new window!

**To test again:**
1. Close installed app
2. Right-click app icon → Uninstall
3. Clear site data: DevTools → Application → Storage → Clear site data
4. Reload page and wait 30 seconds

---

## Step 5: Test on Mobile (Real Device)

### Android + Chrome
1. Open app URL on phone
2. Wait 30 seconds for prompt
3. Tap "Install" on prompt
4. Find app icon on home screen
5. Open app - should be full-screen (no browser UI)

**Manual install:**
1. Tap Chrome menu (⋮)
2. Tap "Install app" or "Add to Home screen"
3. Tap "Install"

### iPhone + Safari
1. Open app URL in Safari
2. Wait for custom iOS instructions popup
3. Follow instructions:
   - Tap Share button
   - Scroll to "Add to Home Screen"
   - Tap "Add"
4. Find icon on home screen
5. Open - should be full-screen

---

## Step 6: Test Offline Functionality

### On Installed App
1. Open installed app (desktop or mobile)
2. Browse around (POS, Inventory, etc.)
3. Enable airplane mode (or turn off WiFi)
4. Orange "You're offline" banner should appear
5. Try navigating - should still work!
6. Disable airplane mode
7. Green "Back online" banner should appear

---

## Step 7: Run Lighthouse Audit

### Chrome DevTools
1. Open DevTools (F12)
2. Go to **Lighthouse** tab
3. Select only "Progressive Web App"
4. Click "Analyze page load"

**Target scores:**
- PWA: 90+ (aim for 100)
- Installable: ✅
- PWA Optimized: ✅  
- Offline ready: ✅

---

## Step 8: Test Features

### Install Prompt
- [ ] Appears after 30 seconds
- [ ] Shows on desktop (Chrome/Edge)
- [ ] Shows iOS instructions (Safari)
- [ ] Can be dismissed
- [ ] Doesn't show if already installed
- [ ] Respects 7-day dismissal period

### Offline Indicator
- [ ] Orange banner when offline
- [ ] Green banner when back online
- [ ] Auto-hides after 3 seconds (online)
- [ ] Stays visible while offline

### Service Worker
- [ ] Registers successfully
- [ ] Caches assets on first visit
- [ ] Serves cached content offline
- [ ] Updates automatically
- [ ] Shows update prompt

### Installed App
- [ ] Icon appears on home screen
- [ ] Opens in standalone mode
- [ ] No browser UI visible
- [ ] Works offline
- [ ] Correct theme color
- [ ] Splash screen shows (if configured)

---

## Common Issues & Fixes

### "Service Worker won't register"
```javascript
// Check this in console:
navigator.serviceWorker.getRegistration().then(reg => {
  if (!reg) console.error('Not registered');
  else console.log('✅ Registered:', reg);
});
```
**Fix:** Ensure HTTPS or localhost, check console for errors

### "Install prompt doesn't appear"
**Causes:**
- Not waited 30 seconds
- Already dismissed (check localStorage: `pwa-install-dismissed`)
- Already installed (check if running in standalone)
- iOS (manual install only)

**Fix:**
```javascript
// Clear dismissal
localStorage.removeItem('pwa-install-dismissed');
// Reload page
```

### "Offline doesn't work"
**Fix:**
1. DevTools → Application → Storage → Clear site data
2. Reload page
3. Wait for service worker to activate
4. Try offline mode again

### "Icons not showing"
**Fix:**
1. Generate icons (see `/public/icons/README.md`)
2. Verify files exist at correct paths
3. Clear cache and reinstall

---

## Quick Commands

### Clear Everything & Start Fresh
```javascript
// Run in console:
caches.keys().then(keys => {
  keys.forEach(cache => caches.delete(cache));
});
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
});
localStorage.clear();
location.reload();
```

### Check Install Status
```javascript
// Am I installed?
window.matchMedia('(display-mode: standalone)').matches
// Returns: true if installed, false if browser
```

### Check Offline Status
```javascript
navigator.onLine // true = online, false = offline
```

### Force Update
```javascript
navigator.serviceWorker.getRegistration().then(reg => {
  reg.update();
});
```

---

## Success Checklist

Before deploying:

- [ ] Service worker registers (DevTools → Application)
- [ ] Manifest loads correctly (DevTools → Application)
- [ ] Icons generated (or placeholder ready)
- [ ] Install prompt appears on desktop
- [ ] Can install on Android
- [ ] Can install on iOS (manual)
- [ ] Works offline (test with airplane mode)
- [ ] Lighthouse PWA score: 90+
- [ ] No console errors
- [ ] Tested on real devices

---

## Next Steps After Testing

1. **Generate Real Icons**
   - Use logo/brand colors
   - All required sizes
   - Upload to `/public/icons/`

2. **Deploy to HTTPS**
   - Service workers require secure connection
   - Vercel, Netlify, or your hosting

3. **Test on Production**
   - Real devices with real URL
   - Share with beta testers
   - Gather feedback

4. **Monitor**
   - Check service worker errors
   - Track install rates
   - Monitor offline usage
   - Measure engagement

---

## Support

- Technical: See `/PWA_SETUP_GUIDE.md`
- Features: See `/PWA_IMPLEMENTATION_SUMMARY.md`
- Icons: See `/public/icons/README.md`

Your PWA is ready! 🚀
