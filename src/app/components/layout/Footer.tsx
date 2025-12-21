import React from 'react';
import { Link } from 'react-router-dom';
import { X, Linkedin, Instagram, Facebook } from 'lucide-react';
import { Logo } from '../brand/Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = React.useState('');

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Mock submission - in production, this would send to a backend
      alert(`Thank you for joining the waitlist! We'll reach out to ${email} soon.`);
      setEmail('');
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
    <footer className="relative bg-[#0F4C81] text-white pt-32 pb-12 overflow-hidden">
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
                            className="bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white transition-colors w-full md:w-auto min-w-[300px]"
                        />
                        <button 
                            type="submit"
                            className="bg-white text-[#0F4C81] rounded-full px-8 py-3 font-medium hover:bg-gray-100 transition-colors shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
                        >
                            Join Waitlist
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
                            <X className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleSocialClick('linkedin')}
                            className="p-2 rounded-full border border-white/10 hover:border-white hover:bg-white/10 text-white/40 hover:text-white transition-all"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleSocialClick('instagram')}
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

        {/* Massive Footer Text */}
        <div className="border-t border-white/10 pt-12 relative">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                 <div className="text-xs font-mono text-white/40 flex flex-col md:flex-row gap-4 md:gap-8">
                    <span>© {currentYear} ARALI INC.</span>
                    <button 
                        onClick={() => alert('Privacy Policy - Coming Soon! We respect your privacy and will update our policy here.')}
                        className="hover:text-white transition-colors text-left"
                     >
                        PRIVACY POLICY
                     </button>
                     <button 
                        onClick={() => alert('Terms of Service - Coming Soon! We are working on our terms and will update them here.')}
                        className="hover:text-white transition-colors text-left"
                     >
                        TERMS OF SERVICE
                     </button>
                 </div>
                 <div className="text-xs font-mono text-white/40 flex items-center gap-2">
                    SYSTEM STATUS: <span className="text-blue-200 animate-pulse">OPERATIONAL</span>
                 </div>
            </div>
            
            {/* Big Logo Text */}
            <h1 className="text-[18vw] leading-[0.8] font-bold tracking-tighter text-white/[0.03] select-none mt-10 text-center pointer-events-none">
                ARALI
            </h1>
        </div>
      </div>
    </footer>
  );
}