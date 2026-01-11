import React from 'react';
import { Link } from 'react-router-dom';
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
                     <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 mt-8 max-w-md relative group">
                        <div className="relative flex-grow">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isSubmitting}
                                className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-white/30 rounded-lg px-6 py-4 text-white placeholder:text-white/20 outline-none backdrop-blur-md transition-all duration-300 disabled:opacity-50 font-mono text-sm tracking-wide"
                            />
                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 rounded-tl-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 rounded-br-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-white text-[#0F4C81] border border-white rounded-lg px-8 py-4 font-semibold hover:bg-transparent hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.5)] whitespace-nowrap"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-1 h-1 bg-[#0F4C81] rounded-full animate-bounce"></span>
                                    <span className="w-1 h-1 bg-[#0F4C81] rounded-full animate-bounce delay-100"></span>
                                    <span className="w-1 h-1 bg-[#0F4C81] rounded-full animate-bounce delay-200"></span>
                                </span>
                            ) : (
                                'Join Waitlist'
                            )}
                        </button>
                     </form>

                     {/* Download Buttons */}
                     <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleInstallClick('ios')}
                          className="group relative bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 rounded-xl px-6 py-3 transition-all duration-300 backdrop-blur-md"
                        >
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-white" />
                            <div className="text-left">
                              <div className="text-[9px] font-mono text-white/40 uppercase tracking-wider">Download on the</div>
                              <div className="text-sm font-semibold text-white">App Store</div>
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleInstallClick('android')}
                          className="group relative bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 rounded-xl px-6 py-3 transition-all duration-300 backdrop-blur-md"
                        >
                          <div className="flex items-center gap-3">
                            <Download className="w-5 h-5 text-white" />
                            <div className="text-left">
                              <div className="text-[9px] font-mono text-white/40 uppercase tracking-wider">Get it on</div>
                              <div className="text-sm font-semibold text-white">Google Play</div>
                            </div>
                          </div>
                        </button>
                     </div>
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
                        <span className="text-white/60">© {currentYear} ARALI.</span>
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
                                    Product By
                                </span>
                                
                                <div className="relative">
                                    <span className="text-3xl md:text-5xl font-bold tracking-[0.25em] text-white uppercase drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] text-justify">
                                        Maresolik
                                    </span>
                                    {/* Shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
                                </div>
                                
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="h-px w-8 bg-white/10 group-hover:w-12 transition-all duration-500"></div>
                                    <span className="text-[8px] font-mono tracking-[0.3em] text-white/20 uppercase">Resource Management </span>
                                    <div className="h-px w-8 bg-white/10 group-hover:w-12 transition-all duration-500"></div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Install Modal */}
      {showInstallModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleInstallModalClose}
        >
          <div 
            className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-[#0F4C81] to-[#082032] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Install Arali App</h3>
                    <p className="text-xs text-white/60 font-mono uppercase tracking-wide">Progressive Web App</p>
                  </div>
                </div>
                <button
                  onClick={handleInstallModalClose}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  <XIcon className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {selectedPlatform === 'ios' ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Install on iPhone/iPad</h4>
                        <ol className="space-y-2 text-sm text-blue-800">
                          <li className="flex items-start gap-2">
                            <span className="font-mono text-xs bg-blue-200 rounded px-1.5 py-0.5 mt-0.5">1</span>
                            <span>Open this page in <strong>Safari</strong> browser</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-mono text-xs bg-blue-200 rounded px-1.5 py-0.5 mt-0.5">2</span>
                            <span>Tap the <strong>Share button</strong> (□ with ↑)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-mono text-xs bg-blue-200 rounded px-1.5 py-0.5 mt-0.5">3</span>
                            <span>Scroll and tap <strong>"Add to Home Screen"</strong></span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-mono text-xs bg-blue-200 rounded px-1.5 py-0.5 mt-0.5">4</span>
                            <span>Tap <strong>"Add"</strong> to install</span>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    App works offline • Full-screen experience • No App Store required
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Download className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900 mb-2">Install on Android</h4>
                        <ol className="space-y-2 text-sm text-green-800">
                          <li className="flex items-start gap-2">
                            <span className="font-mono text-xs bg-green-200 rounded px-1.5 py-0.5 mt-0.5">1</span>
                            <span>Open this page in <strong>Chrome</strong> browser</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-mono text-xs bg-green-200 rounded px-1.5 py-0.5 mt-0.5">2</span>
                            <span>Wait 30 seconds for install prompt, or</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-mono text-xs bg-green-200 rounded px-1.5 py-0.5 mt-0.5">3</span>
                            <span>Tap <strong>Menu (⋮)</strong> → <strong>"Install app"</strong></span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-mono text-xs bg-green-200 rounded px-1.5 py-0.5 mt-0.5">4</span>
                            <span>Tap <strong>"Install"</strong> to add to home screen</span>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    App works offline • Native experience • No Google Play required
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleInstallModalClose}
                  className="flex-1 bg-gradient-to-br from-[#0F4C81] to-[#082032] text-white rounded-xl py-3 px-6 font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Got it!
                </button>
                <button
                  onClick={() => setSelectedPlatform(selectedPlatform === 'ios' ? 'android' : 'ios')}
                  className="px-6 py-3 border-2 border-gray-200 hover:border-[#0F4C81] rounded-xl text-gray-700 hover:text-[#0F4C81] font-semibold transition-all duration-300"
                >
                  {selectedPlatform === 'ios' ? 'Android' : 'iOS'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}