const SITE_NAME = process.env.SITE_NAME || 'The Standard';

/**
 * Send a message to all Telegram chat IDs in TELEGRAM_CHAT_ID (comma-separated).
 * @param {string} text - Message text (supports Markdown/HTML if parse_mode is set)
 * @returns {Promise<boolean>} - true if all sends succeeded
 * @throws {Error} - If token/chat IDs missing or all sends fail
 */
export async function sendTelegramMessage(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIdsRaw = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatIdsRaw?.trim()) {
    throw new Error('TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set');
  }

  const chatIds = chatIdsRaw
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  if (chatIds.length === 0) {
    throw new Error('TELEGRAM_CHAT_ID must contain at least one chat ID');
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const results = await Promise.allSettled(
    chatIds.map((chatId) =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }).then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.ok !== true) throw new Error(data.description || res.statusText);
        return data;
      })
    )
  );

  const failed = results
    .map((r, i) => (r.status === 'rejected' ? chatIds[i] : null))
    .filter(Boolean);
  if (failed.length > 0) {
    throw new Error(`Telegram send failed for chat(s): ${failed.join(', ')}`);
  }

  return true;
}

export function getSiteName() {
  return SITE_NAME;
}
