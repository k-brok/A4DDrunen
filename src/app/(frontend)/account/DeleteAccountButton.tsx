'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { deleteAccountAction } from './delete-account-action'

export const DeleteAccountButton: React.FC = () => {
  const [confirming, setConfirming] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="outline"
        className="text-destructive"
        onClick={() => setConfirming(true)}
      >
        Account verwijderen
      </Button>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
      <p className="text-sm text-foreground">
        Weet je het zeker? Je account en inloggegevens worden permanent verwijderd. Eerdere
        bestellingen blijven om administratieve redenen bewaard, maar worden niet meer aan jou
        gekoppeld. Dit kan niet ongedaan worden gemaakt.
      </p>

      <div className="flex gap-2">
        <form action={deleteAccountAction}>
          <Button type="submit" variant="destructive" disabled={submitting}>
            {submitting ? 'Bezig...' : 'Ja, definitief verwijderen'}
          </Button>
        </form>

        <Button type="button" variant="outline" onClick={() => setConfirming(false)}>
          Annuleren
        </Button>
      </div>
    </div>
  )
}
