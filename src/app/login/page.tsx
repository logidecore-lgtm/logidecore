'use client';

import React, { useState } from 'react';
import { loginAction, registerAction, googleAuthAction, otpRequestAction, otpVerifyAction } from '@/app/actions/auth';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // States for OTP login flow
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleOtpRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setAuthError(null);
    const result = await otpRequestAction(phone);
    if ('error' in result && result.error) {
      setAuthError(result.error);
    } else {
      setOtpSent(true);
      setShowOtpInput(true);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;
    setAuthError(null);
        const result = await otpVerifyAction(phone, otpCode);
    if (result && 'error' in result && result.error) {
      setAuthError(result.error);
    }
  };

  const handleGoogleLogin = async () => {
    await googleAuthAction();
  };

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);
    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);
    if (result && 'error' in result && result.error) {
      setAuthError(result.error);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);
    const formData = new FormData(e.currentTarget);
    const result = await registerAction(formData);
    if (result && 'error' in result && result.error) {
      setAuthError(result.error);
    }
  };

  return (
    <main className="flex min-h-screen">
      {/* Left Side: Editorial Photography (Desktop Only) */}
      <section className="hidden lg:flex lg:w-1/2 relative bg-surface-container-high overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-black/10 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAxQ_F_tIBhZRhjosO8SJ2_6SSAkkRhxDJCz1UdZZk5jZ0lphULEud9lsaqaiIjJwNUDivVF3YgqXX2HmYEIS_UYfME01b1U2kExKIzt4McljPhPhUhWYZKjM7XYxGSqvngxyp0Pwxua5s_WhswnGjwCQ4fSQJEhX0g8ECdp9UcxwmkKIvITSSMUBzAt--aOOO3SSKT6WMrxDzxEE2gQVPsZ62EQtfaoKU5oVnFWoZo6W9ju-cUvVHB3MAZHwnHr02Uy0RN6cCCgOfh')`,
          }}
        ></div>
        <div className="relative z-20 mt-auto p-20 text-white">
          <h1 className="font-serif text-6xl mb-4 leading-tight">
            Curation <br /> Redefined.
          </h1>
          <p className="font-sans text-lg max-w-md opacity-80 leading-relaxed">
            Join our exclusive circle of collectors and home enthusiasts. Access limited editions and bespoke interior consultation.
          </p>
        </div>
      </section>

      {/* Right Side: Auth Forms */}
      <section className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 md:px-20 py-12 bg-background relative min-h-screen">
        {/* Branding Header */}
        <div className="absolute top-8 left-6 md:left-20">
          <span className="font-serif text-2xl font-medium tracking-tighter text-primary">
            Logidecore
          </span>
        </div>

        <div className="w-full max-w-[420px] transition-all duration-500">
          {/* Toggle State */}
          <div className="flex gap-8 mb-12 border-b border-outline-variant/30">
            <button
              className={`pb-4 font-sans text-xs uppercase tracking-widest transition-all border-b-2 font-bold ${
                mode === 'login'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant'
              }`}
              onClick={() => {
                setMode('login');
                setShowOtpInput(false);
                setOtpSent(false);
                setPhone('');
                setAuthError(null);
              }}
            >
              Login
            </button>
            <button
              className={`pb-4 font-sans text-xs uppercase tracking-widest transition-all border-b-2 font-bold ${
                mode === 'register'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant'
              }`}
              onClick={() => {
                setMode('register');
                setShowOtpInput(false);
                setOtpSent(false);
                setPhone('');
                setAuthError(null);
              }}
            >
              Register
            </button>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-semibold uppercase tracking-wider">
              {authError}
            </div>
          )}

          {/* OTP Login Form */}
          {showOtpInput ? (
            <div className="space-y-8">
              <header>
                <h2 className="font-serif text-2xl mb-2">Verify OTP</h2>
                <p className="font-sans text-sm text-on-surface-variant">
                  We sent a code to your phone. (Use '123456' for simulation test)
                </p>
              </header>

              <form onSubmit={handleOtpVerify} className="space-y-6">
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                    One-Time Password
                  </label>
                  <input
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                    placeholder="123456"
                    type="text"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-primary text-white font-sans text-xs uppercase tracking-[0.2em] hover:bg-primary/95 transition-all border border-transparent hover:border-secondary flex items-center justify-center gap-2 font-bold"
                >
                  Verify & Sign In
                  <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
                </button>
              </form>
            </div>
          ) : mode === 'login' ? (
            /* Login Form Content */
            <div className="space-y-8">
              <header>
                <h2 className="font-serif text-2xl mb-2">Welcome Back</h2>
                <p className="font-sans text-sm text-on-surface-variant">
                  Enter your credentials to access your studio.
                </p>
              </header>

              {/* Social Logins */}
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 py-4 border border-outline-variant/50 hover:bg-surface-container-low transition-colors duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    ></path>
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    ></path>
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    ></path>
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    ></path>
                  </svg>
                  <span className="font-sans text-xs uppercase tracking-widest font-bold">
                    Continue with Google
                  </span>
                </button>

                {/* OTP flow request button */}
                <div className="flex gap-2">
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    placeholder="Enter phone for OTP"
                    className="flex-grow border-b border-primary bg-transparent px-2 py-1 text-xs focus:outline-none"
                  />
                  <button
                    onClick={handleOtpRequest}
                    className="flex items-center justify-center gap-2 py-3 px-4 border border-outline-variant/50 hover:bg-surface-container-low transition-colors duration-300 text-xs uppercase tracking-wider font-bold"
                  >
                    Phone OTP Login
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center py-2">
                <div className="w-full border-t border-outline-variant/30"></div>
                <span className="absolute bg-background px-4 font-sans text-xs text-on-surface-variant uppercase tracking-[0.2em] font-semibold">
                  Or
                </span>
              </div>

              {/* Email Login Form */}
              <form onSubmit={handleEmailLogin} className="space-y-6">
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                    Email Address
                  </label>
                  <input
                    name="email"
                    className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                    placeholder="name@domain.com"
                    type="email"
                    required
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      Password
                    </label>
                    <a href="#" className="text-[10px] uppercase tracking-widest text-secondary hover:underline transition-all font-bold">
                      Forgot?
                    </a>
                  </div>
                  <input
                    name="password"
                    className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                    placeholder="••••••••"
                    type="password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-primary text-white font-sans text-xs uppercase tracking-[0.2em] hover:bg-primary/95 transition-all border border-transparent hover:border-secondary flex items-center justify-center gap-2 font-bold"
                >
                  Sign In
                  <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
                </button>
              </form>
            </div>
          ) : (
            /* Register Form Content */
            <div className="space-y-8">
              <header>
                <h2 className="font-serif text-2xl mb-2">Create Account</h2>
                <p className="font-sans text-sm text-on-surface-variant">
                  Join our studio. Access premium features and customization tools.
                </p>
              </header>

              <form onSubmit={handleEmailRegister} className="space-y-6">
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                    Full Name
                  </label>
                  <input
                    name="name"
                    className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                    placeholder="Your Name"
                    type="text"
                    required
                  />
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                    Email Address
                  </label>
                  <input
                    name="email"
                    className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                    placeholder="name@domain.com"
                    type="email"
                    required
                  />
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                    Phone Number (Optional)
                  </label>
                  <input
                    name="phone"
                    className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                    placeholder="+91-99999-99999"
                    type="tel"
                  />
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                    Password
                  </label>
                  <input
                    name="password"
                    className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                    placeholder="••••••••"
                    type="password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-primary text-white font-sans text-xs uppercase tracking-[0.2em] hover:bg-primary/95 transition-all border border-transparent hover:border-secondary flex items-center justify-center gap-2 font-bold"
                >
                  Create Account
                  <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
