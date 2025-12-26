# SMTP Email Setup for Arali

## Overview

Your Arali app now has a fully functional email system for:
- ✅ Waitlist confirmation emails
- ✅ OTP (One-Time Password) authentication emails
- ✅ Notification emails

## Email Service Implementation

The email service is located at `/supabase/functions/server/emailService.tsx` and uses SMTP to send emails.

## Environment Variables Setup

To enable email sending, you need to configure the following environment variables in your Supabase project:

### Required Variables

```bash
SMTP_HOST=smtp.gmail.com          # Your SMTP server host
SMTP_PORT=587                      # SMTP port (usually 587 for TLS)
SMTP_SECURE=false                  # Use 'true' for port 465, 'false' for other ports
SMTP_USER=your_email@gmail.com    # Your email address
SMTP_PASS=your_app_password       # Your email app password
```

## Provider-Specific Setup

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Google account
2. **Create an App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/security)
   - Navigate to "Security" → "2-Step Verification" → "App passwords"
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Configure Environment Variables**:
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=youremail@gmail.com
   SMTP_PASS=your-16-char-app-password
   ```

### Outlook/Hotmail Setup

```bash
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=youremail@outlook.com
SMTP_PASS=your-password
```

### Zoho Mail Setup

```bash
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=youremail@zoho.com
SMTP_PASS=your-password
```

### AWS SES Setup

```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-aws-smtp-username
SMTP_PASS=your-aws-smtp-password
```

## Adding Environment Variables to Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Edge Functions**
3. Add each environment variable:
   - Click "Add variable"
   - Enter the variable name (e.g., `SMTP_HOST`)
   - Enter the variable value
   - Click "Save"

## Current Implementation Status

### ✅ Implemented Features

1. **Waitlist Email System**
   - Endpoint: `POST /make-server-29b58f9a/waitlist`
   - Sends beautiful HTML welcome emails to new waitlist signups
   - Stores emails in database
   - Prevents duplicate signups

2. **OTP Email Function**
   - Function: `sendOTPEmail(email, otp)`
   - Sends verification codes for authentication
   - 5-minute expiry notice included

3. **Email Templates**
   - Professional HTML emails with Arali branding
   - Responsive design
   - MARESOLIK INC. watermark included

### 🔄 Current Behavior

**Without SMTP Configuration:**
- Emails are logged to console (simulation mode)
- Waitlist still functions normally
- Users see success messages

**With SMTP Configuration:**
- Emails are sent to actual recipients
- Professional branded emails delivered
- Full production functionality

## Testing the Email System

1. **Test Waitlist Signup**:
   - Visit your Arali homepage
   - Scroll to footer
   - Enter your email in "Join Waitlist"
   - Check console logs (if SMTP not configured) or email inbox (if configured)

2. **Check Waitlist Count** (Admin):
   ```bash
   GET https://[your-project-id].supabase.co/functions/v1/make-server-29b58f9a/waitlist/count
   ```

## Email Templates

### Waitlist Confirmation Email
- Subject: "Welcome to the Arali Waitlist! 🎉"
- Includes: Welcome message, what's next, social links
- Styled with Arali branding colors

### OTP Email
- Subject: "Your Arali Login OTP"
- Includes: 6-digit code, 5-minute expiry warning
- Security reminders

## Troubleshooting

### Common Issues

1. **"SMTP configuration incomplete" in logs**
   - Solution: Add all required environment variables

2. **Gmail "Less secure app access" error**
   - Solution: Use App Password instead of regular password

3. **Emails not sending**
   - Check SMTP credentials
   - Verify port and host are correct
   - Check Supabase function logs

4. **550 Authentication Required**
   - Verify SMTP_USER and SMTP_PASS are correct
   - For Gmail, ensure 2FA is enabled and using App Password

## Production Considerations

For production deployment, consider:

1. **Email Delivery Service**: Use a dedicated service like:
   - SendGrid
   - Mailgun
   - AWS SES
   - Postmark

2. **Rate Limiting**: Implement rate limiting on waitlist endpoint

3. **Email Verification**: Add double opt-in for waitlist

4. **Analytics**: Track email open rates and click-through rates

## Next Steps

1. ✅ Add SMTP environment variables to Supabase
2. ✅ Test waitlist signup with your email
3. ✅ Verify email delivery
4. ✅ Monitor Supabase function logs for any errors
5. 🔜 Consider upgrading to professional email service for production

## Support

If you encounter any issues:
- Check Supabase Edge Function logs
- Verify all environment variables are set correctly
- Ensure SMTP credentials are valid

---

**Made by MARESOLIK INC.**
