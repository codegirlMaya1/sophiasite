// netlify/functions/support.js
const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const {
    SMTP_HOST = 'smtp.office365.com',
    SMTP_PORT = '587',
    SMTP_USER,
    SMTP_PASS,
    SUPPORT_TO = 'support@tiertechtools.com',
    SUPPORT_FROM
  } = process.env;

  if (!SMTP_USER || !SMTP_PASS) {
    return { statusCode: 500, body: 'Server email is not configured (SMTP_USER/SMTP_PASS missing).' };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const {
      reasons = [],
      followups = [],
      message = '',
      email = '',
      name = '',
      site = '',
      when = new Date().toISOString()
    } = data || {};

    if (!email || !message) {
      return { statusCode: 400, body: 'email and message are required' };
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: false, // STARTTLS (587)
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      tls: { ciphers: 'TLSv1.2' }
    });

    const subject = 'Website chat — ' + (Array.isArray(reasons) && reasons.length ? reasons.join(', ') : 'Inquiry');
    const html = `
      <h2>Website chat submission</h2>
      <p><b>From:</b> ${escapeHtml(name || '—')} &lt;${escapeHtml(email)}&gt;</p>
      <p><b>Site:</b> ${escapeHtml(site)}</p>
      <p><b>When:</b> ${escapeHtml(when)}</p>
      <p><b>Reasons:</b> ${escapeHtml((reasons || []).join(', ') || '—')}</p>
      <p><b>Details:</b> ${escapeHtml((followups || []).join(', ') || '—')}</p>
      <p><b>Message:</b></p>
      <pre style="white-space:pre-wrap;font-family:ui-monospace,Menlo,Consolas,monospace">${escapeHtml(message)}</pre>
    `;

    await transporter.sendMail({
      to: SUPPORT_TO,
      from: SUPPORT_FROM || SMTP_USER,
      replyTo: email,
      subject,
      html
    });

    return { statusCode: 200, body: 'ok' };
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? e.message : 'Server error';
    return { statusCode: 500, body: String(msg) };
  }
};

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
