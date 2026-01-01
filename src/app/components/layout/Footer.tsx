import React from 'react';
import { Link } from 'react-router-dom';
import { X as XIcon, Linkedin, Instagram, Facebook } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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

  return (
    <footer className="relative bg-[#0F4C81] text-white pt-32 pb-12 overflow-hidden px-[0px] py-[48px]">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-20 mb-24">
            {/* Brand & Mission */}
            <div className="max-w-xl">
                <div className="mb-8">
                    <Logo iconClassName="text-white" textClassName="text-white text-2xl" />
                </div>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
                    Smart Retail. Zero Waste.
                </h2>
                <div className="flex flex-col gap-4">
                     <p className="text-white/70 text-lg font-light max-w-md">
                        Helping small businesses thrive.
                     </p>
                     <form onSubmit={handleWaitlistSubmit} className="flex gap-4 mt-4 flex-wrap">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isSubmitting}
                            className="bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white transition-colors w-full md:w-auto min-w-[300px] disabled:opacity-50"
                        />
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-white text-[#0F4C81] rounded-full px-8 py-3 font-medium hover:bg-gray-100 transition-colors shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                        </button>
                     </form>
                </div>
            </div>

            {/* Navigation Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24 w-full md:w-auto">
                <div>
                    <h4 className="font-mono text-xs text-white/60 tracking-widest uppercase mb-6">Product</h4>
                    <ul className="space-y-4">
                        {[
                            { name: 'How it Works', path: '/how-it-works' },
                            { name: 'Features', path: '/features' },
                            { name: 'Why Arali', path: '/why-arali' },
                            { name: 'Get Started', path: '/get-started' }
                        ].map((item) => (
                            <li key={item.name}>
                                <Link to={item.path} className="text-white/40 hover:text-white transition-colors text-sm uppercase tracking-wide block hover:translate-x-1 duration-300">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-mono text-xs text-white/60 tracking-widest uppercase mb-6">Company</h4>
                    <ul className="space-y-4">
                        {[
                            { name: 'Our Story', path: '/story' },
                            { name: 'FAQ', path: '/faq' }
                        ].map((item) => (
                            <li key={item.name}>
                                <Link to={item.path} className="text-white/40 hover:text-white transition-colors text-sm uppercase tracking-wide block hover:translate-x-1 duration-300">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-mono text-xs text-white/60 tracking-widest uppercase mb-6">Connect</h4>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => handleSocialClick('twitter')}
                            className="p-2 rounded-full border border-white/10 hover:border-white hover:bg-white/10 text-white/40 hover:text-white transition-all"
                            aria-label="Twitter"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleSocialClick('linkedin')}
                            className="p-2 rounded-full border border-white/10 hover:border-white hover:bg-white/10 text-white/40 hover:text-white transition-all"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => window.open('https://www.instagram.com/arali.msk/', '_blank')}
                            className="p-2 rounded-full border border-white/10 hover:border-white hover:bg-white/10 text-white/40 hover:text-white transition-all"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleSocialClick('facebook')}
                            className="p-2 rounded-full border border-white/10 hover:border-white hover:bg-white/10 text-white/40 hover:text-white transition-all"
                            aria-label="Facebook"
                        >
                            <Facebook className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="border-t border-white/[0.05] pt-20 relative overflow-hidden">
            {/* Top Bar: Legal & Status */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-32 md:mb-40 px-6">
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase">
                        <span className="text-white/60">© {currentYear} MARESOLIK INC.</span>
                        <span className="w-px h-3 bg-white/10"></span>
                        <span>Global Retail Solutions</span>
                    </div>
                    <div className="flex gap-6 text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase">
                         <button onClick={() => alert('Privacy Policy - Coming Soon!')} className="hover:text-white transition-colors duration-300">Privacy</button>
                         <button onClick={() => alert('Terms of Service - Coming Soon!')} className="hover:text-white transition-colors duration-300">Terms</button>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm group cursor-default hover:bg-white/[0.05] transition-colors">
                    <div className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400/80 tracking-widest uppercase group-hover:text-emerald-400 transition-colors">All Systems Operational</span>
                 </div>
            </div>
            
            {/* Massive Brand Footer */}
            <div className="relative w-full flex justify-center">
                 <h1 className="text-[28vw] leading-[0.6] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/[0.02] to-transparent select-none pointer-events-none mix-blend-overlay blur-[1px] transform translate-y-12">
                    ARALI
                </h1>
                
                {/* The Monolith Watermark */}
                <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="group relative">
                        {/* Vertical tether line */}
                        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out delay-100"></div>

                        <div className="relative bg-[#0F4C81]/30 backdrop-blur-2xl rounded-[2rem] p-1 border border-white/[0.08] shadow-2xl shadow-black/50 transition-all duration-500 hover:border-white/[0.2] hover:bg-[#0F4C81]/40">
                             <div className="px-12 py-8 rounded-[1.8rem] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.02] flex flex-col items-center gap-4">
                                <span className="text-[9px] font-mono tracking-[0.5em] text-white/30 uppercase group-hover:text-emerald-400/60 transition-colors duration-500">
                                    Architected By
                                </span>
                                
                                <div className="relative">
                                    <span className="text-3xl md:text-5xl font-bold tracking-[0.25em] text-white uppercase drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                                        Maresolik
                                    </span>
                                    {/* Shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
                                </div>
                                
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="h-px w-8 bg-white/10 group-hover:w-12 transition-all duration-500"></div>
                                    <span className="text-[8px] font-mono tracking-[0.3em] text-white/20 uppercase">Digital Craftsmanship</span>
                                    <div className="h-px w-8 bg-white/10 group-hover:w-12 transition-all duration-500"></div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
}
