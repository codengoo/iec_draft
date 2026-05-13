import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

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
    defaultColumns: ['title', 'department', 'location', 'updatedAt'],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
    },
    maxPerDoc: 25,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Job Title',
    },
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
      name: 'applyUrl',
      type: 'text',
      label: 'Apply URL',
      admin: { description: 'Link to the application form or external page' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Job Description',
    },
  ],
}
