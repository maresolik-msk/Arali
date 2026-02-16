import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, ArrowRight, ChevronRight } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../ui/utils';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Scroll-aware header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const navLinks = [
    { name: 'How it Works', path: '/how-it-works' },
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Why Arali', path: '/why-arali' },
    { name: 'Story', path: '/story' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-500',
          scrolled
            ? 'bg-white/80 backdrop-blur-2xl shadow-[0_1px_3px_rgba(15,76,129,0.06)] border-b border-[#0F4C81]/5'
            : 'bg-[#F5F9FC]/70 backdrop-blur-xl border-b border-transparent'
        )}
      >
        <div className="container mx-auto px-6">
          <div className={cn(
            'flex items-center justify-between transition-all duration-500',
            scrolled ? 'h-16' : 'h-20'
          )}>
            {/* ── Logo ── */}
            <Link to="/" className="relative z-10 shrink-0 hover:opacity-80 transition-opacity">
              <Logo />
            </Link>

            {/* ── Desktop Navigation ── */}
            <nav className="hidden lg:flex items-center justify-center flex-1 px-8">
              <div className="flex items-center gap-1 bg-[#0F4C81]/[0.03] rounded-full px-2 py-1.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'relative px-4 py-2 text-[13px] font-medium rounded-full transition-all duration-300',
                      isActive(link.path)
                        ? 'text-[#0F4C81] bg-white shadow-sm shadow-[#0F4C81]/8'
                        : 'text-[#082032]/50 hover:text-[#0F4C81] hover:bg-white/60'
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </nav>

            {/* ── Desktop CTAs ── */}
            <div className="hidden lg:flex items-center gap-2.5 shrink-0">
              <Link to="/dashboard">
                <Button
                  variant="ghost"
                  className="h-10 px-5 text-[13px] font-medium text-[#082032]/60 hover:text-[#0F4C81] hover:bg-[#0F4C81]/5 rounded-full transition-all duration-300"
                >
                  Log in
                </Button>
              </Link>
              <Link to="/get-started">
                <Button
                  className={cn(
                    'h-10 px-6 text-[13px] font-semibold rounded-full transition-all duration-300',
                    'bg-[#0F4C81] hover:bg-[#0a3d6b] text-white',
                    'shadow-md shadow-[#0F4C81]/15 hover:shadow-lg hover:shadow-[#0F4C81]/25',
                    'hover:scale-[1.03] active:scale-[0.98]'
                  )}
                >
                  Get Started
                  <ArrowRight size={14} className="ml-1.5" />
                </Button>
              </Link>
            </div>

            {/* ── Mobile Menu Toggle ── */}
            <button
              className={cn(
                'lg:hidden relative z-10 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300',
                isOpen
                  ? 'bg-white/10 text-white'
                  : 'text-[#0F4C81] hover:bg-[#0F4C81]/5'
              )}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Full-screen Overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#082032]/95 backdrop-blur-2xl"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Content */}
            <div className="relative h-full flex flex-col pt-24 pb-10 px-8 overflow-y-auto">
              {/* Nav Links */}
              <nav className="flex-1 flex flex-col justify-center gap-1 -mt-10">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'group flex items-center justify-between py-4 px-2 border-b border-white/5 transition-all duration-300',
                        isActive(link.path)
                          ? 'text-white'
                          : 'text-white/40 hover:text-white/80'
                      )}
                    >
                      <span className="text-2xl font-medium tracking-tight">{link.name}</span>
                      <div className="flex items-center gap-2">
                        {isActive(link.path) && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                        <ChevronRight
                          size={18}
                          className="text-white/15 transition-all duration-300 group-hover:text-white/40 group-hover:translate-x-1"
                        />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="space-y-3 pt-8 border-t border-white/5"
              >
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block">
                  <Button
                    variant="outline"
                    className="w-full h-14 rounded-2xl text-base font-semibold border-white/15 text-white hover:bg-white/10 bg-transparent"
                  >
                    Log in
                  </Button>
                </Link>
                <Link to="/get-started" onClick={() => setIsOpen(false)} className="block">
                  <Button className="w-full h-14 rounded-2xl text-base font-semibold bg-white text-[#0F4C81] hover:bg-white/90 shadow-xl shadow-white/5 active:scale-[0.98] transition-all">
                    Get Started Free
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>

                <p className="text-center text-[11px] text-white/15 pt-2">
                  No credit card required
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
