import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { revalidateJob, revalidateJobDelete } from './hooks/revalidateJob'
import { notifyJobSubscribers } from './hooks/notifySubscribers'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'department', 'location', 'employmentType', 'updatedAt'],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
    },
    maxPerDoc: 25,
  },
  hooks: {
    afterChange: [revalidateJob, notifyJobSubscribers],
    afterDelete: [revalidateJobDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Job Title',
      localized: true,
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Job',
      admin: {
        position: 'sidebar',
        description: 'Show this job in the CareersHighlight block on the home page.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'department',
                  type: 'text',
                  required: true,
                  label: 'Department',
                  admin: { width: '50%' },
                },
                {
                  name: 'location',
                  type: 'text',
                  required: true,
                  label: 'Location',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'employmentType',
                  type: 'select',
                  label: 'Employment Type',
                  defaultValue: 'fullTime',
                  options: [
                    { label: 'Full-time', value: 'fullTime' },
                    { label: 'Part-time', value: 'partTime' },
                    { label: 'Contract', value: 'contract' },
                    { label: 'Internship', value: 'internship' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'workingHours',
                  type: 'text',
                  label: 'Working Hours',
                  admin: {
                    width: '50%',
                    description: 'e.g. "9AM – 6PM, Mon–Fri"',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'salaryLabel',
                  type: 'text',
                  defaultValue: 'Competitive',
                  label: 'Salary Label',
                  admin: { width: '50%', description: 'e.g. "Competitive" or "$80k–$120k"' },
                },
                {
                  name: 'linkedinUrl',
                  type: 'text',
                  label: 'LinkedIn Job URL',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Short Summary',
              localized: true,
              admin: {
                description: 'One-paragraph summary shown under the title on the detail page.',
              },
            },
          ],
        },
        {
          label: 'Job Description',
          fields: [
            {
              name: 'jobDescription',
              type: 'richText',
              label: false,
              localized: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
            },
          ],
        },
        {
          label: 'Qualifications',
          fields: [
            {
              name: 'qualifications',
              type: 'richText',
              label: false,
              localized: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                ],
              }),
            },
          ],
        },
        {
          label: 'Benefits',
          fields: [
            {
              name: 'benefits',
              type: 'richText',
              label: false,
              localized: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                ],
              }),
            },
          ],
        },
      ],
    },
  ],
}
