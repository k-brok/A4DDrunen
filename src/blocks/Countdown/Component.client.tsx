'use client'

import React, { useEffect, useState } from 'react'

type CountdownClientProps = {
  targetDate: string
}

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now())

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const units: {
  key: keyof TimeLeft
  label: string
  borderColorClass: string
  numberColorClass: string
}[] = [
  {
    key: 'days',
    label: 'Dagen',
    borderColorClass: 'border-primary',
    numberColorClass: 'text-primary',
  },
  {
    key: 'hours',
    label: 'Uren',
    borderColorClass: 'border-secondary',
    numberColorClass: 'text-secondary',
  },
  {
    key: 'minutes',
    label: 'Min',
    borderColorClass: 'border-success',
    numberColorClass: 'text-success',
  },
  {
    key: 'seconds',
    label: 'Sec',
    borderColorClass: 'border-accent',
    numberColorClass: 'text-accent',
  },
]

const rotationClasses = ['-rotate-2', 'rotate-2', 'rotate-0', '-rotate-1']
const cornerClasses = [
  'rounded-2xl rounded-br-none',
  'rounded-2xl rounded-bl-none',
  'rounded-2xl rounded-br-none',
  'rounded-2xl rounded-bl-none',
]

export function CountdownClient({ targetDate }: CountdownClientProps) {
  // Start met null zodat server- en eerste client-render (vóór hydratie) exact gelijk zijn,
  // en pas na mount de echte tijd berekenen (voorkomt hydration mismatch).
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTimeLeft(getTimeLeft(targetDate))

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {units.map(({ key, label, borderColorClass, numberColorClass }, index) => (
        <div
          key={key}
          className={[
            'flex h-24 w-24 flex-col items-center justify-center gap-1',
            'border-2 border-dashed bg-white',
            borderColorClass,
            cornerClasses[index % cornerClasses.length],
            rotationClasses[index % rotationClasses.length],
          ].join(' ')}
        >
          <span className={['text-3xl font-bold tabular-nums', numberColorClass].join(' ')}>
            {timeLeft ? String(timeLeft[key]).padStart(2, '0') : '00'}
          </span>
          <span className="text-xs font-medium uppercase text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  )
}
