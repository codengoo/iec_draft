'use client'

import React, { useEffect, useRef } from 'react'
import type { Page } from '@/payload-types'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { RenderVideoHeroBlocks } from './RenderVideoHeroBlocks'

type VideoHeroProps = NonNullable<Page['hero'] & { type: 'videoHero' }>

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
    /youtube\.com\/shorts\/([^&?/]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) return match[1]
  }
  return null
}

export const VideoHero: React.FC<VideoHeroProps> = ({
  videoSource,
  videoFile,
  youtubeUrl,
  overlayContent,
}) => {
  const { setHeaderTheme } = useHeaderTheme()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setHeaderTheme('dark')
  })

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked; silently ignore
      })
    }
  }, [])

  const youtubeId = videoSource === 'youtube' && youtubeUrl ? extractYouTubeId(youtubeUrl) : null
  const uploadedVideoUrl =
    videoSource === 'upload' &&
    videoFile &&
    typeof videoFile === 'object' &&
    'url' in videoFile &&
    videoFile.url
      ? videoFile.url
      : null

  return (
    <div
      className="relative w-full h-screen min-h-screen overflow-hidden mt-[-10.4rem]"
      data-theme="dark"
    >
      {/* Video background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {videoSource === 'upload' && uploadedVideoUrl && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={uploadedVideoUrl} />
          </video>
        )}

        {videoSource === 'youtube' && youtubeId && (
          //   <iframe
          //     className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/2 pointer-events-none"
          //     src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playsinline=1&vq=hd1080`}
          //     allow="autoplay; encrypted-media"
          //     allowFullScreen={false}
          //     title="Background video"
          //   />
          <iframe
            className="
        absolute
        top-1/2
        left-1/2
        w-[177.77777778vh]
        h-[56.25vw]
        min-w-full
        min-h-full
        -translate-x-1/2
        -translate-y-1/2
        pointer-events-none
      "
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&rel=0&disablekb=1&modestbranding=1&playsinline=1&vq=hd1080`}
            allow="autoplay; encrypted-media"
            title="Background video"
          />
        )}
      </div>

      {/* Gradient overlay: white 100% → transparent, transition over 2/3 width */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 33%, rgba(255,255,255,0) 100%)',
        }}
      />

      {/* Content in the overlay area */}
      {overlayContent && Array.isArray(overlayContent) && overlayContent.length > 0 && (
        <div className="relative z-20 h-full flex items-center">
          <div className="w-2/3 pl-8 md:pl-16 lg:pl-24 py-16">
            <RenderVideoHeroBlocks blocks={overlayContent} />
          </div>
        </div>
      )}
    </div>
  )
}
