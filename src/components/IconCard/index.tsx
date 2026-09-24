import React from 'react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { IconBadge } from '@/components/IconBadge'

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
  if (variant === 'badge') {
    const rotationClass = badgeRotationClasses[index % badgeRotationClasses.length]
    const badgeColorClass = badgeColorClasses[index % badgeColorClasses.length]

    return (
      <Card className={['border-none shadow-md', rotationClass].join(' ')}>
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <IconBadge
            iconType={iconType}
            emoji={emoji}
            icon={icon}
            label={title}
            size="lg"
            colorClass={badgeColorClass}
          />
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
        <IconBadge
          iconType={iconType}
          emoji={emoji}
          icon={icon}
          label={title}
          size="lg"
          colorClass=""
        />
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
