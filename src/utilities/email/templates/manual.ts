import { baseTemplate } from './base'

type ManualTemplateArgs = {
  subject: string
  bodyHtml: string
  subscriber: { name?: string | null }
  unsubscribeUrl: string
  siteUrl: string
}

export function manualTemplate({
  bodyHtml,
  subscriber,
  unsubscribeUrl,
  siteUrl,
}: ManualTemplateArgs): { html: string; subject: string } {
  // subject is passed through to the caller; template just wraps body in base layout
  const greeting = subscriber.name ? `<p style="margin:0 0 16px;">Xin chào <strong>${subscriber.name}</strong>,</p>` : ''

  const wrappedBody = `${greeting}${bodyHtml}`

  const html = baseTemplate({ bodyHtml: wrappedBody, unsubscribeUrl, siteUrl })

  return { html, subject: '' }
}
