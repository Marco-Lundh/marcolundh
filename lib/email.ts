import { Resend } from 'resend'
import type { Language } from '@/lib/translations'

/** Lazily created Resend client — importing this module never throws. */
let client: Resend | null = null

function getResend(): Resend {
  if (client) return client
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY must be set')
  }
  client = new Resend(apiKey)
  return client
}

export const FROM_EMAIL = 'newsletter@marco-tech.se'
export const FROM_NAME = 'Marco Lundh'

/** Base URL for building confirmation and unsubscribe links. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://marco-tech.se'

const confirmationCopy: Record<
  Language,
  { subject: string; heading: string; body: string; button: string; fine: string }
> = {
  en: {
    subject: 'Confirm your AI News subscription',
    heading: 'Confirm your subscription',
    body:
      'Click the button below to confirm and start receiving the daily AI ' +
      'newsletter every morning at 07:00 CET.',
    button: 'Confirm subscription',
    fine: "If you didn't request this, you can safely ignore this email.",
  },
  sv: {
    subject: 'Bekräfta din prenumeration på AI News',
    heading: 'Bekräfta din prenumeration',
    body:
      'Klicka på knappen nedan för att bekräfta och börja få det dagliga ' +
      'AI-nyhetsbrevet varje morgon kl 07:00 CET.',
    button: 'Bekräfta prenumeration',
    fine: 'Om du inte begärde detta kan du ignorera det här mejlet.',
  },
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function confirmationHtml(confirmUrl: string, language: Language): string {
  const copy = confirmationCopy[language]
  const bodyStyle =
    'background:#ffffff;color:#1e293b;font-family:system-ui,sans-serif;' +
    'max-width:520px;margin:0 auto;padding:48px 24px;'
  const labelStyle =
    'font-family:monospace;color:#1d6fd1;font-size:12px;' +
    'letter-spacing:0.1em;text-transform:uppercase;margin:0 0 16px;'
  const h1Style =
    'font-size:22px;font-weight:700;color:#0f172a;margin:0 0 16px;'
  const pStyle =
    'color:#475569;font-size:15px;line-height:1.7;margin:0 0 28px;'
  const buttonStyle =
    'display:inline-block;background:#1d6fd1;color:#ffffff;font-weight:600;' +
    'font-size:15px;text-decoration:none;padding:12px 28px;border-radius:8px;'
  const finePrint =
    'color:#94a3b8;font-size:12px;line-height:1.6;margin:32px 0 0;'

  return (
    '<!DOCTYPE html>\n<html>\n' +
    '<head><meta charset="utf-8"></head>\n' +
    `<body style="${bodyStyle}">\n` +
    `  <p style="${labelStyle}">AI NEWS · marco-tech.se</p>\n` +
    `  <h1 style="${h1Style}">${escapeHtml(copy.heading)}</h1>\n` +
    `  <p style="${pStyle}">${escapeHtml(copy.body)}</p>\n` +
    `  <a href="${escapeHtml(confirmUrl)}" style="${buttonStyle}">` +
    `${escapeHtml(copy.button)}</a>\n` +
    `  <p style="${finePrint}">${escapeHtml(copy.fine)}</p>\n` +
    '</body>\n</html>'
  )
}

/** Send the double opt-in confirmation email to a pending subscriber. */
export async function sendConfirmationEmail(
  email: string,
  confirmToken: string,
  language: Language = 'en'
): Promise<void> {
  const confirmUrl = `${SITE_URL}/confirm?token=${confirmToken}`
  const copy = confirmationCopy[language]
  const { error } = await getResend().emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: email,
    subject: copy.subject,
    html: confirmationHtml(confirmUrl, language),
  })
  if (error) {
    throw new Error(`Resend error: ${error.message}`)
  }
}
