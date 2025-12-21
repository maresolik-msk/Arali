# 📧 Arali Email & SMTP Configuration Guide

## Overview

Arali now supports automatic email notifications for critical alerts and OTP functionality using Supabase's built-in SMTP integration. This guide will help you configure and use the email features.

## 🎯 Email Features

### 1. **Password Reset Emails (OTP)**
- Users can reset forgotten passwords via email
- Secure OTP links sent automatically
- Works through Supabase Auth's built-in functionality

### 2. **Notification Alerts**
- **Low Stock Alerts**: Automatic emails when inventory is low
- **Critical Notifications**: High-priority alerts sent instantly
- **Manual Notifications**: Send any notification via email on demand

### 3. **Automatic Email Triggers**
The system automatically sends emails for:
- ✅ Low stock alerts (`type: 'low_stock'`)
- ✅ High priority notifications (`priority: 'high'`)
- ✅ Password reset requests

---

## 🔧 SMTP Configuration in Supabase

### Step 1: Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Email Templates**

### Step 2: Enable Custom SMTP
1. Go to **Project Settings** → **Auth** → **SMTP Settings**
2. Click on **Enable Custom SMTP**

### Step 3: Configure SMTP Server

Enter your SMTP provider details:

#### **Gmail SMTP Example:**
```
Host: smtp.gmail.com
Port: 587
Username: your-email@gmail.com
Password: your-app-specific-password
Sender Email: your-email@gmail.com
Sender Name: Arali Store
```

#### **SendGrid SMTP Example:**
```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: YOUR_SENDGRID_API_KEY
Sender Email: noreply@yourdomain.com
Sender Name: Arali Notifications
```

#### **Other Popular SMTP Providers:**
- **Mailgun**: smtp.mailgun.org (Port: 587)
- **Amazon SES**: email-smtp.us-east-1.amazonaws.com (Port: 587)
- **Postmark**: smtp.postmarkapp.com (Port: 587)
- **Brevo (Sendinblue)**: smtp-relay.brevo.com (Port: 587)

### Step 4: Test SMTP Configuration
1. Save your SMTP settings in Supabase
2. Click **"Send Test Email"** to verify configuration
3. Check your inbox for the test email

---

## 📝 Email Templates

### Password Reset Email
Supabase provides default templates for:
- **Magic Link**
- **Password Reset**
- **Email Confirmation**
- **Email Change**

### Custom Notification Email Template
Arali uses beautiful HTML email templates for notifications:

