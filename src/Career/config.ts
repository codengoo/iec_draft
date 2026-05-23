import type { GlobalConfig } from 'payload'

import { sharedLayoutBlocks } from '@/blocks/sharedBlocks'
import { hero } from '@/heros/config'
import { revalidateCareer } from './hooks/revalidateCareer'

export const Career: GlobalConfig = {
  slug: 'career',
  label: 'Career',
  access: {
    read: () => true,
  },
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
    },
    max: 25,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [hero],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: sharedLayoutBlocks,
              admin: {
                initCollapsed: true,
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateCareer],
  },
}
