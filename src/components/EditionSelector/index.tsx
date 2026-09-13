'use client'

import { useAuth, usePreferences } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

type Editie = {
  id: string
  title: string
  active?: boolean | null
}

const PREFERENCE_KEY = 'admin-edition'

export const EditionSelector: React.FC = () => {
  const { user } = useAuth()
  const { getPreference, setPreference } = usePreferences()

  const [edities, setEdities] = useState<Editie[]>([])
  const [selected, setSelected] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [editiesRes, pref] = await Promise.all([
          fetch('/api/edities?limit=100&sort=-year&depth=0').then((r) => r.json()),
          getPreference<string>(PREFERENCE_KEY),
        ])

        const docs: Editie[] = editiesRes?.docs ?? []
        setEdities(docs)

        if (pref) {
          setSelected(pref)
        } else {
          const active = docs.find((e) => e.active)
          if (active) {
            setSelected(active.id)
            await setPreference(PREFERENCE_KEY, active.id)
          }
        }
      } finally {
        setLoading(false)
      }
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!user || (user as { role?: string }).role !== 'admin') return null
  if (loading || edities.length === 0) return null

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelected(value)
    await setPreference(PREFERENCE_KEY, value)
    window.location.reload()
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem' }}>
      <select
        id="edition-selector"
        value={selected}
        onChange={handleChange}
        style={{
          padding: '6px 10px',
          borderRadius: 'var(--style-radius-m, 4px)',
          border: '1px solid var(--theme-elevation-150, #ccc)',
          background: 'var(--theme-input-bg, var(--theme-elevation-0, #fff))',
          color: 'var(--theme-elevation-800, #1a1a1a)',
          fontSize: '13px',
          fontFamily: 'inherit',
        }}
      >
        {edities.map((e) => (
          <option key={e.id} value={e.id}>
            {e.title}
          </option>
        ))}
      </select>
    </div>
  )
}
