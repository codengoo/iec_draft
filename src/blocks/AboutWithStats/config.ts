import type { Block } from 'payload'

import {
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  ParagraphFeature,
  UnderlineFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const AboutWithStats: Block = {
  slug: 'aboutWithStats',
  interfaceName: 'AboutWithStatsBlock',
  labels: {
    singular: 'About With Stats',
    plural: 'About With Stats',
  },
  fields: [
    {
      name: 'marqueePhrases',
      type: 'array',
      label: 'Marquee Phrases',
      labels: { singular: 'Phrase', plural: 'Phrases' },
      admin: {
        description:
          'Optional horizontal scrolling text strip at the top of the section. Each phrase is rendered in a row separated by the badge image, and the whole row translates sideways as the user scrolls through the section.',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          localized: true,
          admin: { description: 'Short uppercase phrase (e.g. "CHẤT LƯỢNG").' },
        },
      ],
    },
    {
      name: 'marqueeBadge',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Badge image displayed between marquee phrases (e.g. a circular "IEC GAMES STUDIO" stamp). Only shown when Marquee Phrases is configured.',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      admin: {
        description: 'Small uppercase label above the heading (e.g. "IEC GAMES LÀ STUDIO").',
      },
    },
    {
      name: 'heading',
      type: 'richText',
      required: true,
      localized: true,
      admin: {
        description:
          'Bolded words/phrases will be rendered with the brand gradient color.',
      },
      editor: lexicalEditor({
        features: () => [
          ParagraphFeature(),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          InlineToolbarFeature(),
          FixedToolbarFeature(),
        ],
      }),
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
    {
      name: 'mascot',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Small illustration shown beside the description text.',
      },
    },
    {
      name: 'flyingMascot',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Optional second mascot (e.g. a mascot in an airplane) that flies across the section as the user scrolls — enters from one side, arcs through the middle, exits on the other side.',
      },
    },
    linkGroup({
      appearances: false,
      overrides: {
        name: 'cta',
        label: 'CTA Link',
        maxRows: 1,
        admin: {
          initCollapsed: false,
          description: 'Optional "Về [Studio]" link rendered under the description with an arrow.',
        },
      },
    }),
    {
      name: 'stats',
      type: 'array',
      maxRows: 4,
      labels: { singular: 'Stat', plural: 'Stats' },
      admin: {
        description:
          'Each stat counts up from 0 when scrolled into view. e.g. value=50, suffix="+", label="Nhân sự chuyên nghiệp".',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'number',
              required: true,
              admin: { width: '25%', description: 'Numeric value (e.g. 50, 5, 20).' },
            },
            {
              name: 'suffix',
              type: 'text',
              admin: { width: '25%', description: 'Unit / sign appended to the number (e.g. "+", "M+", "%").' },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'decorations',
      type: 'array',
      label: 'Decorations',
      maxRows: 6,
      admin: {
        description:
          'Optional floating 3D / illustrated objects scattered around the section.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'position',
              type: 'select',
              required: true,
              defaultValue: 'topRight',
              options: [
                { label: 'Top Left', value: 'topLeft' },
                { label: 'Top Right', value: 'topRight' },
                { label: 'Bottom Left', value: 'bottomLeft' },
                { label: 'Bottom Right', value: 'bottomRight' },
                { label: 'Middle Left', value: 'middleLeft' },
                { label: 'Middle Right', value: 'middleRight' },
              ],
              admin: { width: '30%' },
            },
            {
              name: 'sizePercent',
              type: 'number',
              label: 'Size (%)',
              defaultValue: 8,
              min: 2,
              max: 30,
              admin: {
                width: '20%',
                description: 'Width as % of section',
              },
            },
          ],
        },
      ],
    },
  ],
}
