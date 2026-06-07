import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const sendMock = vi.hoisted(() => vi.fn())

vi.mock('resend', () => ({
  Resend: vi.fn(() => ({ emails: { send: sendMock } })),
}))

describe('sendConfirmationEmail', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.resetModules()
    sendMock.mockReset()
    delete process.env.RESEND_API_KEY
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('throws when RESEND_API_KEY is missing', async () => {
    const { sendConfirmationEmail } = await import('./email')
    await expect(sendConfirmationEmail('a@b.com', 'tok')).rejects.toThrow(
      /RESEND_API_KEY/
    )
  })

  it('sends an English confirmation email containing the confirm link', async () => {
    process.env.RESEND_API_KEY = 'rk'
    sendMock.mockResolvedValue({ error: null })
    const { sendConfirmationEmail } = await import('./email')

    await sendConfirmationEmail('user@example.com', 'tok123', 'en')

    expect(sendMock).toHaveBeenCalledOnce()
    const payload = sendMock.mock.calls[0][0]
    expect(payload.to).toBe('user@example.com')
    expect(payload.subject).toMatch(/confirm/i)
    expect(payload.html).toContain('/confirm?token=tok123')
    expect(payload.html).toContain('Confirm your subscription')
  })

  it('sends a Swedish confirmation email when language is sv', async () => {
    process.env.RESEND_API_KEY = 'rk'
    sendMock.mockResolvedValue({ error: null })
    const { sendConfirmationEmail } = await import('./email')

    await sendConfirmationEmail('user@example.com', 'tok123', 'sv')

    const payload = sendMock.mock.calls[0][0]
    expect(payload.subject).toMatch(/Bekräfta/)
    expect(payload.html).toContain('Bekräfta din prenumeration')
  })

  it('defaults to English when no language is given', async () => {
    process.env.RESEND_API_KEY = 'rk'
    sendMock.mockResolvedValue({ error: null })
    const { sendConfirmationEmail } = await import('./email')

    await sendConfirmationEmail('user@example.com', 'tok')

    expect(sendMock.mock.calls[0][0].html).toContain('Confirm your subscription')
  })

  it('reuses the memoized Resend client across calls', async () => {
    process.env.RESEND_API_KEY = 'rk'
    sendMock.mockResolvedValue({ error: null })
    const { sendConfirmationEmail } = await import('./email')

    await sendConfirmationEmail('a@example.com', 'tok')
    await sendConfirmationEmail('b@example.com', 'tok')

    expect(sendMock).toHaveBeenCalledTimes(2)
  })

  it('throws when Resend returns an error', async () => {
    process.env.RESEND_API_KEY = 'rk'
    sendMock.mockResolvedValue({ error: { message: 'bad request' } })
    const { sendConfirmationEmail } = await import('./email')

    await expect(
      sendConfirmationEmail('user@example.com', 'tok')
    ).rejects.toThrow(/Resend error: bad request/)
  })
})
