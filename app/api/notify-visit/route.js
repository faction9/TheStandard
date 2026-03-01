import { NextResponse } from 'next/server';
import { sendTelegramMessage, getSiteName } from '@/lib/telegram';

function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIp) return realIp.trim();
  return null;
}

async function getGeo(ip) {
  if (!ip || ip === '::1' || ip === '127.0.0.1') {
    return { city: 'Unknown', regionName: '', country: 'Unknown', timezone: 'UTC', isp: 'Unknown' };
  }
  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,city,regionName,country,timezone,isp`,
      { next: { revalidate: 0 } }
    );
    const data = await res.json();
    if (data.status !== 'success') return { city: 'Unknown', regionName: '', country: 'Unknown', timezone: 'UTC', isp: 'Unknown' };
    return {
      city: data.city || 'Unknown',
      regionName: data.regionName || '',
      country: data.country || 'Unknown',
      timezone: data.timezone || 'UTC',
      isp: data.isp || 'Unknown',
    };
  } catch {
    return { city: 'Unknown', regionName: '', country: 'Unknown', timezone: 'UTC', isp: 'Unknown' };
  }
}

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const geo = await getGeo(ip);
    const body = await request.json().catch(() => ({}));
    const { screen = 'Unknown', language = 'Unknown', referrer = 'Direct', url = '', localTime = '', utcTime = '' } = body;

    const location = [geo.city, geo.regionName, geo.country].filter(Boolean).join(', ') || 'Unknown';

    const message = [
      `🏷 Site: ${escapeHtml(getSiteName())}`,
      '',
      '🌐 <b>New Visitor</b>',
      '━━━━━━━━━━━━━━━━━━',
      `📍 Location: ${escapeHtml(location)}`,
      `🌍 IP: ${escapeHtml(ip || 'Unknown')}`,
      `⏰ Timezone: ${escapeHtml(geo.timezone)}`,
      `🌐 ISP: ${escapeHtml(geo.isp)}`,
      '',
      '',
      `📱 Device: ${escapeHtml(userAgent)}`,
      `🖥️ Screen: ${escapeHtml(screen)}`,
      `🌍 Language: ${escapeHtml(language)}`,
      `🔗 Referrer: ${escapeHtml(referrer)}`,
      `🌐 URL: ${escapeHtml(url)}`,
      '',
      `⏰ Local Time: ${escapeHtml(localTime)}`,
      `🕒 UTC Time: ${escapeHtml(utcTime)}`,
    ].join('\n');

    await sendTelegramMessage(message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('notify-visit:', err);
    return NextResponse.json({ error: 'Notification failed' }, { status: 503 });
  }
}

function escapeHtml(s) {
  if (typeof s !== 'string') return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