**Features:**
- 🎨 Branded with Arali colors (#0F4C81 Classic Blue)
- 📱 Mobile-responsive design
- 🏷️ Color-coded notification types:
  - **Low Stock**: Red badge
  - **Order Status**: Blue badge
  - **New Customer**: Green badge
  - **Info**: Gray badge
- 🕐 Indian Standard Time (IST) timestamps
- 🔗 Direct link to dashboard

---

## 🚀 How It Works

### 1. **Password Reset Flow**
```typescript
// User requests password reset
await resetPassword('user@example.com');

// Supabase sends email with reset link
// Link format: https://yourapp.com/login?reset=true

// User clicks link and sets new password
await changePassword('newPassword123');
```

### 2. **Automatic Notification Emails**
```typescript
// When creating a notification, email is automatically sent if:
// - Type is 'low_stock'
// - Priority is 'high'

const notification = {
  type: 'low_stock',
  title: 'Low Stock Alert',
  message: 'Product XYZ has only 5 units left',
  priority: 'high'
};

// Email sent automatically via SMTP
await notificationsApi.create(notification);
```

### 3. **Manual Email Sending**
```typescript
// Send any existing notification via email
await notificationsApi.sendEmail(notificationId);
```

---

## 🛠️ Technical Implementation

### Server-Side (Supabase Edge Function)
The backend automatically handles:
- ✅ User authentication
- ✅ Email template rendering
- ✅ SMTP delivery via Supabase
- ✅ Error handling and logging
- ✅ Graceful degradation if email fails

### Frontend Integration
```typescript
// All email functionality is transparent
// Just use the notification system as normal

// Create notification (email sent automatically for critical alerts)
await notificationsApi.create({
  type: 'low_stock',
  title: 'Coffee Beans Running Low',
  message: 'Only 12 units remaining',
  read: false
});
```

---

## 📊 Email Monitoring & Logs

### Check Email Delivery Status
1. Open browser console (F12)
2. Look for log messages:
   ```
   Email notification sent successfully to: user@example.com
   Notification details: { title, type, message }
   ```

### View Supabase Logs
1. Go to Supabase Dashboard → **Edge Functions**
2. Select `make-server-29b58f9a`
3. View logs for email sending activity

### Common Log Messages
```
✅ "Email notification sent successfully via Supabase SMTP"
⚠️ "Notification saved but email delivery failed. Please check SMTP configuration."
❌ "Email sending error: [error details]"
```

---

## 🔒 Security Best Practices

### 1. **Use App-Specific Passwords**
- For Gmail: Create an [App Password](https://support.google.com/accounts/answer/185833)
- Never use your main account password

### 2. **Environment Variables**
All SMTP credentials are stored securely in Supabase:
- **SUPABASE_URL**: Managed by Supabase
- **SUPABASE_SERVICE_ROLE_KEY**: Managed by Supabase
- **SMTP Settings**: Stored in Supabase Auth configuration

### 3. **Email Rate Limits**
Be aware of provider limits:
- **Gmail**: 500 emails/day
- **SendGrid Free**: 100 emails/day
- **Mailgun Free**: 5,000 emails/month

---

## 🎨 Customization

### Modify Email Templates
Edit the HTML template in `/supabase/functions/server/index.tsx`:

```typescript
// Find the sendNotificationEmail function
// Customize the emailHtml variable with your branding
```

### Change Auto-Email Triggers
```typescript
// In server index.tsx, modify this condition:
const shouldAutoEmail = 
  notificationData.type === 'low_stock' || 
  notificationData.priority === 'high' ||
  notificationData.type === 'your_custom_type';
```

---

## 🐛 Troubleshooting

### Issue: "Error sending recovery email"

**This is the most common error and means SMTP is not configured yet.**

**Solution:**
1. ✅ Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. ✅ Select your project
3. ✅ Navigate to **Authentication** → **Email Templates**
4. ✅ Click **SMTP Settings**
5. ✅ Enable **"Custom SMTP"**
6. ✅ Enter your SMTP provider details (see examples below)
7. ✅ Click **"Send Test Email"** to verify
8. ✅ Try password reset again

**Temporary Workaround:**
- Users can continue signing in with their existing passwords
- Create new accounts normally (sign up works without SMTP)
- Contact support for password assistance

### Issue: Emails Not Sending

**Check:**
1. ✅ SMTP settings are correct in Supabase
2. ✅ Sender email is verified with your provider
3. ✅ Check spam/junk folder
4. ✅ View Supabase Edge Function logs
5. ✅ Verify email quotas aren't exceeded

### Issue: Password Reset Emails Not Arriving

**Solution:**
1. Verify SMTP is enabled in Supabase
2. Check email templates are configured
3. Test with Supabase's "Send Test Email" button
4. Check recipient's spam folder

### Issue: Wrong Sender Email

**Solution:**
1. Update "Sender Email" in Supabase SMTP settings
2. Update "Sender Name" for better branding

---

## 📧 Example SMTP Configurations

### Gmail Setup (For Development)
```
Host: smtp.gmail.com
Port: 587 (TLS) or 465 (SSL)
Username: youremail@gmail.com
Password: [App-specific password]
Encryption: TLS/STARTTLS

⚠️ Enable 2-Factor Authentication
⚠️ Create App-Specific Password
```

### SendGrid (Recommended for Production)
```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: [Your SendGrid API Key]
Encryption: TLS

✅ Free tier: 100 emails/day
✅ Better deliverability
✅ Email analytics
```

### Mailgun (Good for Transactional Emails)
```
Host: smtp.mailgun.org
Port: 587
Username: [Your Mailgun SMTP username]
Password: [Your Mailgun SMTP password]
Encryption: TLS

✅ 5,000 free emails/month
✅ Excellent deliverability
```

---

## 🎯 Best Practices

1. **Test Thoroughly**: Always test with your real email first
2. **Monitor Logs**: Check Supabase logs regularly
3. **Use Professional Email**: Use a business domain for better deliverability
4. **SPF/DKIM Records**: Configure DNS records for your domain
5. **Unsubscribe Links**: Consider adding for compliance (if needed)
6. **Indian Rupee ₹**: All currency displays use ₹ symbol
7. **IST Timezone**: All timestamps in Indian Standard Time

---

## 📱 Mobile Optimization

All email templates are mobile-responsive:
- ✅ Readable on all devices
- ✅ Touch-friendly buttons
- ✅ Optimized images
- ✅ Clean, modern design

---

## 🎉 Quick Start Checklist

- [ ] Configure SMTP in Supabase dashboard
- [ ] Test password reset functionality
- [ ] Create a low stock notification
- [ ] Verify email delivery
- [ ] Check spam folder if not received
- [ ] Review Supabase Edge Function logs
- [ ] Customize email template (optional)
- [ ] Set up SPF/DKIM records (production)

---

## 📞 Support

For issues or questions:
1. Check Supabase Edge Function logs
2. Review browser console for errors
3. Verify SMTP configuration in Supabase
4. Test with Supabase's built-in email test

---

**🎊 Your Arali store now has professional email notifications powered by Supabase SMTP!**

Remember: All critical alerts (low stock, high priority) will automatically trigger emails to keep you informed 24/7!