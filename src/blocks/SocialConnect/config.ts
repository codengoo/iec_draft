import type { Block } from 'payload'

export const SocialConnect: Block = {
  slug: 'socialConnect',
  interfaceName: 'SocialConnectBlock',
  labels: {
    singular: 'Social Connect',
    plural: 'Social Connect',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      defaultValue: 'CONNECT US',
    },
  ],
}
