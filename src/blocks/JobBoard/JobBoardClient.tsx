'use client'

import { Button, Input, Select, SelectItem } from '@heroui/react'
import {
  IconArrowRight,
  IconBrandLinkedin,
  IconBriefcase,
  IconBrush,
  IconCode,
  IconMapPin,
  IconSearch,
  IconStack2,
} from '@tabler/icons-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'

export type JobItem = {
  id: string
  title: string
  department: string
  location: string
  salaryLabel?: string | null
  linkedinUrl?: string | null
  applyUrl?: string | null
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

export function JobBoardClient({
  jobs,
  heading,
  subtitle,
}: {
  jobs: JobItem[]
  heading?: string | null
  subtitle?: string | null
}) {
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState<string>('')
  const [location, setLocation] = useState<string>('')

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
          {/* Search input */}
          <div className="flex-1 min-w-52">
            <Input
              placeholder="Search for roles..."
              value={query}
              onValueChange={setQuery}
              variant="underlined"
              color="primary"
              startContent={<IconSearch size={16} className="text-gray-400 shrink-0" />}
            />
          </div>

          <div className="h-6 w-px bg-gray-200 hidden sm:block" />

          {/* Department filter */}
          <div className="min-w-44">
            <Select
              placeholder="All Departments"
              color="primary"
              selectedKeys={department ? new Set([department]) : new Set()}
              onSelectionChange={(keys) => {
                const val = Array.from(keys)[0] as string
                setDepartment(val ?? '')
              }}
              variant="underlined"
              startContent={<IconStack2 size={16} className="text-gray-400 shrink-0" />}
            >
              {departments.map((dept) => (
                <SelectItem key={dept}>{dept}</SelectItem>
              ))}
            </Select>
          </div>

          {/* Location filter */}
          <div className="min-w-40">
            <Select
              placeholder="All Locations"
              color="primary"
              selectedKeys={location ? new Set([location]) : new Set()}
              onSelectionChange={(keys) => {
                const val = Array.from(keys)[0] as string
                setLocation(val ?? '')
              }}
              variant="underlined"
              startContent={<IconMapPin size={16} className="text-gray-400 shrink-0" />}
            >
              {locations.map((loc) => (
                <SelectItem key={loc}>{loc}</SelectItem>
              ))}
            </Select>
          </div>

          {/* Clear filters — only shown when active */}
          {(department || location || query) && (
            <Button
              size="sm"
              variant="flat"
              radius="lg"
              className="text-gray-500 bg-gray-100 hover:bg-gray-200 shrink-0"
              onPress={() => {
                setQuery('')
                setDepartment('')
                setLocation('')
              }}
            >
              Clear
            </Button>
          )}
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
      </div>
    </section>
  )
}
