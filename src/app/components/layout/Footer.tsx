import React from 'react';
import { Link } from 'react-router';
import { X as XIcon, Linkedin, Instagram, Facebook, Smartphone, Monitor, Download } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showInstallModal, setShowInstallModal] = React.useState(false);
  const [selectedPlatform, setSelectedPlatform] = React.useState<'ios' | 'android' | null>(null);

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
          toast.success('Welcome to the Arali Waitlist! 🎉', {
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
    // Mock social media navigation
    const socialUrls: { [key: string]: string } = {
      twitter: 'https://twitter.com/arali',
      linkedin: 'https://linkedin.com/company/arali',
      instagram: 'https://instagram.com/arali',
      facebook: 'https://facebook.com/arali'
    };
    
    // In production, these would be actual social media URLs
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

  return (
    <footer className="bg-white border-t border-[#0F4C81]/10 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Logo className="h-8 w-auto text-[#0F4C81]" />
                
            </div>
            <p className="text-[#082032]/60 leading-relaxed text-sm">
              Empowering small retailers with simple, powerful inventory management tools.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => handleInstallClick('ios')} 
                className="p-2 rounded-full bg-[#0F4C81]/5 hover:bg-[#0F4C81]/10 text-[#0F4C81] transition-colors"
                title="Install on iOS"
              >
                <Smartphone size={20} />
              </button>
              <button 
                onClick={() => handleInstallClick('android')} 
                className="p-2 rounded-full bg-[#0F4C81]/5 hover:bg-[#0F4C81]/10 text-[#0F4C81] transition-colors"
                title="Install on Android"
              >
                <Monitor size={20} />
              </button>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold text-[#0F4C81] mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link to="/features" className="text-[#082032]/60 hover:text-[#0F4C81] transition-colors text-sm">Features</Link></li>
              <li><Link to="/pricing" className="text-[#082032]/60 hover:text-[#0F4C81] transition-colors text-sm">Pricing</Link></li>
              <li><Link to="/how-it-works" className="text-[#082032]/60 hover:text-[#0F4C81] transition-colors text-sm">How it works</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#0F4C81] mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-[#082032]/60 hover:text-[#0F4C81] transition-colors text-sm">About Us</Link></li>
              <li><Link to="/blog" className="text-[#082032]/60 hover:text-[#0F4C81] transition-colors text-sm">Blog</Link></li>
              <li><Link to="/contact" className="text-[#082032]/60 hover:text-[#0F4C81] transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Waitlist Column */}
          <div>
            <h4 className="font-bold text-[#0F4C81] mb-6">Join the Waitlist</h4>
            <p className="text-[#082032]/60 mb-4 text-sm">
              Get early access to new features and updates.
            </p>
            <form onSubmit={handleWaitlistSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#0F4C81]/10 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 bg-[#F5F9FC] text-sm"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#0F4C81] text-white rounded-xl font-medium hover:bg-[#0F4C81]/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? 'Joining...' : 'Join Now'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-[#0F4C81]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#082032]/40 text-sm">
            © {currentYear} Arali. All rights reserved.
          </p>
          <div className="flex gap-6">
            <button onClick={() => handleSocialClick('twitter')} className="text-[#082032]/40 hover:text-[#0F4C81] transition-colors">
              <XIcon size={20} />
            </button>
            <a href="https://linkedin.com/company/arali-msk" target="_blank" rel="noopener noreferrer" className="text-[#082032]/40 hover:text-[#0F4C81] transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="https://www.instagram.com/arali.msk?igsh=MXJ2aTg3enk0N2N1ZQ==" target="_blank" rel="noopener noreferrer" className="text-[#082032]/40 hover:text-[#0F4C81] transition-colors">
              <Instagram size={20} />
            </a>
            <button onClick={() => handleSocialClick('facebook')} className="text-[#082032]/40 hover:text-[#0F4C81] transition-colors">
              <Facebook size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Install Modal */}
      {showInstallModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-[#0F4C81] text-lg">Install Arali</h3>
                  <button onClick={handleInstallModalClose} className="text-gray-400 hover:text-gray-600">
                     <XIcon size={20} />
                  </button>
               </div>
               <p className="text-[#082032]/60 mb-6 text-sm leading-relaxed">
                  {selectedPlatform === 'ios' 
                     ? "Tap the Share button and select 'Add to Home Screen' to install on your iPhone."
                     : "Tap the menu icon and select 'Install App' to install on your Android device."}
               </p>
               <button onClick={handleInstallModalClose} className="w-full py-3 bg-[#0F4C81] text-white rounded-xl font-medium">
                  Got it
               </button>
            </div>
         </div>
      )}
    </footer>
  );
}