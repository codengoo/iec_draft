'use client'

import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconSearch,
  IconMapPin,
  IconChevronDown,
  IconCode,
  IconBrush,
  IconStack2,
  IconBriefcase,
  IconArrowRight,
  IconBrandLinkedin,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandTwitter,
  IconBrandTiktok,
  IconBrandDiscord,
} from '@tabler/icons-react'

export type JobItem = {
  id: string
  title: string
  department: string
  location: string
  salaryLabel?: string | null
  linkedinUrl?: string | null
  applyUrl?: string | null
}

export type SocialItem = {
  id: string
  platform: 'linkedin' | 'facebook' | 'instagram' | 'youtube' | 'twitter' | 'tiktok' | 'discord'
  url: string
}

type NoFitCardProps = {
  heading?: string
  subtitle?: string
  cvUrl?: string
  innovatorLabel?: string
  avatarUrls?: string[]
}

function SocialIcon({ platform }: { platform: SocialItem['platform'] }) {
  const cls = 'w-5 h-5'
  switch (platform) {
    case 'linkedin':
      return <IconBrandLinkedin className={cls} />
    case 'facebook':
      return <IconBrandFacebook className={cls} />
    case 'instagram':
      return <IconBrandInstagram className={cls} />
    case 'youtube':
      return <IconBrandYoutube className={cls} />
    case 'twitter':
      return <IconBrandTwitter className={cls} />
    case 'tiktok':
      return <IconBrandTiktok className={cls} />
    case 'discord':
      return <IconBrandDiscord className={cls} />
    default:
      return null
  }
}

function NoFitCard({ card, socials }: { card: NoFitCardProps; socials: SocialItem[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl bg-[#0f1729] text-white px-8 py-10 flex flex-col items-center text-center mt-8"
    >
      {/* Decorative puzzle icon */}
      <div className="pointer-events-none absolute right-0 bottom-0 opacity-10 select-none">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M140 60c0-11 9-20 20-20s20 9 20 20-9 20-20 20h-20V60zM80 140c11 0 20 9 20 20s-9 20-20 20-20-9-20-20v-20h20zM60 80H40c-11 0-20-9-20-20s9-20 20-20 20 9 20 20v20zM120 120v20c0 11 9 20 20 20s20-9 20-20-9-20-20-20h-20zM60 80v60h60V80H60z"
            fill="white"
          />
        </svg>
      </div>

      {card.heading && <p className="text-sm font-medium text-gray-300 mb-3">{card.heading}</p>}
      {card.subtitle && (
        <p className="text-gray-400 text-sm max-w-md leading-relaxed mb-6">{card.subtitle}</p>
      )}

      {/* CTA Button */}
      <a
        href={card.cvUrl ?? 'mailto:'}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors mb-6"
      >
        Send Us Your CV
      </a>

      {/* Social icons */}
      {socials.length > 0 && (
        <div className="flex items-center gap-4 mb-6">
          {socials.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.platform}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SocialIcon platform={s.platform} />
            </a>
          ))}
        </div>
      )}

      {/* Stacked avatars + innovator label */}
      {(card.avatarUrls?.length || card.innovatorLabel) && (
        <div className="flex items-center gap-3">
          {card.avatarUrls && card.avatarUrls.length > 0 && (
            <div className="flex -space-x-2">
              {card.avatarUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-[#0f1729] object-cover"
                  style={{ zIndex: card.avatarUrls!.length - i }}
                />
              ))}
            </div>
          )}
          {card.innovatorLabel && (
            <span className="text-sm text-gray-300">{card.innovatorLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  )
}

function departmentIcon(dept: string) {
  const d = dept.toLowerCase()
  if (d.includes('engineer') || d.includes('dev') || d.includes('tech'))
    return <IconCode size={14} />
  if (d.includes('art') || d.includes('design') || d.includes('ui') || d.includes('ux'))
    return <IconBrush size={14} />
  if (d.includes('product') || d.includes('manage')) return <IconStack2 size={14} />
  return <IconBriefcase size={14} />
}

function JobCard({ job, index }: { job: JobItem; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
      className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm mb-2 truncate">{job.title}</h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            {departmentIcon(job.department)}
            {job.department}
          </span>
          <span className="flex items-center gap-1">
            <IconMapPin size={14} />
            {job.location}
          </span>
          {job.salaryLabel && (
            <span className="flex items-center gap-1 text-blue-600 font-medium">
              <span className="inline-block w-3.5 h-3.5 text-center leading-none">💼</span>
              {job.salaryLabel}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {job.linkedinUrl && (
          <a
            href={job.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on LinkedIn"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-300 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <IconBrandLinkedin size={16} />
          </a>
        )}
        <a
          href={job.applyUrl ?? '#'}
          aria-label="Apply for this role"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white transition-colors"
        >
          <IconArrowRight size={16} />
        </a>
      </div>
    </motion.div>
  )
}

function FilterDropdown({
  label,
  icon,
  options,
  value,
  onChange,
}: {
  label: string
  icon: React.ReactNode
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none flex items-center gap-2 pl-9 pr-8 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 cursor-pointer hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors w-full"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <IconChevronDown
        size={16}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  )
}

export function JobBoardClient({
  jobs,
  heading,
  subtitle,
  socials = [],
  noFitCard,
}: {
  jobs: JobItem[]
  heading?: string | null
  subtitle?: string | null
  socials?: SocialItem[]
  noFitCard?: NoFitCardProps
}) {
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('')
  const [location, setLocation] = useState('')

  const departments = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.department).filter(Boolean))).sort(),
    [jobs],
  )
  const locations = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location).filter(Boolean))).sort(),
    [jobs],
  )

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return jobs.filter((j) => {
      const matchesQuery =
        !q || j.title.toLowerCase().includes(q) || j.department.toLowerCase().includes(q)
      const matchesDept = !department || j.department === department
      const matchesLoc = !location || j.location === location
      return matchesQuery && matchesDept && matchesLoc
    })
  }, [jobs, query, department, location])

  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          {heading && (
            <p className="text-sm font-medium text-gray-500 mb-1 tracking-wide uppercase">
              {heading}
            </p>
          )}
          {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
        </div>

        {/* Search + Filters bar */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-3 mb-8 flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-45">
            <IconSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search for roles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-transparent focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors bg-gray-50 text-gray-800 placeholder:text-gray-400"
            />
          </div>

          <div className="h-6 w-px bg-gray-200 hidden sm:block" />

          {/* Department filter */}
          <FilterDropdown
            label="All Departments"
            icon={<IconStack2 size={16} />}
            options={departments}
            value={department}
            onChange={setDepartment}
          />

          {/* Location filter */}
          <FilterDropdown
            label="All Locations"
            icon={<IconMapPin size={16} />}
            options={locations}
            value={location}
            onChange={setLocation}
          />

          {/* Search button */}
          <button
            type="button"
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shrink-0"
            onClick={() => {}}
          >
            Search
          </button>
        </div>

        {/* Job grid */}
        {filtered.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 text-sm py-16"
          >
            No roles found. Try adjusting your search or filters.
          </motion.p>
        )}

        {/* No Perfect Fit card */}
        {noFitCard && <NoFitCard card={noFitCard} socials={socials} />}
      </div>
    </section>
  )
}
