'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'

export const LoginForm: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/account'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const res = await fetch('/api/users/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      setError('E-mailadres of wachtwoord onjuist.')
      setSubmitting(false)
      return
    }

    const data = await res.json()
    if ((data.user as any)?.role === 'klant') {
      router.push(redirectTo)
    } else {
      router.push('/admin')
    }
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
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

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground">Wachtwoord</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          required
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Bezig...' : 'Inloggen'}
      </Button>
    </form>
  )
}
