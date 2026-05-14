import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      label: 'Company Name',
    },
    {
      name: 'address',
      type: 'text',
      label: 'Address',
    },
    {
      name: 'hotline',
      type: 'text',
      label: 'Hotline',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'logoSubtitle',
      type: 'textarea',
      label: 'Logo Subtitle',
      localized: true,
      admin: {
        description: 'Short tagline displayed under the logo in the footer',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Button Label',
    },
    {
      name: 'phoneUrl',
      type: 'text',
      label: 'Phone Button URL (e.g. tel:+84283962388)',
    },
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright Text',
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Bottom Nav Links',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
