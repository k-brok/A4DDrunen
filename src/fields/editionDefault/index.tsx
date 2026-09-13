'use client'

import { useField, usePreferences } from '@payloadcms/ui'
import React, { useEffect } from 'react'
import type { RelationshipFieldClientComponent } from 'payload'

const PREFERENCE_KEY = 'admin-edition'

export const EditionDefaultField: RelationshipFieldClientComponent = (props) => {
  const { path } = props
  const { value, setValue } = useField<string>({ path })
  const { getPreference } = usePreferences()

  useEffect(() => {
    if (value) return // niet overschrijven als er al een waarde is (bv. bij bewerken)

    const applyDefault = async () => {
      const pref = await getPreference<string>(PREFERENCE_KEY)
      if (pref) {
        setValue(pref)
      }
    }

    applyDefault()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Val terug op Payload's standaard relationship-veld-UI; we hoeven alleen de waarde te sturen.
  const { RelationshipField } = require('@payloadcms/ui')
  return <RelationshipField {...props} />
}
