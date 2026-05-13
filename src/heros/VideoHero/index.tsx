'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
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

const headingContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.2 },
  },
}

const headingWordVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

/** Split heading so the last word renders on its own line with gradient */
function HeadingWithGradient({ text }: { text: string }) {
  const words = text.trim().split(/\s+/)
  const last = words[words.length - 1]
  const rest = words.slice(0, -1)

  return (
    <motion.h1
      className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.05] tracking-tight uppercase mb-4"
      variants={headingContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {rest.map((word, i) => (
        <motion.span key={i} variants={headingWordVariants} className="inline-block mr-[0.28em]">
          {word}
        </motion.span>
      ))}
      {rest.length > 0 && <br />}
      <motion.span
        variants={headingWordVariants}
        className="inline-block bg-clip-text text-transparent text-6xl md:text-7xl lg:text-8xl"
        style={{ backgroundImage: 'linear-gradient(90deg, #2563EB 0%, #38BDF8 100%)' }}
      >
        {last + '.'}
      </motion.span>
    </motion.h1>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

export const VideoHero: React.FC<VideoHeroProps> = ({
  videoSource,
  videoFile,
  youtubeUrl,
  heading,
  subtitle,
  overlayContent,
  primaryButtonLabel,
  primaryButtonUrl,
  secondaryButtonLabel,
  secondaryButtonUrl,
  videoPopupUrl,
}) => {
  const { setHeaderTheme } = useHeaderTheme()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [popupOpen, setPopupOpen] = useState(false)

  useEffect(() => {
    setHeaderTheme('dark')
  })

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
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

  const popupYoutubeId = videoPopupUrl ? extractYouTubeId(videoPopupUrl) : null
  const popupEmbedUrl = popupYoutubeId
    ? `https://www.youtube.com/embed/${popupYoutubeId}?autoplay=1`
    : (videoPopupUrl ?? null)

  const hasButtons = primaryButtonLabel || secondaryButtonLabel
  const hasPopupBtn = !!videoPopupUrl

  return (
    <>
      <div
        className="relative w-full h-screen min-h-screen overflow-hidden mt-[-10.4rem]"
        data-theme="dark"
      >
        {/* ── Video background ── */}
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
            <iframe
              className="absolute top-1/2 left-1/2 w-[177.77777778vh] h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&rel=0&disablekb=1&modestbranding=1&playsinline=1&vq=hd1080`}
              allow="autoplay; encrypted-media"
              title="Background video"
            />
          )}
        </div>

        {/* ── Blue gradient overlay (left → transparent) ── */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: [
              // ① Bottom fade → white (chuyển tiếp sang section tiếp theo)
              'linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.7) 78%, rgba(255,255,255,1) 100%)',
              // ② Sky-blue diagonal highlight từ góc trên-trái
              'linear-gradient(60deg, rgba(56,189,248,0.22) 0%, rgba(56,189,248,0.08) 35%, transparent 60%)',
              // ③ White panel bên trái cho text đọc được
              'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.93) 28%, rgba(255,255,255,0.1) 62%, transparent 80%)',
            ].join(', '),
          }}
        />

        {/* ── Content ── */}
        <div className="relative z-20 h-full flex items-center">
          <div className="w-full md:w-2/3 lg:w-[58%] pl-8 md:pl-16 lg:pl-24 pr-6 py-16 flex flex-col justify-center">
            {heading && <HeadingWithGradient text={heading} />}

            {subtitle && (
              <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed max-w-md">
                {subtitle}
              </p>
            )}

            {overlayContent && Array.isArray(overlayContent) && overlayContent.length > 0 && (
              <div className="mb-6">
                <RenderVideoHeroBlocks blocks={overlayContent} />
              </div>
            )}

            {/* ── Buttons row ── */}
            {(hasButtons || hasPopupBtn) && (
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {primaryButtonLabel && (
                  <a
                    href={primaryButtonUrl ?? '#'}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)' }}
                  >
                    {primaryButtonLabel}
                  </a>
                )}

                {secondaryButtonLabel && (
                  <a
                    href={secondaryButtonUrl ?? '#'}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold border-2 border-blue-600 text-blue-700 bg-transparent transition-colors hover:bg-blue-50"
                  >
                    {secondaryButtonLabel}
                  </a>
                )}

                {hasPopupBtn && (
                  <button
                    onClick={() => setPopupOpen(true)}
                    aria-label="Watch video"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors"
                  >
                    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors">
                      <PlayIcon />
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Video popup modal ── */}
      {popupOpen && popupEmbedUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setPopupOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl mx-4 aspect-video rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src={popupEmbedUrl}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              title="Video popup"
            />
            <button
              onClick={() => setPopupOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
              aria-label="Close video"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4"
              >
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
