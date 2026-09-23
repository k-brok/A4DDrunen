import Image from 'next/image'
import React from 'react'

import type { CardColumnsBlock } from '@/payload-types'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const rotationClasses = ['-rotate-2', 'rotate-0', 'rotate-2']

type CardItem = NonNullable<CardColumnsBlock['cards']>[number]

type Props = CardItem & { index?: number }

export const IconCard: React.FC<Props> = ({
  iconType,
  emoji,
  icon,
  title,
  description,
  index = 0,
}) => {
  const rotationClass = rotationClasses[index % rotationClasses.length]

  return (
    <Card className={['border-none shadow-md', rotationClass].join(' ')}>
      <CardHeader>
        {iconType === 'media' && icon && typeof icon === 'object' && icon.url ? (
          <Image
            src={icon.url}
            alt={icon.alt || title}
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
        ) : (
          emoji && <span className="text-4xl leading-none">{emoji}</span>
        )}

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
