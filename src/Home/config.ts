import type { GlobalConfig } from 'payload'

import { sharedLayoutBlocks } from '@/blocks/sharedBlocks'
import { hero } from '@/heros/config'
import { revalidateHome } from './hooks/revalidateHome'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home',
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
    afterChange: [revalidateHome],
  },
}
