import Image from 'next/image'
import React from 'react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

type IconCardData = {
  title: string
  description?: string | null
  iconType?: string | null
  emoji?: string | null
  icon?: number | { url?: string | null; alt?: string | null } | null
}

type Props = IconCardData & {
  index?: number
  variant?: 'stacked' | 'badge'
}

const rotationClasses = ['-rotate-2', 'rotate-0', 'rotate-2']
const badgeRotationClasses = ['-rotate-1', 'rotate-1']
const badgeColorClasses = ['bg-primary', 'bg-accent', 'bg-success', 'bg-secondary']

export const IconCard: React.FC<Props> = ({
  iconType,
  emoji,
  icon,
  title,
  description,
  index = 0,
  variant = 'stacked',
}) => {
  const resolvedIcon =
    icon && typeof icon === 'object' && 'url' in icon && icon.url ? icon : undefined

  const iconElement =
    iconType === 'media' && resolvedIcon ? (
      <Image
        src={resolvedIcon.url as string}
        alt={resolvedIcon.alt || title}
        width={variant === 'badge' ? 28 : 40}
        height={variant === 'badge' ? 28 : 40}
        className={variant === 'badge' ? 'h-7 w-7 object-contain' : 'h-10 w-10 object-contain'}
      />
    ) : (
      emoji && (
        <span className={variant === 'badge' ? 'text-2xl leading-none' : 'text-4xl leading-none'}>
          {emoji}
        </span>
      )
    )

  if (variant === 'badge') {
    const rotationClass = badgeRotationClasses[index % badgeRotationClasses.length]
    const badgeColorClass = badgeColorClasses[index % badgeColorClasses.length]

    return (
      <Card className={['border-none shadow-md', rotationClass].join(' ')}>
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <div
            className={[
              'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl',
              badgeColorClass,
            ].join(' ')}
          >
            {iconElement}
          </div>
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
        </CardHeader>

        {description && (
          <CardContent className="pt-0">
            <CardDescription>{description}</CardDescription>
          </CardContent>
        )}
      </Card>
    )
  }

  const rotationClass = rotationClasses[index % rotationClasses.length]

  return (
    <Card className={['border-none shadow-md', rotationClass].join(' ')}>
      <CardHeader>
        {iconElement}
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
      </CardHeader>

      {description && (
        <CardContent className="pt-0">
          <CardDescription>{description}</CardDescription>
        </CardContent>
      )}
    </Card>
  )
}
