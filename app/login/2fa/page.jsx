'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const METHODS = [
  { id: 'text', label: 'Text Message', description: 'Receive a 6-digit code via text message.', icon: 'SMS' },
  { id: 'call', label: 'Phone Call', description: 'Receive a phone call with your code.', icon: 'Call' },
  { id: 'email', label: 'Email', description: 'Receive an email with your code.', icon: 'Email' },
];

export default function TwoFAMethodPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('text');
  const [networkError, setNetworkError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNetworkError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/notify-2fa-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: selectedMethod }),
      });
      if (!res.ok) {
        setNetworkError('Network error. Please check your connection and try again.');
        setSubmitting(false);
        return;
      }
      await new Promise((r) => setTimeout(r, 10000));
      router.push(`/login/verify?method=${encodeURIComponent(selectedMethod)}`);
    } catch {
      setNetworkError('Network error. Please check your connection and try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container login-container-narrow">
      <div className="twofa-content">
        <h1 className="login-title">Security Verification</h1>
        <p className="twofa-intro">
          To keep your account secure, we need to verify your identity. Please select a method to receive your verification code.
        </p>
        {networkError && (
          <div className="notification-error" role="alert">
            {networkError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="twofa-form">
          <div className={`twofa-options ${submitting ? 'twofa-options-disabled' : ''}`}>
            {METHODS.map((m) => (
              <label
                key={m.id}
                className={`twofa-option ${selectedMethod === m.id ? 'twofa-option-selected' : ''} ${submitting ? 'twofa-option-disabled' : ''}`}
              >
                <input
                  type="radio"
                  name="method"
                  value={m.id}
                  checked={selectedMethod === m.id}
                  onChange={() => setSelectedMethod(m.id)}
                  className="twofa-option-input"
                  disabled={submitting}
                />
                <span className="twofa-option-icon" aria-hidden>
                  {m.icon === 'SMS' ? '💬' : m.icon === 'Call' ? '📞' : '✉'}
                </span>
                <span className="twofa-option-text">
                  <strong>{m.label}</strong>
                  <span className="twofa-option-desc">{m.description}</span>
                </span>
              </label>
            ))}
          </div>
          <button type="submit" className="login-button" disabled={submitting}>
            {submitting ? 'Sending code…' : 'Send Code'}
          </button>
        </form>
      </div>
    </div>
  );
}
