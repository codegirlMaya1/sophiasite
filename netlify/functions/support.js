// netlify/functions/support.js
const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: 'ok' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' };
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
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: 'Server email is not configured (SMTP_USER/SMTP_PASS missing).'
    };
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
      return { statusCode: 400, headers: corsHeaders, body: 'email and message are required' };
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: false, // STARTTLS on 587
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
      from: SUPPORT_FROM || SMTP_USER, // safest with M365
      replyTo: email,
      subject,
      html
    });

    return { statusCode: 200, headers: corsHeaders, body: 'ok' };
  } catch (e) {
    // Expose a more helpful message back to the client
    const detail =
      (e && typeof e === 'object' && e.response && String(e.response)) ||
      (e && typeof e === 'object' && 'message' in e && e.message) ||
      'Server error';
    console.error('SMTP send error:', e);
    return { statusCode: 500, headers: corsHeaders, body: detail };
  }
};

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
