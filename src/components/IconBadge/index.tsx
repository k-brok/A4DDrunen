import Image from 'next/image'
import React from 'react'

type IconBadgeProps = {
  iconType?: string | null
  emoji?: string | null
  icon?: number | { url?: string | null; alt?: string | null } | null
  label?: string
  size?: 'sm' | 'lg'
  colorClass?: string
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  iconType,
  emoji,
  icon,
  label = '',
  size = 'lg',
  colorClass = 'bg-primary/10',
}) => {
  const resolvedIcon =
    icon && typeof icon === 'object' && 'url' in icon && icon.url ? icon : undefined

  const dimension = size === 'sm' ? 20 : 28
  const wrapperSize = size === 'sm' ? 'h-10 w-10' : 'h-14 w-14'
  const emojiTextSize = size === 'sm' ? 'text-lg' : 'text-2xl'

  if (!(iconType === 'media' && resolvedIcon) && !emoji) return null

  return (
    <div
      className={[
        'flex shrink-0 items-center justify-center rounded-xl',
        wrapperSize,
        colorClass,
      ].join(' ')}
    >
      {iconType === 'media' && resolvedIcon ? (
        <Image
          src={resolvedIcon.url as string}
          alt={resolvedIcon.alt || label}
          width={dimension}
          height={dimension}
          className="object-contain"
        />
      ) : (
        <span className={emojiTextSize}>{emoji}</span>
      )}
    </div>
  )
}
