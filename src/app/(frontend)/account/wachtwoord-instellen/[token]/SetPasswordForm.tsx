'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

export const SetPasswordForm: React.FC<{ token: string }> = ({ token }) => {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const res = await fetch('/api/users/reset-password', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    if (!res.ok) {
      setError('Deze link is ongeldig of verlopen.')
      setSubmitting(false)
      return
    }

    router.push('/account')
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground">Nieuw wachtwoord</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          required
          minLength={8}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Bezig...' : 'Wachtwoord instellen'}
      </Button>
    </form>
  )
}
