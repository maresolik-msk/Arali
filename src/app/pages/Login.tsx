import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { KeyRound, Mail, Lock, User } from 'lucide-react';
import svgPaths from "../../imports/svg-ga16o7ulxf";
import { cn } from '../components/ui/utils';
import { motion, AnimatePresence } from 'motion/react';

function MdiLightEmail() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="mdi-light:email">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="mdi-light:email">
          <path d={svgPaths.p22cfae00} fill="#062844" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function MaterialSymbolsLightLock() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="material-symbols-light:lock">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="material-symbols-light:lock">
          <path d={svgPaths.p5970600} fill="#082B48" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function BasilEyeSolid({ className, onClick }: { className?: string, onClick?: () => void }) {
  return (
    <div className={cn("relative shrink-0 size-[24px] cursor-pointer", className)} onClick={onClick} data-name="basil:eye-solid">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="basil:eye-solid">
          <path d={svgPaths.p86e1070} fill="#766F71" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p3fb81550} fill="#766F71" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function LsiconRightOutline() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="lsicon:right-outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="lsicon:right-outline">
          <path d="M9 6.75L14.25 12L9 17.25" id="Vector" stroke="white" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="h-[53.963px] relative shrink-0 w-[62.21px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 62.2099 53.9629">
        <g id="Group 42">
          <path d={svgPaths.p270b3880} fill="white" id="Vector" />
          <path d={svgPaths.p19496a80} fill="white" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const { signIn, signUp, requestPasswordResetOTP, verifyOTPAndResetPassword } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot Password State
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isOTPVerifyOpen, setIsOTPVerifyOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (isSignUp && !formData.name) {
      toast.error('Please enter your name');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.name);
      } else {
        await signIn(formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Authentication error:', error);
      const errorMessage = error.message || 'Authentication failed';
      
      if (errorMessage.includes('Invalid login credentials')) {
        toast.error('Invalid email or password.', {
          description: 'Please check your credentials and try again.'
        });
      } else if (errorMessage.includes('already exists')) {
        toast.error('An account with this email already exists. Please sign in instead.');
        setIsSignUp(false);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error('Please enter your email');
      return;
    }
    setIsLoading(true);
    try {
      await requestPasswordResetOTP(resetEmail);
      toast.success('Password reset code sent!');
      setIsForgotPasswordOpen(false);
      setIsOTPVerifyOpen(true);
    } catch (error: any) {
      toast.error(error.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTPAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      await verifyOTPAndResetPassword(resetEmail, otp, newPassword);
      toast.success('Password reset successful!');
      setIsOTPVerifyOpen(false);
      setResetEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative size-full min-h-screen bg-[#061B2E]" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 393 852\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><rect x=\\\'0\\\' y=\\\'0\\\' height=\\\'100%\\\' width=\\\'100%\\\' fill=\\\'url(%23grad)\\\' opacity=\\\'1\\\'/><defs><radialGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' cx=\\\'0\\\' cy=\\\'0\\\' r=\\\'10\\\' gradientTransform=\\\'matrix(1.5 97 -28.933 0.44742 197 189)\\\'><stop stop-color=\\\'rgba(16,76,129,1)\\\' offset=\\\'0\\\'/><stop stop-color=\\\'rgba(10,46,78,1)\\\' offset=\\\'0.5\\\'/><stop stop-color=\\\'rgba(7,31,53,1)\\\' offset=\\\'0.75\\\'/><stop stop-color=\\\'rgba(3,16,27,1)\\\' offset=\\\'1\\\'/></radialGradient></defs></svg>')" }}>
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 flex items-center gap-1 text-white/60 hover:text-white transition-colors"
      >
        <div className="rotate-180 transform scale-75">
          <LsiconRightOutline />
        </div>
        <span className="font-sans text-[14px] font-medium">Back</span>
      </button>

      {/* Logo Section */}
      <div className="absolute top-[101px] left-1/2 -translate-x-1/2 w-[197px] flex flex-col items-center gap-[8px]">
        <div className="flex gap-[12px] items-center justify-center w-full">
          <Group />
          <p className="font-sans leading-[normal] text-[54px] text-center text-white">Arali</p>
        </div>
        <p className="font-sans text-[14px] leading-[1.5] text-[rgba(255,255,255,0.56)] tracking-[2.1px] text-center w-full whitespace-pre-wrap">
          Save little, Save more
        </p>
      </div>

      {/* Main Card */}
      <div className="absolute top-[235px] left-1/2 -translate-x-1/2 w-[360px] bg-[rgba(255,255,255,0.9)] backdrop-blur-md rounded-[12px] p-[24px] flex flex-col gap-[18px]">
        <p className="font-sans text-[24px] leading-[1.5] text-[#0b2a45]">
          {isSignUp ? 'Create Account' : 'Welcome back'}
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-[24px] w-full">
          <div className="flex flex-col gap-[8px] w-full">
            <div className="flex flex-col gap-[16px] w-full">
              
              {/* Name Input (Sign Up only) */}
              <AnimatePresence>
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative rounded-[8px] w-full"
                  >
                    <div aria-hidden="true" className="absolute border-[0.6px] border-[rgba(0,0,0,0.5)] inset-0 pointer-events-none rounded-[8px]" />
                    <div className="flex items-center p-[12px] gap-[6px]">
                       <User className="size-[24px] text-[#062844]" />
                       <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-transparent border-none outline-none text-[14px] text-[#000000] placeholder-[rgba(0,0,0,0.5)] font-sans"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Input */}
              <div className="relative rounded-[8px] w-full">
                <div aria-hidden="true" className="absolute border-[0.6px] border-[rgba(0,0,0,0.5)] inset-0 pointer-events-none rounded-[8px]" />
                <div className="flex items-center p-[12px] gap-[6px]">
                  <MdiLightEmail />
                  <input
                    type="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-none outline-none text-[14px] text-[#000000] placeholder-[rgba(0,0,0,0.5)] font-sans"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative rounded-[8px] w-full">
                <div aria-hidden="true" className="absolute border-[0.6px] border-[rgba(0,0,0,0.5)] inset-0 pointer-events-none rounded-[8px]" />
                <div className="flex items-center justify-between p-[12px] w-full">
                  <div className="flex items-center gap-[6px] w-full">
                    <MaterialSymbolsLightLock />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-transparent border-none outline-none text-[14px] text-[#000000] placeholder-[rgba(0,0,0,0.5)] font-sans"
                    />
                  </div>
                  <BasilEyeSolid className="cursor-pointer hover:opacity-70 transition-opacity" onClick={() => setShowPassword(!showPassword)} />
                </div>
              </div>
            </div>

            {/* Helper Text and Forgot Password */}
            <div className="flex items-center justify-between text-[12px] text-[#104f86] w-full">
              <p className="font-sans">At least 6 characters</p>
              {!isSignUp && (
                <button type="button" onClick={() => setIsForgotPasswordOpen(true)} className="font-medium underline hover:text-[#0b355a]">
                  Forgot Password?
                </button>
              )}
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#0f4c81] h-[54px] rounded-[8px] w-full flex items-center justify-center hover:bg-[#0b355a] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-[10px] px-[16px]">
              <span className="font-sans font-medium text-[16px] text-white">
                {isLoading ? 'Processing...' : (isSignUp ? 'Register' : 'Sign in')}
              </span>
              {!isLoading && <LsiconRightOutline />}
            </div>
          </button>

          {/* Toggle Link */}
          <div className="flex flex-col items-center gap-[8px] w-full text-center">
            <p className="font-sans text-[14px] text-black">
              {isSignUp ? 'Already have an account?' : 'Don’t have an account?'}
            </p>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-sans font-medium text-[16px] text-[#0b355a] underline hover:text-[#0f4c81]"
            >
              {isSignUp ? 'Sign in' : 'Register'}
            </button>
          </div>
        </form>
      </div>

      {/* Forgot Password Dialogs */}
      <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white border border-[#0F4C81]/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#0F4C81] flex items-center gap-2">
              <KeyRound className="w-5 h-5" />
              Forgot Password
            </DialogTitle>
            <DialogDescription>
              Enter your email address to receive a 6-digit password reset code.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsForgotPasswordOpen(false)}>Cancel</Button>
              <Button type="submit" className="flex-1 bg-[#0F4C81]" disabled={isLoading}>Send Code</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isOTPVerifyOpen} onOpenChange={setIsOTPVerifyOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white border border-[#0F4C81]/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#0F4C81] flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Reset Password
            </DialogTitle>
            <DialogDescription>
              Enter the 6-digit code sent to {resetEmail}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleVerifyOTPAndReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPass">New Password</Label>
              <Input id="newPass" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="•��••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPass">Confirm Password</Label>
              <Input id="confirmPass" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsOTPVerifyOpen(false)}>Cancel</Button>
              <Button type="submit" className="flex-1 bg-[#0F4C81]" disabled={isLoading}>Reset Password</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
