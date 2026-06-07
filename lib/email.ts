import { Resend } from 'resend'

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

function confirmationHtml(confirmUrl: string): string {
  const bodyStyle =
    'background:#0a0f1e;color:#e2e8f0;font-family:system-ui,sans-serif;' +
    'max-width:520px;margin:0 auto;padding:48px 24px;'
  const labelStyle =
    'font-family:monospace;color:#1d6fd1;font-size:12px;' +
    'letter-spacing:0.1em;text-transform:uppercase;margin:0 0 16px;'
  const h1Style =
    'font-size:22px;font-weight:700;color:#cbd5e1;margin:0 0 16px;'
  const pStyle =
    'color:#64748b;font-size:15px;line-height:1.7;margin:0 0 28px;'
  const buttonStyle =
    'display:inline-block;background:#1d6fd1;color:#0a0f1e;font-weight:600;' +
    'font-size:15px;text-decoration:none;padding:12px 28px;border-radius:8px;'
  const finePrint =
    'color:#334155;font-size:12px;line-height:1.6;margin:32px 0 0;'

  return (
    '<!DOCTYPE html>\n<html>\n' +
    '<head><meta charset="utf-8"></head>\n' +
    `<body style="${bodyStyle}">\n` +
    `  <p style="${labelStyle}">AI NEWS · marco-tech.se</p>\n` +
    `  <h1 style="${h1Style}">Confirm your subscription</h1>\n` +
    `  <p style="${pStyle}">Click the button below to confirm and start ` +
    'receiving the daily AI newsletter every morning at 07:00 CET.</p>\n' +
    `  <a href="${confirmUrl}" style="${buttonStyle}">Confirm subscription</a>\n` +
    `  <p style="${finePrint}">If you didn&apos;t request this, you can ` +
    'safely ignore this email.</p>\n' +
    '</body>\n</html>'
  )
}

/** Send the double opt-in confirmation email to a pending subscriber. */
export async function sendConfirmationEmail(
  email: string,
  confirmToken: string
): Promise<void> {
  const confirmUrl = `${SITE_URL}/confirm?token=${confirmToken}`
  const { error } = await getResend().emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: email,
    subject: 'Confirm your AI News subscription',
    html: confirmationHtml(confirmUrl),
  })
  if (error) {
    throw new Error(`Resend error: ${error.message}`)
  }
}
