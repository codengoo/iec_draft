import type { Instrumentation } from 'next'

/**
 * onRequestError — logs full server error details when VERBOSE_ERRORS=true.
 *
 * Next.js production builds strip error messages to avoid leaking sensitive info.
 * Set VERBOSE_ERRORS=true in your .env (or docker-compose.yml) to get the full
 * stack trace and context in Docker logs for pre-production debugging.
 */
export const onRequestError: Instrumentation.onRequestError = (err, request, context) => {
  if (process.env.VERBOSE_ERRORS !== 'true') return

  const error = err as Error & { digest?: string }

  console.error('[Server Error]', {
    message: error.message,
    digest: error.digest,
    stack: error.stack,
    request: {
      method: request.method,
      path: request.path,
    },
    context: {
      routePath: context.routePath,
      routeType: context.routeType,
      renderSource: context.renderSource,
      revalidateReason: context.revalidateReason,
    },
  })
}
