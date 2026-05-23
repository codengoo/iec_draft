export function getUnsubscribeUrl(token: string, locale = 'vi'): string {
  const siteUrl = (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
  return `${siteUrl}/${locale}/unsubscribe?token=${token}`
}
