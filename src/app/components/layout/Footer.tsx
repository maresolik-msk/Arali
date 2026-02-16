import React from 'react';
import { Link } from 'react-router';
import { X as XIcon, Linkedin, Instagram, Facebook, Smartphone, Monitor, ArrowRight, Mail, MapPin, Phone, Heart } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showInstallModal, setShowInstallModal] = React.useState(false);
  const [selectedPlatform, setSelectedPlatform] = React.useState<'ios' | 'android' | null>(null);
  const [emailFocused, setEmailFocused] = React.useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-29b58f9a/waitlist`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.alreadyExists) {
          toast.success("You're already on our waitlist!", {
            description: "We'll notify you as soon as we launch.",
          });
        } else {
          toast.success('Welcome to the Arali Waitlist!', {
            description: "Check your email for confirmation. We'll be in touch soon!",
          });
        }
        setEmail('');
      } else {
        throw new Error(data.error || 'Failed to join waitlist');
      }
    } catch (error) {
      console.error('Waitlist error:', error);
      toast.error('Failed to join waitlist', {
        description: 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialClick = (platform: string) => {
    const socialUrls: { [key: string]: string } = {
      twitter: 'https://twitter.com/arali',
      linkedin: 'https://linkedin.com/company/arali',
      instagram: 'https://instagram.com/arali',
      facebook: 'https://facebook.com/arali'
    };
    window.open(socialUrls[platform], '_blank');
  };

  const handleInstallClick = (platform: 'ios' | 'android') => {
    setSelectedPlatform(platform);
    setShowInstallModal(true);
  };

  const handleInstallModalClose = () => {
    setShowInstallModal(false);
    setSelectedPlatform(null);
  };

  const productLinks = [
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'How it Works', path: '/how-it-works' },
    { name: 'Why Arali', path: '/why-arali' },
  ];

  const companyLinks = [
    { name: 'Our Story', path: '/story' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="relative bg-[#082032] text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0F4C81]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#0F4C81]/10 rounded-full blur-[100px]" />
      </div>

      {/* Floating Waitlist CTA */}
      <div className="relative container mx-auto px-6 pt-12 pb-4">
        <div className="bg-gradient-to-br from-[#0F4C81] to-[#0a3560] rounded-2xl p-8 md:p-10 shadow-2xl shadow-[#0F4C81]/30 border border-white/10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                Get Early Access
              </h3>
              <p className="text-white/70 text-sm md:text-base max-w-md">
                Join the waitlist for new features, updates, and exclusive early access.
              </p>
            </div>
            <form onSubmit={handleWaitlistSubmit} className="w-full md:flex-1 md:max-w-md">
              <div className={`flex items-center bg-white/10 backdrop-blur-sm rounded-full border transition-all duration-300 ${emailFocused ? 'border-white/40 shadow-lg shadow-white/5' : 'border-white/15'}`}>
                <div className="pl-4 text-white/40">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className="flex-1 bg-transparent px-3 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="m-1.5 px-5 py-2.5 bg-white text-[#0F4C81] rounded-full font-semibold text-sm hover:bg-white/90 transition-all duration-300 disabled:opacity-70 flex items-center gap-2 shrink-0"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-[#0F4C81]/30 border-t-[#0F4C81] rounded-full animate-spin" />
                  ) : (
                    <>
                      Join
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Logo
              className="h-8 w-auto"
              iconClassName="text-white"
              textClassName="text-white"
            />
            <p className="text-white/50 leading-relaxed text-sm max-w-xs">
              Empowering small retailers with simple, powerful inventory management tools built for the modern age.
            </p>

            {/* Install Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleInstallClick('ios')}
                className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <Smartphone size={18} className="text-white/60 group-hover:text-white transition-colors" />
                <div className="text-left">
                  <div className="text-[10px] text-white/40 leading-tight">Get on</div>
                  <div className="text-xs font-semibold text-white/80 group-hover:text-white leading-tight transition-colors">iOS</div>
                </div>
              </button>
              <button
                onClick={() => handleInstallClick('android')}
                className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <Monitor size={18} className="text-white/60 group-hover:text-white transition-colors" />
                <div className="text-left">
                  <div className="text-[10px] text-white/40 leading-tight">Get on</div>
                  <div className="text-xs font-semibold text-white/80 group-hover:text-white leading-tight transition-colors">Android</div>
                </div>
              </button>
            </div>
          </div>

          {/* Product Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-5">Product</h4>
            <ul className="space-y-3.5">
              {productLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/55 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-300">
                      <ArrowRight size={12} />
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-5">Company</h4>
            <ul className="space-y-3.5">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/55 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-300">
                      <ArrowRight size={12} />
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-5">Connect</h4>
            <div className="space-y-4">
              <a href="mailto:hello@arali.app" className="flex items-center gap-3 text-sm text-white/55 hover:text-white transition-colors group">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Mail size={14} />
                </span>
                contact@aralimsk.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-3 text-sm text-white/55 hover:text-white transition-colors group">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Phone size={14} />
                </span>
                +91 6303301002
              </a>
              <div className="flex items-center gap-3 text-sm text-white/55">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5">
                  <MapPin size={14} />
                </span>
                Anantapur, INDIA
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-white/35">
            <span>&copy; {currentYear} Arali. All rights reserved.</span>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
            
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleSocialClick('twitter')}
              className="p-2.5 rounded-lg text-white/35 hover:text-white hover:bg-white/5 transition-all duration-200"
              title="Follow on X"
            >
              <XIcon size={18} />
            </button>
            <a
              href="https://linkedin.com/company/arali-msk"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg text-white/35 hover:text-white hover:bg-white/5 transition-all duration-200"
              title="Follow on LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://www.instagram.com/arali.msk?igsh=MXJ2aTg3enk0N2N1ZQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg text-white/35 hover:text-white hover:bg-white/5 transition-all duration-200"
              title="Follow on Instagram"
            >
              <Instagram size={18} />
            </a>
            <button
              onClick={() => handleSocialClick('facebook')}
              className="p-2.5 rounded-lg text-white/35 hover:text-white hover:bg-white/5 transition-all duration-200"
              title="Follow on Facebook"
            >
              <Facebook size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Install Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f1a2e] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white text-lg">Install Arali</h3>
              <button
                onClick={handleInstallModalClose}
                className="text-white/40 hover:text-white/70 transition-colors p-1 rounded-lg hover:bg-white/5"
              >
                <XIcon size={18} />
              </button>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#0F4C81]/20 mb-4">
              {selectedPlatform === 'ios' ? <Smartphone size={22} className="text-[#0F4C81]" /> : <Monitor size={22} className="text-[#0F4C81]" />}
            </div>
            <p className="text-white/60 mb-6 text-sm leading-relaxed">
              {selectedPlatform === 'ios'
                ? "Tap the Share button in Safari and select 'Add to Home Screen' to install Arali on your iPhone."
                : "Tap the menu icon in Chrome and select 'Install App' to add Arali to your Android device."}
            </p>
            <button
              onClick={handleInstallModalClose}
              className="w-full py-3 bg-[#0F4C81] text-white rounded-xl font-medium hover:bg-[#0F4C81]/80 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}