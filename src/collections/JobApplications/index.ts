import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { denormalizeJob } from './hooks/denormalize'
import { syncSubscriber } from './hooks/syncSubscriber'

export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  labels: {
    singular: 'Job Application',
    plural: 'Job Applications',
  },
  access: {
    // Public can submit applications (the public-facing /career form).
    // Reads/edits/deletes are HR-only.
    create: () => true,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'position', 'email', 'status', 'submittedAt'],
    listSearchableFields: ['fullName', 'email', 'phone', 'position'],
    group: 'Recruitment',
  },
  hooks: {
    beforeChange: [denormalizeJob],
    afterChange: [syncSubscriber],
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
          maxLength: 30,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'job',
      type: 'relationship',
      relationTo: 'jobs',
      admin: {
        description:
          'The job this application was submitted for. Empty means a general/open application.',
      },
    },
    {
      name: 'position',
      type: 'text',
      admin: {
        description:
          'Position the candidate is interested in. Auto-filled from the job title for job-specific applications.',
      },
    },
    {
      name: 'experience',
      type: 'textarea',
      label: 'Experience Summary',
      maxLength: 4000,
    },
    {
      name: 'additionalLink',
      type: 'text',
      label: 'Additional Link',
      admin: {
        description: 'Portfolio, product showcase, GitHub, Behance, or other relevant link.',
      },
    },
    {
      name: 'cv',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'CV / Resume',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Reviewing', value: 'reviewing' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Hired', value: 'hired' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: { displayFormat: 'yyyy-MM-dd HH:mm' },
      },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'HR-only notes about this candidate.',
      },
    },
  ],
  timestamps: true,
}
