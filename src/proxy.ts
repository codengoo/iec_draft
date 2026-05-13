import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match all paths except:
  // - /api/** (Payload API)
  // - /admin/** (Payload Admin)
  // - /_next/** (Next.js internals)
  // - /_vercel/** (Vercel internals)
  // - Files with an extension (static assets)
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
}
