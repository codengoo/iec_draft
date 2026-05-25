import type { Block } from 'payload'

export const NewsletterSignup: Block = {
  slug: 'newsletterSignup',
  interfaceName: 'NewsletterSignupBlock',
  labels: {
    singular: 'Newsletter Signup',
    plural: 'Newsletter Signups',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      localized: true,
      admin: {
        description: 'Small label above the heading, e.g. "Stay in the loop"',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      localized: true,
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      localized: true,
    },
  ],
}
