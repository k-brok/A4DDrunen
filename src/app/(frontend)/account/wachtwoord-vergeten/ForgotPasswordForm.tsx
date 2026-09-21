'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    await fetch('/api/users/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    // Altijd dezelfde bevestiging tonen, ongeacht of het e-mailadres
    // bestaat — zo kan niemand via dit formulier checken welke
    // e-mailadressen wel of niet geregistreerd zijn.
    setDone(true)
    setSubmitting(false)
  }

  if (done) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Als dit e-mailadres bij ons bekend is, hebben we een link gestuurd om je wachtwoord in te
        stellen. Check ook je spamfolder.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground">E-mailadres</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          required
        />
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Bezig...' : 'Verstuur reset-link'}
      </Button>
    </form>
  )
}
