'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authenticateOtpBodySchema } from "@/shared/schemas/auth-schemas";
import { KeyRound, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  // State management to control the workflow (email step vs otp step)
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Handles the email submission and triggers the OTP interface transition
  const handleSendOtp = () => {
    setError(null);

    // Partial validation using Zod schema for the email step
    const result = authenticateOtpBodySchema.safeParse({ email, otpCode: "123456" });
    
    if (!result.success) {
      const formattedError = result.error.format();
      setError(formattedError.email?._errors[0] || "Invalid email address");
      return;
    }

    // Moves smoothly to the second step of passwordless authentication
    setStep('otp');
  };

  // Handles the final OTP validation and forces cookie injection for routing
  const handleVerifyOtp = () => {
    setError(null);

    // Full validation against our Zod contract schema
    const result = authenticateOtpBodySchema.safeParse({ email, otpCode });

    if (!result.success) {
      const formattedError = result.error.format();
      setError(formattedError.otpCode?._errors[0] || "Invalid OTP Code");
      return;
    }

    // Checking against the standard development mock code
    if (otpCode === '123456') {
      // Explicitly sets the cookie with path and max-age for instant proxy recognition
      document.cookie = "@ProjectHealth:token=mock-jwt-token-from-auth-flow; path=/; max-age=86400; SameSite=Lax";
      
      // Forces a hard refresh and routing to bypass any sticky proxy middleware state
      window.location.href = '/dashboard';
    } else {
      setError("Incorrect OTP code. Please use the '123456' mock code.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50/50 p-4">
      <Card className="w-full max-w-md rounded-2xl border-slate-100 shadow-xl bg-white">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-slate-950 flex items-center justify-center mb-2">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            {step === 'email' ? 'Welcome Back' : 'Security Check'}
          </CardTitle>
          <CardDescription>
            {step === 'email' 
              ? 'Enter your professional email to receive your access token.' 
              : 'Type the 6-digit security code sent to your inbox.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-xs font-medium text-red-600 border border-red-100">
              {error}
            </div>
          )}

          {step === 'email' ? (
            /* Step 1: Email Request Interface (No native form tag to prevent reload) */
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="name@health.com"
                  className="pl-10 h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full h-11 bg-slate-950 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-850 transition-colors"
              >
                Send Access Code
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* Step 2: OTP Verification Interface */
            <div className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  className="pl-10 h-11 tracking-[0.5em] font-mono text-center text-lg"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full h-11 bg-emerald-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
              >
                Verify Code & Login
              </button>
              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 transition-colors mt-2"
              >
                Change email address
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}