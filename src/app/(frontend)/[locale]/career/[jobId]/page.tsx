import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { cache } from 'react'
import {
  IconArrowLeft,
  IconBrandLinkedin,
  IconBriefcase,
  IconCalendarClock,
  IconCash,
  IconClock,
  IconMapPin,
  IconStack2,
} from '@tabler/icons-react'

import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { JobApplyModal } from '@/components/JobApplyModal'
import { SendUsCVBlock } from '@/blocks/SendUsCV/Component'
import { cn } from '@/utilities/ui'

import type { Job, Page } from '@/payload-types'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  params: Promise<{
    jobId: string
    locale: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'jobs',
    limit: 1000,
    pagination: false,
    overrideAccess: false,
  })
  return docs.map((doc) => ({ jobId: String(doc.id) }))
}

export default async function JobDetailPage({ params: paramsPromise }: Args) {
  const { jobId, locale } = await paramsPromise
  const job = await queryJobById({ id: jobId, locale })

  if (!job) notFound()

  const t = await getTranslations('JobDetail')

  const employmentTypeLabel = job.employmentType
    ? t(`type.${job.employmentType}` as const)
    : null

  return (
    <article className="pt-24 pb-16">
      <div className="container">
        <div className="mb-6">
          <Link
            href="/career"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
          >
            <IconArrowLeft size={16} />
            {t('backToCareers')}
          </Link>
        </div>

        <header className="border-b border-gray-200 pb-8 mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
              <IconStack2 size={14} />
              {job.department}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
              <IconMapPin size={14} />
              {job.location}
            </span>
            {employmentTypeLabel && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                <IconBriefcase size={14} />
                {employmentTypeLabel}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900">
            {job.title}
          </h1>
          {job.description && (
            <p className="mt-4 text-gray-600 max-w-3xl leading-relaxed">{job.description}</p>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 items-start">
          <main className="min-w-0">
            <Section title={t('jobDescription')} data={job.jobDescription} />
            <Section title={t('qualifications')} data={job.qualifications} />
            <Section title={t('benefits')} data={job.benefits} last />
          </main>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-5">
                {t('jobSummary')}
              </h2>
              <dl className="space-y-4 mb-6">
                {job.salaryLabel && (
                  <SummaryRow
                    icon={<IconCash size={18} />}
                    label={t('salary')}
                    value={job.salaryLabel}
                    valueClass="text-blue-600 font-semibold"
                  />
                )}
                <SummaryRow
                  icon={<IconMapPin size={18} />}
                  label={t('location')}
                  value={job.location}
                />
                <SummaryRow
                  icon={<IconStack2 size={18} />}
                  label={t('department')}
                  value={job.department}
                />
                {job.workingHours && (
                  <SummaryRow
                    icon={<IconClock size={18} />}
                    label={t('workingHours')}
                    value={job.workingHours}
                  />
                )}
                {employmentTypeLabel && (
                  <SummaryRow
                    icon={<IconCalendarClock size={18} />}
                    label={t('employmentType')}
                    value={employmentTypeLabel}
                  />
                )}
              </dl>

              <div className="space-y-3">
                <JobApplyModal
                  className="w-full"
                  jobId={String(job.id)}
                  jobTitle={job.title}
                  labels={{
                    triggerLabel: t('applyNow'),
                    title: t('apply.title'),
                    subtitle: t('apply.subtitle'),
                    fullName: t('apply.fullName'),
                    email: t('apply.email'),
                    phone: t('apply.phone'),
                    position: t('apply.position'),
                    experience: t('apply.experience'),
                    cv: t('apply.cv'),
                    cvHint: t('apply.cvHint'),
                    cvAttached: t('apply.cvAttached'),
                    cvChange: t('apply.cvChange'),
                    submit: t('apply.submit'),
                    submitting: t('apply.submitting'),
                    successTitle: t('apply.successTitle'),
                    successBody: t('apply.successBody'),
                    close: t('apply.close'),
                    required: t('apply.required'),
                  }}
                />
                {job.linkedinUrl && (
                  <Button asChild className="w-full" size="lg" variant="outline">
                    <a href={job.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <IconBrandLinkedin size={18} />
                      {t('viewLinkedIn')}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="mt-20">
        <CareerSendUsCVSection />
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { jobId, locale } = await paramsPromise
  const job = await queryJobById({ id: jobId, locale })
  if (!job) return {}

  const description = job.description ?? `${job.department} · ${job.location}`
  return {
    title: job.title,
    description,
    openGraph: {
      title: job.title,
      description,
    },
  }
}

const queryJobById = cache(
  async ({ id, locale }: { id: string; locale: string }): Promise<Job | null> => {
    if (!/^[a-f0-9]{24}$/i.test(id)) return null
    const payload = await getPayload({ config: configPromise })
    try {
      const job = await payload.findByID({
        collection: 'jobs',
        id,
        depth: 1,
        overrideAccess: false,
        locale: locale as 'en' | 'vi',
      })
      return job ?? null
    } catch {
      return null
    }
  },
)

function SummaryRow({
  icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-gray-400 shrink-0">{icon}</span>
      <div className="min-w-0">
        <dt className="text-xs text-gray-500 uppercase tracking-wide">{label}</dt>
        <dd className={cn('text-sm text-gray-900 mt-0.5', valueClass)}>{value}</dd>
      </div>
    </div>
  )
}

type RichTextData = NonNullable<Job['jobDescription']>

function Section({
  title,
  data,
  last,
}: {
  title: string
  data?: RichTextData | null
  last?: boolean
}) {
  if (!data) return null
  return (
    <section className={cn(last ? '' : 'mb-12')}>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
      <RichText data={data} enableGutter={false} className="max-w-none" />
    </section>
  )
}

async function CareerSendUsCVSection() {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'pages',
    limit: 1,
    pagination: false,
    depth: 2,
    where: { slug: { equals: 'career' } },
  })
  const careerPage = docs[0] as Page | undefined
  const block = careerPage?.layout?.find(
    (b): b is Extract<NonNullable<Page['layout']>[number], { blockType: 'sendUsCV' }> =>
      b?.blockType === 'sendUsCV',
  )
  if (!block) return null
  return <SendUsCVBlock {...block} id={block.id ?? undefined} />
}
