// Email Service for Arali using multiple providers
// Compatible with Deno runtime (Supabase Edge Functions)

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
}

/**
 * Sends an email using the best available method
 * Priority: Resend API > SMTP > Simulation
 */
export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<boolean> {
  // Try Resend API first (most reliable for serverless)
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  if (resendApiKey) {
    return await sendEmailViaResend({ to, subject, html, text }, resendApiKey);
  }

  // Fall back to SMTP
  return await sendEmailViaSMTP({ to, subject, html, text });
}

/**
 * Send email via Resend.com API (recommended for production)
 * Sign up at https://resend.com for a free API key
 */
async function sendEmailViaResend(
  { to, subject, html, text }: EmailOptions,
  apiKey: string
): Promise<boolean> {
  try {
    // Determine the "from" address based on environment
    // If you have a verified domain, update RESEND_FROM_EMAIL
    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'Arali <onboarding@resend.dev>';
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject: subject,
        html: html,
        text: text,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Resend API error:', data);
      
      // Provide helpful error messages
      if (data.statusCode === 403 && data.message?.includes('testing emails')) {
        console.error('');
        console.error('   📧 Resend Testing Mode Restriction:');
        console.error('   You can only send to your verified email in testing mode.');
        console.error('');
        console.error('   💡 To send to any email address:');
        console.error('   1. Go to https://resend.com/domains');
        console.error('   2. Click "Add Domain"');
        console.error('   3. Add your domain (e.g., aralimsk.com)');
        console.error('   4. Verify DNS records (Resend will guide you)');
        console.error('   5. Update RESEND_FROM_EMAIL environment variable to: Arali <hello@aralimsk.com>');
        console.error('');
        console.error('   🧪 For testing now: Emails will be saved but only visible to you');
      }
      
      return false;
    }

    console.log('✅ Email sent successfully via Resend!');
    console.log(`   Email ID: ${data.id}`);
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error sending email via Resend:', error);
    return false;
  }
}

/**
 * Send email via SMTP (fallback method)
 */
