import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../ui/utils';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'How it Works', path: '/how-it-works' },
    { name: 'Features', path: '/features' },
    { name: 'Why Arali', path: '/why-arali' },
    { name: 'Story', path: '/story' },
    { name: 'FAQ', path: '/faq' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F5F9FC]/90 backdrop-blur-xl border-b border-[#0F4C81]/10 transition-all duration-300">
      <div className="container mx-auto px-6 h-24 flex items-center justify-between relative">
        
        {/* Desktop Nav - Left Aligned */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-start">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[#0F4C81] relative group",
                isActive(link.path) ? "text-[#0F4C81]" : "text-[#082032]/60"
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-1 left-0 w-full h-[1px] bg-[#0F4C81] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                isActive(link.path) && "scale-x-100"
              )} />
            </Link>
          ))}
        </nav>

        {/* Logo - Perfectly Centered */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link to="/" className="hover:opacity-90 transition-opacity block">
            <Logo />
          </Link>
        </div>

        {/* Desktop CTA & Mobile Menu Toggle - Right Aligned */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="hidden md:flex items-center gap-3">
            <Link to="/dashboard">
              <Button 
                variant="outline"
                className="h-11 px-6 border-[#0F4C81]/20 text-[#0F4C81] hover:bg-[#0F4C81]/5 rounded-full transition-all duration-300"
              >
                Login
              </Button>
            </Link>
            <Link to="/get-started">
              <Button 
                className="h-11 px-8 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-[#F5F9FC] text-sm font-medium rounded-full shadow-lg shadow-[#0F4C81]/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#0F4C81]/20"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-[#0F4C81] p-2 hover:bg-[#0F4C81]/5 rounded-full transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-[#0F4C81]/10 bg-[#F5F9FC]"
          >
            <nav className="flex flex-col p-6 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "group flex items-center justify-between p-4 rounded-2xl transition-all duration-300",
                    isActive(link.path) 
                      ? "bg-white text-[#0F4C81] shadow-lg shadow-[#0F4C81]/5 translate-x-2" 
                      : "text-[#082032]/60 hover:bg-white/60 hover:text-[#0F4C81] hover:translate-x-1"
                  )}
                >
                  <span className="text-xl font-medium tracking-tight">{link.name}</span>
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full bg-[#0F4C81] transition-all duration-300",
                    isActive(link.path) ? "opacity-100 scale-100" : "opacity-0 scale-0 group-hover:opacity-50 group-hover:scale-100"
                  )} />
                </Link>
              ))}
              <div className="pt-8 mt-2 border-t border-[#0F4C81]/5 w-full space-y-3">
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block">
                  <Button 
                    variant="outline"
                    className="w-full h-14 border-[#0F4C81]/20 text-[#0F4C81] hover:bg-[#0F4C81]/5 rounded-[44px] text-lg font-semibold"
                  >
                    Login / Signup
                  </Button>
                </Link>
                <Link to="/get-started" onClick={() => setIsOpen(false)} className="block">
                  <Button className="w-full h-14 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-[44px] text-lg font-semibold shadow-xl shadow-[#0F4C81]/20 active:scale-[0.98] transition-all">
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}