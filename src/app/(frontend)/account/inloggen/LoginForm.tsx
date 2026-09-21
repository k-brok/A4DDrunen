'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { loginAction } from './login-action'

export const LoginForm: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/account'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const result = await loginAction(email, password, rememberMe)

    if (!result.success) {
      setError(result.error)
      setSubmitting(false)
      return
    }

    router.push(result.role === 'klant' ? redirectTo : '/admin')
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

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        Onthoud mij op dit apparaat
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <a
        href="/account/wachtwoord-vergeten"
        className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
      >
        Wachtwoord vergeten?
      </a>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Bezig...' : 'Inloggen'}
      </Button>
    </form>
  )
}
