import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FeatureTabs: Block = {
  slug: 'featureTabs',
  interfaceName: 'FeatureTabsBlock',
  labels: {
    singular: 'Feature Tabs',
    plural: 'Feature Tabs',
  },
  fields: [
    {
      name: 'tabs',
      type: 'array',
      minRows: 1,
      maxRows: 5,
      labels: { singular: 'Tab', plural: 'Tabs' },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'description',
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
      ],
    },
  ],
}