async function sendEmailViaSMTP({ to, subject, html, text }: EmailOptions): Promise<boolean> {
  try {
    const smtpConfig: SMTPConfig = {
      host: Deno.env.get('SMTP_HOST') ?? '',
      port: parseInt(Deno.env.get('SMTP_PORT') ?? '587'),
      secure: Deno.env.get('SMTP_SECURE') === 'true',
      username: Deno.env.get('SMTP_USER') ?? '',
      password: Deno.env.get('SMTP_PASS') ?? '',
    };

    // Validate SMTP configuration
    if (!smtpConfig.host || !smtpConfig.username || !smtpConfig.password) {
      // SMTP not configured - run in simulation mode
      console.log('📧 Email Simulation Mode (No email service configured)');
      console.log(`   To: ${to}`);
      console.log(`   Subject: ${subject}`);
      console.log('   ✅ Email logged successfully');
      console.log('');
      console.log('   💡 To enable real emails, configure one of:');
      console.log('      1. RESEND_API_KEY (recommended) - Sign up at https://resend.com');
      console.log('      2. SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS, etc.)');
      return true;
    }

    // Import nodemailer dynamically
    const nodemailer = await import('npm:nodemailer@6.9.8');
    
    // Create transporter with better Gmail configuration
    const transporter = nodemailer.default.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.username,
        pass: smtpConfig.password,
      },
      // Gmail-specific settings
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
        minVersion: 'TLSv1.2',
      },
      // Authentication method
      authMethod: 'LOGIN',
    });

    // Verify connection configuration
    try {
      await transporter.verify();
      console.log('✅ SMTP server is ready to send emails');
    } catch (verifyError: any) {
      console.error('❌ SMTP verification failed:', verifyError.message);
      
      // Provide helpful error messages
      if (verifyError.code === 'EAUTH') {
        console.error('');
        console.error('   🔐 Gmail Authentication Failed - Please check:');
        console.error('   1. Is 2-Step Verification enabled on your Google account?');
        console.error('   2. Did you generate an App Password at https://myaccount.google.com/apppasswords?');
        console.error('   3. Is the App Password correct (16 characters, no spaces)?');
        console.error('   4. Try removing and re-adding the SMTP_PASS environment variable');
        console.error('');
        console.error('   💡 Alternative: Use Resend.com instead (much easier for serverless)');
        console.error('      - Sign up at https://resend.com');
        console.error('      - Get free API key');
        console.error('      - Set RESEND_API_KEY environment variable');
      }
      
      throw verifyError;
    }

    // Send email
    const info = await transporter.sendMail({
      from: `"Arali" <${smtpConfig.username}>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
    });

    console.log('✅ Email sent successfully via SMTP!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    
    return true;
  } catch (error: any) {
    console.error('❌ Error sending email via SMTP:', error.message || error);
    return false;
  }
}

/**
 * Send OTP email
 */
export async function sendOTPEmail(to: string, otp: string): Promise<boolean> {
  const subject = 'Password Reset Code - Arali';
  const text = `Your password reset code is ${otp}. This code is valid for 5 minutes.`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #0F4C81 0%, #1a5c96 100%); padding: 40px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
          .content { padding: 40px; }
          .otp-box { background: #f8f9fa; border-left: 4px solid #0F4C81; padding: 20px; margin: 30px 0; border-radius: 8px; }
          .otp { font-size: 32px; font-weight: 700; color: #0F4C81; letter-spacing: 8px; text-align: center; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
          .button { display: inline-block; padding: 14px 32px; background: #0F4C81; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          <div class="content">
            <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              We received a request to reset your Arali account password. Use the code below to complete your password reset:
            </p>
            <div class="otp-box">
              <div class="otp">${otp}</div>
            </div>
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              ⏱️ This code will expire in <strong>5 minutes</strong>.<br/>
              🔒 For security, never share this code with anyone.
            </p>
            <p style="color: #999; font-size: 13px; margin-top: 30px;">
              If you didn't request this password reset, please ignore this email and your password will remain unchanged.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 10px 0;">Smart Retail. Zero Waste.</p>
            <p style="margin: 0; font-size: 12px; color: #999;">© ${new Date().getFullYear()} Arali Inc. All rights reserved.</p>
            <p style="margin: 10px 0 0 0; font-size: 10px; color: #ccc;">made by MARESOLIK INC.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to, subject, text, html });
}

/**
 * Send waitlist confirmation email
 */
export async function sendWaitlistEmail(to: string): Promise<boolean> {
  const subject = 'Welcome to the Arali Waitlist! 🎉';
  const text = `Thank you for joining the Arali waitlist! We're excited to have you on board. We'll notify you as soon as we launch.`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #0F4C81 0%, #1a5c96 100%); padding: 40px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
          .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px; }
          .content { padding: 40px; }
          .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
          .highlight-box { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #0F4C81; padding: 20px; margin: 30px 0; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 You're on the List!</h1>
            <p>Welcome to the Arali Waitlist</p>
          </div>
          <div class="content">
            <h2 style="color: #333; margin-top: 0;">Thank You for Joining!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.8;">
              Hi there! 👋
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.8;">
              We're thrilled to have you join the Arali waitlist. You're now among the first to know when we launch our smart retail management platform.
            </p>
            <div class="highlight-box">
              <h3 style="color: #0F4C81; margin-top: 0; font-size: 18px;">What's Next?</h3>
              <ul style="color: #666; font-size: 15px; line-height: 1.8; padding-left: 20px;">
                <li>📧 We'll email you when Arali launches</li>
                <li>🎁 Early access to exclusive features</li>
                <li>💡 Tips and updates on retail management</li>
                <li>🌟 Special launch offers for waitlist members</li>
              </ul>
            </div>
            <p style="color: #666; font-size: 16px; line-height: 1.8;">
              In the meantime, follow us on social media to stay updated on our progress and learn more about how Arali is helping small businesses thrive with smart retail solutions.
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.8;">
              Have questions? Just reply to this email — we'd love to hear from you!
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.8; margin-top: 30px;">
              Best regards,<br/>
              <strong>The Arali Team</strong>
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 10px 0; font-weight: 600;">Smart Retail. Zero Waste.</p>
            <p style="margin: 0; font-size: 12px; color: #999;">© ${new Date().getFullYear()} Arali Inc. All rights reserved.</p>
            <p style="margin: 10px 0 0 0; font-size: 10px; color: #ccc;">made by MARESOLIK INC.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to, subject, text, html });
}