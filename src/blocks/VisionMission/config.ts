import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '../../fields/linkGroup'

export const VisionMission: Block = {
  slug: 'visionMission',
  interfaceName: 'VisionMissionBlock',
  labels: {
    singular: 'Vision & Mission',
    plural: 'Vision & Mission',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'body',
      type: 'richText',
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
    {
      name: 'mascot',
      type: 'upload',
      relationTo: 'media',
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        name: 'cta',
        maxRows: 1,
        label: 'CTA',
      },
    }),
  ],
}
