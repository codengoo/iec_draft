import clsx from 'clsx'

const FALLBACK_SRC =
  'https://raw.githubusercontent.com/payloadcms/payload/3.x/packages/ui/src/assets/payload-logo-light.svg'
const FALLBACK_ALT = 'IEC Logo'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  /** Logo image URL from General Settings. Falls back to default when absent. */
  src?: string | null
  alt?: string | null
  imgWidth?: number | null
  imgHeight?: number | null
}

export const Logo = (props: Props) => {
  const {
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
    src,
    alt,
    imgWidth,
    imgHeight,
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'
  const resolvedSrc = src || FALLBACK_SRC
  const resolvedAlt = alt || FALLBACK_ALT
  const resolvedWidth = imgWidth || 193
  const resolvedHeight = imgHeight || 34

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt={resolvedAlt}
      width={resolvedWidth}
      height={resolvedHeight}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[9.375rem] w-full h-[34px]', className)}
      src={resolvedSrc}
    />
  )
}
