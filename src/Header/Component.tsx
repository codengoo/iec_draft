import { getCachedGlobal } from '@/utilities/getGlobals'
import { HeaderClient } from './Component.client'

export async function Header() {
  const [headerData, generalData] = await Promise.all([
    getCachedGlobal('header', 1)(),
    getCachedGlobal('general', 1)(),
  ])

  const logoMedia =
    generalData?.logo && typeof generalData.logo === 'object'
      ? (generalData.logo as { url?: string; alt?: string; width?: number; height?: number })
      : null

  return (
    <HeaderClient
      data={headerData}
      logoSrc={logoMedia?.url ?? null}
      logoAlt={logoMedia?.alt || (generalData?.companyName as string | undefined) || 'IEC'}
    />
  )
}
