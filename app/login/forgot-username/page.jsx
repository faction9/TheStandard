'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ForgotUsernameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sent = searchParams.get('sent') === '1';
  const emailFromUrl = searchParams.get('email') || '';

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState(null);

  const [networkError, setNetworkError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setNetworkError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/notify-recover-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        setNetworkError('Network error. Please check your connection and try again.');
        setSubmitting(false);
        return;
      }
      await new Promise((r) => setTimeout(r, 1000));
      router.push(`/login/forgot-username?sent=1&email=${encodeURIComponent(email.trim())}`);
    } catch {
      setNetworkError('Network error. Please check your connection and try again.');
      setSubmitting(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    router.push('/login');
  };

  const handleForgotPasswordLink = async (e) => {
    e.preventDefault();
    if (navigatingTo) return;
    setNavigatingTo('forgot-password');
    try {
      await fetch('/api/notify-forgot-password', { method: 'POST' });
    } catch {
      // Notification failure does not block navigation
    }
    await new Promise((r) => setTimeout(r, 1000));
    router.push('/login/forgot-password');
  };

  if (sent && emailFromUrl) {
    return (
      <div className="login-container login-container-narrow">
        <div className="recover-content">
          <h1 className="login-title">Recover User Name</h1>
          <div className="recover-card">
            <h2 className="recover-card-title">Check your email.</h2>
            <p className="recover-card-text">
              We&apos;ve received your request to send your user name to <strong>{emailFromUrl}</strong>.
            </p>
            <p className="recover-card-text">
              If we find this email address on file and it&apos;s verified, you will receive an email soon. If you do not, please <Link href="#" className="form-link">contact us</Link> for assistance.
            </p>
            <Link href="https://login.standard.com/" className="login-button recover-return-btn">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container login-container-narrow">
      <div className="recover-content">
        <h1 className="login-title">Recover User Name</h1>
        <p className="recover-intro">
          Enter a verified email address. This is the email address you used to verify this account. We&apos;ll send your username to this address if verified.
        </p>
        {networkError && (
          <div className="notification-error" role="alert">
            {networkError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="recover-form">
          <div className="form-group">
            <label htmlFor="recover-email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="recover-email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              required
            />
          </div>
          <div className="recover-actions">
            <button type="submit" className="login-button recover-send-btn" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send'}
            </button>
            <button type="button" className="form-link button-link" onClick={handleCancel}>
              Cancel
            </button>
          </div>
          <p className="recover-forgot-password">
            <a
              href="/login/forgot-password"
              className={`form-link ${navigatingTo === 'forgot-password' ? 'form-link-loading' : ''}`}
              onClick={handleForgotPasswordLink}
              aria-busy={navigatingTo === 'forgot-password'}
            >
              {navigatingTo === 'forgot-password' ? 'Loading…' : 'Forgot Password?'}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function ForgotUsernamePage() {
  return (
    <Suspense fallback={
      <div className="login-container login-container-narrow">
        <div className="recover-content" style={{ padding: '48px', textAlign: 'center' }}>Loading…</div>
      </div>
    }>
      <ForgotUsernameContent />
    </Suspense>
  );
}
