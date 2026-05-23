import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { resendAdapter } from '@payloadcms/email-resend'

type EmailProvider = 'nodemailer' | 'resend'

const resolveProvider = (): EmailProvider => {
  const raw = (process.env.EMAIL_PROVIDER || 'nodemailer').toLowerCase()
  if (raw === 'nodemailer' || raw === 'resend') return raw
  // eslint-disable-next-line no-console
  console.warn(
    `[email] Unknown EMAIL_PROVIDER="${raw}". Falling back to "nodemailer". Valid values: nodemailer | resend.`,
  )
  return 'nodemailer'
}

export const emailAdapter = () => {
  const provider = resolveProvider()
  const defaultFromAddress = process.env.EMAIL_FROM ?? 'noreply@example.com'
  const defaultFromName = process.env.EMAIL_FROM_NAME ?? 'IEC'

  if (provider === 'resend') {
    return resendAdapter({
      defaultFromAddress,
      defaultFromName,
      apiKey: process.env.RESEND_API_KEY ?? '',
    })
  }

  // Default: nodemailer (SMTP)
  return nodemailerAdapter({
    defaultFromAddress,
    defaultFromName,
    skipVerify: true,
    transportOptions: {
      host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT ?? 587),
      auth: {
        user: process.env.SMTP_USER ?? '',
        pass: process.env.SMTP_PASS ?? '',
      },
    },
  })
}
