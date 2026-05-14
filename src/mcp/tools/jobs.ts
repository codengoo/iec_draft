/**
 * MCP Tool definitions for the Jobs collection.
 *
 * All tools accept an optional `locale` param ('en' | 'vi', default 'en').
 * Localized fields (title, description, jobDescription, qualifications, benefits)
 * are read/written in the requested locale; metadata fields are locale-agnostic.
 *
 * NOTE: McpServer.registerTool expects `inputSchema` as a plain object of Zod
 * schemas (ZodRawShapeCompat), not z.object(). Callback args are inferred.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { Payload, Where } from 'payload'
import { z } from 'zod'

import { textToLexical } from '../utils/lexical'

// ─── Shared schemas ───────────────────────────────────────────────────────────

const localeField = z.enum(['en', 'vi']).default('en').describe('Content locale (en | vi)')

const employmentTypeField = z
  .enum(['fullTime', 'partTime', 'contract', 'internship'])
  .optional()
  .describe('Employment type: fullTime | partTime | contract | internship')

// ─── Helper ───────────────────────────────────────────────────────────────────

function buildJobData(input: Record<string, unknown>): Record<string, unknown> {
  const data: Record<string, unknown> = {}

  const strFields = [
    'title',
    'department',
    'location',
    'employmentType',
    'workingHours',
    'salaryLabel',
    'linkedinUrl',
    'description',
  ]
  for (const key of strFields) {
    if (input[key] !== undefined) data[key] = input[key]
  }

  const jd = textToLexical(input['jobDescription'] as string | undefined)
  if (jd !== undefined) data['jobDescription'] = jd

  const qual = textToLexical(input['qualifications'] as string | undefined)
  if (qual !== undefined) data['qualifications'] = qual

  const ben = textToLexical(input['benefits'] as string | undefined)
  if (ben !== undefined) data['benefits'] = ben

  return data
}

function jobToText(doc: unknown): string {
  return JSON.stringify(doc, null, 2)
}

// ─── Tool registrations ───────────────────────────────────────────────────────

export function registerJobTools(server: McpServer, payload: Payload) {
  // ── jobs_list ──────────────────────────────────────────────────────────────
  server.registerTool(
    'jobs_list',
    {
      title: 'List Jobs',
      description: 'List job postings with optional filters. Returns title, id, and key metadata.',
      inputSchema: {
        locale: localeField,
        department: z.string().optional().describe('Filter by exact department name'),
        location: z.string().optional().describe('Filter by location (partial match)'),
        employmentType: employmentTypeField,
        limit: z
          .number()
          .int()
          .min(1)
          .max(100)
          .default(20)
          .describe('Max number of results to return'),
      },
    },
    async ({ locale, department, location, employmentType, limit }) => {
      const where: Where = {}
      if (department) where['department'] = { equals: department }
      if (location) where['location'] = { contains: location }
      if (employmentType) where['employmentType'] = { equals: employmentType }

      const result = await payload.find({
        collection: 'jobs',
        where,
        limit,
        locale,
        depth: 0,
      })

      const items = result.docs.map((doc) => ({
        id: doc.id,
        title: doc.title,
        department: doc.department,
        location: doc.location,
        employmentType: doc.employmentType,
        workingHours: doc.workingHours,
        salaryLabel: doc.salaryLabel,
        description: doc.description,
        updatedAt: doc.updatedAt,
      }))

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ total: result.totalDocs, items }, null, 2),
          },
        ],
      }
    },
  )

  // ── jobs_get ───────────────────────────────────────────────────────────────
  server.registerTool(
    'jobs_get',
    {
      title: 'Get Job',
      description: 'Get a single job posting by its ID, including all localized content fields.',
      inputSchema: {
        id: z.string().describe('Job document ID'),
        locale: localeField,
      },
    },
    async ({ id, locale }) => {
      const doc = await payload.findByID({
        collection: 'jobs',
        id,
        locale,
        depth: 0,
      })

      return {
        content: [{ type: 'text' as const, text: jobToText(doc) }],
      }
    },
  )

  // ── jobs_create ────────────────────────────────────────────────────────────
  server.registerTool(
    'jobs_create',
    {
      title: 'Create Job',
      description:
        'Create a new job posting and publish it immediately. ' +
        'Pass richText fields (jobDescription, qualifications, benefits) as plain text ' +
        'or simple markdown (## h2, ### h3, **bold**, --- for HR). ' +
        'Use locale to write content in that language.',
      inputSchema: {
        locale: localeField,
        title: z.string().describe('Job title'),
        department: z.string().describe('Department name (e.g. "Engineering", "Marketing")'),
        location: z.string().describe('Job location (e.g. "Hanoi, Vietnam" or "Remote")'),
        employmentType: employmentTypeField,
        workingHours: z.string().optional().describe('Working hours (e.g. "9AM – 6PM, Mon–Fri")'),
        salaryLabel: z
          .string()
          .optional()
          .describe('Salary label shown publicly (e.g. "Competitive" or "$80k–$120k")'),
        linkedinUrl: z.string().optional().describe('LinkedIn job posting URL'),
        description: z
          .string()
          .optional()
          .describe('Short one-paragraph summary shown on the listing page'),
        jobDescription: z
          .string()
          .optional()
          .describe('Main job description body (plain text or simple markdown)'),
        qualifications: z
          .string()
          .optional()
          .describe('Candidate qualifications (plain text or simple markdown)'),
        benefits: z
          .string()
          .optional()
          .describe('Benefits offered (plain text or simple markdown)'),
      },
    },
    async (input) => {
      const { locale, ...rest } = input
      const data = buildJobData(rest as Record<string, unknown>)

      const doc = await payload.create({
        collection: 'jobs',
        data: { ...data, _status: 'published' } as never,
        locale,
      })

      return {
        content: [
          {
            type: 'text' as const,
            text: `Created job "${doc.title}" (id: ${doc.id})\n\n${jobToText(doc)}`,
          },
        ],
      }
    },
  )

  // ── jobs_update ────────────────────────────────────────────────────────────
  server.registerTool(
    'jobs_update',
    {
      title: 'Update Job',
      description:
        'Update fields of an existing job. Only provided fields are changed. ' +
        'Specify locale to update content in that language without overwriting the other locale.',
      inputSchema: {
        id: z.string().describe('Job document ID to update'),
        locale: localeField,
        title: z.string().optional().describe('New job title'),
        department: z.string().optional().describe('New department'),
        location: z.string().optional().describe('New location'),
        employmentType: employmentTypeField,
        workingHours: z.string().optional().describe('New working hours'),
        salaryLabel: z.string().optional().describe('New salary label'),
        linkedinUrl: z.string().optional().describe('New LinkedIn URL'),
        description: z.string().optional().describe('New short summary'),
        jobDescription: z
          .string()
          .optional()
          .describe('New job description (plain text or markdown)'),
        qualifications: z
          .string()
          .optional()
          .describe('New qualifications (plain text or markdown)'),
        benefits: z.string().optional().describe('New benefits (plain text or markdown)'),
      },
    },
    async (input) => {
      const { id, locale, ...rest } = input
      const data = buildJobData(rest as Record<string, unknown>)

      const doc = await payload.update({
        collection: 'jobs',
        id,
        data: data as never,
        locale,
      })

      return {
        content: [
          {
            type: 'text' as const,
            text: `Updated job "${doc.title}" (id: ${doc.id})\n\n${jobToText(doc)}`,
          },
        ],
      }
    },
  )

  // ── jobs_delete ────────────────────────────────────────────────────────────
  server.registerTool(
    'jobs_delete',
    {
      title: 'Delete Job',
      description: 'Permanently delete a job posting by ID.',
      inputSchema: {
        id: z.string().describe('Job document ID to delete'),
      },
    },
    async ({ id }) => {
      await payload.delete({ collection: 'jobs', id })

      return {
        content: [{ type: 'text' as const, text: `Deleted job id: ${id}` }],
      }
    },
  )
}
