'use client'

import { subscribeNewsletter } from '@/actions/subscribeNewsletter'
import { IconCheck, IconLoader2, IconMail, IconSparkles } from '@tabler/icons-react'
import { useState, useTransition } from 'react'

export type NewsletterLabels = {
  emailPlaceholder: string
  namePlaceholder: string
  submit: string
  submitting: string
  successTitle: string
  successBody: string
  privacy: string
  errorEmail: string
}

type Props = {
  eyebrow?: string | null
  heading: string
  subtitle?: string | null
  labels: NewsletterLabels
}

export function NewsletterSignupClient({ eyebrow, heading, subtitle, labels }: Props) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(labels.errorEmail)
      return
    }

    const fd = new FormData()
    fd.set('email', email)
    if (name) fd.set('name', name)

    startTransition(async () => {
      const result = await subscribeNewsletter(fd)
      if (result.ok) {
        setSuccess(true)
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <section className="relative overflow-hidden bg-[#0f0c29] py-20 px-4 sm:px-6">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-40 -left-40 w-120 h-120 rounded-full bg-indigo-700/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-100 h-100 rounded-full bg-violet-700/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-100 rounded-full bg-blue-900/20 blur-3xl" />
        {/* dot grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.035]">
          <defs>
            <pattern id="ns-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ns-dots)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* Mail icon badge */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/25 mb-6 ring-4 ring-indigo-500/10">
          <IconMail size={26} className="text-indigo-300" />
        </div>

        {/* Eyebrow */}
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-400">
            {eyebrow}
          </p>
        )}

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">{heading}</h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-base sm:text-lg text-indigo-100/60 mb-10 max-w-lg mx-auto">
            {subtitle}
          </p>
        )}

        {/* Success state */}
        {success ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-400/30 flex items-center justify-center">
              <IconCheck size={26} className="text-green-400" />
            </div>
            <p className="text-lg font-semibold text-white">{labels.successTitle}</p>
            <p className="text-sm text-indigo-200/60 max-w-xs">{labels.successBody}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto">
            {/* Name */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={labels.namePlaceholder}
              autoComplete="name"
              maxLength={200}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/20 transition"
            />

            {/* Email + button */}
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={labels.emailPlaceholder}
                autoComplete="email"
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/20 transition"
              />
              <button
                type="submit"
                disabled={isPending}
                className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 disabled:opacity-55 px-5 py-3 text-sm font-semibold text-white transition-colors cursor-pointer"
              >
                {isPending ? (
                  <IconLoader2 size={16} className="animate-spin" />
                ) : (
                  <IconSparkles size={16} />
                )}
                <span>{isPending ? labels.submitting : labels.submit}</span>
              </button>
            </div>

            {error && <p className="text-sm text-red-400 text-left px-1">{error}</p>}

            <p className="text-xs text-indigo-200/35 text-center mt-1">{labels.privacy}</p>
          </form>
        )}
      </div>
    </section>
  )
}
