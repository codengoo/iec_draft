import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { Banner } from '@/blocks/Banner/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Code } from '@/blocks/Code/config'
import { Content } from '@/blocks/Content/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { PolicyTabs } from '@/blocks/PolicyTabs/config'
import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'Video Hero',
          value: 'videoHero',
        },
        {
          label: 'Brand Hero',
          value: 'brandHero',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
      localized: true,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    // --- Video Hero fields ---
    {
      name: 'videoSource',
      type: 'select',
      label: 'Video Source',
      defaultValue: 'upload',
      options: [
        { label: 'Upload', value: 'upload' },
        { label: 'YouTube', value: 'youtube' },
      ],
      admin: {
        condition: (_, { type } = {}) => type === 'videoHero',
      },
    },
    {
      name: 'videoFile',
      type: 'upload',
      label: 'Video File',
      relationTo: 'media',
      admin: {
        condition: (_, { type, videoSource } = {}) =>
          type === 'videoHero' && videoSource === 'upload',
      },
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'YouTube URL',
      admin: {
        description: 'Enter the full YouTube URL (e.g. https://www.youtube.com/watch?v=xxxxx)',
        condition: (_, { type, videoSource } = {}) =>
          type === 'videoHero' && videoSource === 'youtube',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      localized: true,
      admin: {
        description: 'Main heading displayed in the overlay area',
        condition: (_, { type } = {}) => type === 'videoHero',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
      localized: true,
      admin: {
        description: 'Subtitle / description text below the heading',
        condition: (_, { type } = {}) => type === 'videoHero',
      },
    },
    {
      name: 'overlayContent',
      type: 'blocks',
      label: 'Overlay Content',
      admin: {
        description: 'Content displayed inside the overlay area (left 2/3 of the screen)',
        condition: (_, { type } = {}) => type === 'videoHero',
      },
      blocks: [CallToAction, Content, MediaBlock, Banner, Code, PolicyTabs],
    },
    // --- Video Hero buttons ---
    {
      name: 'primaryButtonLabel',
      type: 'text',
      label: 'Primary Button Label',
      localized: true,
      admin: {
        condition: (_, { type } = {}) => type === 'videoHero',
      },
    },
    {
      name: 'primaryButtonUrl',
      type: 'text',
      label: 'Primary Button URL',
      admin: {
        condition: (_, { type } = {}) => type === 'videoHero',
      },
    },
    {
      name: 'secondaryButtonLabel',
      type: 'text',
      label: 'Secondary Button Label',
      localized: true,
      admin: {
        condition: (_, { type } = {}) => type === 'videoHero',
      },
    },
    {
      name: 'secondaryButtonUrl',
      type: 'text',
      label: 'Secondary Button URL',
      admin: {
        condition: (_, { type } = {}) => type === 'videoHero',
      },
    },
    {
      name: 'videoPopupUrl',
      type: 'text',
      label: 'Video Popup URL',
      admin: {
        description:
          'YouTube or direct video URL to open in a popup when the play button is clicked',
        condition: (_, { type } = {}) => type === 'videoHero',
      },
    },
    // --- Brand Hero fields ---
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      localized: true,
      admin: {
        description: 'Small label above the heading (e.g. "Gaming Studio").',
        condition: (_, { type } = {}) => type === 'brandHero',
      },
    },
    {
      name: 'brandHeading',
      type: 'text',
      label: 'Brand Heading',
      localized: true,
      admin: {
        description: 'Large brand heading (e.g. "IEC Games").',
        condition: (_, { type } = {}) => type === 'brandHero',
      },
    },
    {
      name: 'tagline',
      type: 'textarea',
      label: 'Tagline',
      localized: true,
      admin: {
        description: 'Supporting paragraph under the heading.',
        condition: (_, { type } = {}) => type === 'brandHero',
      },
    },
    {
      name: 'inlineStats',
      type: 'array',
      label: 'Inline Stats',
      maxRows: 4,
      admin: {
        description: 'Small stats shown next to the CTA (e.g. "2.5B+ Total Downloads").',
        condition: (_, { type } = {}) => type === 'brandHero',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: { width: '40%' },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              admin: { width: '60%' },
            },
          ],
        },
      ],
    },
    {
      name: 'mascot',
      type: 'upload',
      label: 'Mascot Image',
      relationTo: 'media',
      admin: {
        condition: (_, { type } = {}) => type === 'brandHero',
      },
    },
    {
      name: 'share',
      type: 'group',
      label: 'Share Widget',
      admin: {
        description:
          'QR / share popup next to the CTA. Pick which platforms to expose, an optional centre logo, and a colour preset for the QR code.',
        condition: (_, { type } = {}) => type === 'brandHero',
      },
      fields: [
        {
          name: 'enabledPlatforms',
          type: 'select',
          hasMany: true,
          defaultValue: ['facebook', 'x', 'linkedin', 'messenger', 'telegram', 'whatsapp', 'email'],
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'X / Twitter', value: 'x' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Messenger', value: 'messenger' },
            { label: 'Telegram', value: 'telegram' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Email', value: 'email' },
          ],
        },
        {
          name: 'qrLogo',
          type: 'upload',
          relationTo: 'media',
          label: 'QR Centre Logo',
          admin: {
            description: 'Image rendered at the centre of the QR code (use the site logo).',
          },
        },
        {
          name: 'qrColorPreset',
          type: 'select',
          defaultValue: 'iecIndigo',
          options: [
            { label: 'Mono Black', value: 'mono' },
            { label: 'IEC Indigo (brand)', value: 'iecIndigo' },
            { label: 'Instagram (orange → pink → purple)', value: 'instagram' },
            { label: 'Sunset (orange → red)', value: 'sunset' },
            { label: 'Ocean (cyan → blue)', value: 'ocean' },
            { label: 'Forest (teal → green)', value: 'forest' },
          ],
        },
      ],
    },
    {
      name: 'decorations',
      type: 'array',
      label: 'Decorations',
      maxRows: 8,
      admin: {
        description:
          'Floating 3D / illustrated objects scattered around the hero. Each item has an image, a position, and an optional size %.',
        condition: (_, { type } = {}) => type === 'brandHero',
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
              defaultValue: 'topLeft',
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
                description: 'Width as % of hero',
              },
            },
          ],
        },
      ],
    },
  ],
  label: false,
}
