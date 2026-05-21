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
      name: 'eyebrow',
      type: 'text',
      localized: true,
      defaultValue: 'CAREERS AT IEC GAMES',
      admin: {
        description: 'Small uppercase label shown above the heading.',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Build Your Future With Us',
    },
    {
      name: 'headingHighlight',
      type: 'text',
      localized: true,
      defaultValue: 'With Us',
      admin: {
        description:
          'Words from the heading that should be rendered in the primary color (must match the suffix of the heading).',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      defaultValue: 'Join the team creating games for millions of players worldwide.',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Decorative illustration shown on the right side of the section.',
      },
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
      defaultValue: 'Explore Careers',
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
