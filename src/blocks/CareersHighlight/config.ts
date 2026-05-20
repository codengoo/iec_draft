import type { Block } from 'payload'

import { link } from '../../fields/link'

export const CareersHighlight: Block = {
  slug: 'careersHighlight',
  interfaceName: 'CareersHighlightBlock',
  labels: {
    singular: 'Careers Highlight',
    plural: 'Careers Highlight',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Build Your Future With Us',
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      admin: {
        description: 'How many featured jobs to show (jobs with "Featured Job" enabled).',
        step: 1,
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      localized: true,
      defaultValue: 'Browse Opportunities',
    },
    link({
      appearances: false,
      disableLabel: true,
      overrides: {
        name: 'ctaLink',
      },
    }),
  ],
}
