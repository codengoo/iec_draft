import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CodeBlock } from '@/blocks/Code/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'

type OverlayBlock = NonNullable<Page['hero']['overlayContent']>[0]

const blockComponents: Record<string, React.FC<any>> = {
  banner: BannerBlock,
  code: CodeBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  mediaBlock: MediaBlock,
}

export const RenderVideoHeroBlocks: React.FC<{ blocks: OverlayBlock[] }> = ({ blocks }) => {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return null

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block
        if (blockType && blockType in blockComponents) {
          const Block = blockComponents[blockType]
          if (Block) {
            return (
              <div className="my-4" key={index}>
                <Block {...block} disableInnerContainer />
              </div>
            )
          }
        }
        return null
      })}
    </Fragment>
  )
}
