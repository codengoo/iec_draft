import { Archive } from '@/blocks/ArchiveBlock/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { FormBlock } from '@/blocks/Form/config'
import { JobBoard } from '@/blocks/JobBoard/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { SendUsCV } from '@/blocks/SendUsCV/config'

import { AboutWithStats } from '@/blocks/AboutWithStats/config'
import { CareersHighlight } from '@/blocks/CareersHighlight/config'
import { CategoryShowcase } from '@/blocks/CategoryShowcase/config'
import { CoreValues } from '@/blocks/CoreValues/config'
import { FeatureTabs } from '@/blocks/FeatureTabs/config'
import { GamesPortfolio } from '@/blocks/GamesPortfolio/config'
import { IECLife } from '@/blocks/IECLife/config'
import { VisionMission } from '@/blocks/VisionMission/config'

/**
 * Blocks available on both the Pages collection and the Home global,
 * so editors can compose any layout from the same set of blocks.
 */
export const sharedLayoutBlocks = [
  CallToAction,
  Content,
  MediaBlock,
  Archive,
  FormBlock,
  JobBoard,
  SendUsCV,
  AboutWithStats,
  GamesPortfolio,
  VisionMission,
  CoreValues,
  CareersHighlight,
  FeatureTabs,
  IECLife,
  CategoryShowcase,
]
