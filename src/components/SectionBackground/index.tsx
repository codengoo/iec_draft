import React from 'react'

/**
 * Shared decorative background used by VisionMission and CoreValues so that
 * when they crossfade through PinnedCrossfade, the background appears static —
 * only the content (text, mascot, cards) morphs.
 *
 * Renders only absolute-positioned decorations; the parent <section> still
 * owns its own gradient base color. Drop this inside any section with
 * `relative overflow-hidden`.
 */
export const SectionBackground: React.FC = () => {
  return (
    <>
      {/* Top fade — smooth white → transparent so the section blends into the page above */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-1 h-32 bg-linear-to-b from-white to-transparent dark:from-background"
      />

      {/* Top-right soft primary blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl"
      />

      {/* Top-right outline circle */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-4 hidden h-72 w-72 rounded-full border-2 border-sky-200/50 lg:block lg:h-96 lg:w-96"
      />

      {/* Bottom-left soft sky blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-[32rem] w-[32rem] rounded-full bg-sky-200/40 blur-3xl"
      />

      {/* Bottom-left solid filled circle peeking from the edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-sky-100 md:h-80 md:w-80 lg:-bottom-32 lg:-left-32 lg:h-96 lg:w-96"
      />

      {/* Soft ring around the solid circle for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full border-2 border-sky-200/60 md:h-88 md:w-88 lg:-bottom-36 lg:-left-36 lg:h-104 lg:w-104"
      />

      {/* Small accent dot near the corner circle */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-24 left-8 h-3 w-3 rounded-full bg-sky-300/60 md:bottom-28 md:left-12"
      />

      {/* Dot grid — top right */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-12 top-24 hidden h-32 w-32 opacity-40 lg:block"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,111,238,0.35) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      />

      {/* Dot grid — bottom right */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-16 right-16 hidden h-20 w-20 opacity-30 lg:block"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,111,238,0.4) 1px, transparent 1px)',
          backgroundSize: '10px 10px',
        }}
      />
    </>
  )
}
