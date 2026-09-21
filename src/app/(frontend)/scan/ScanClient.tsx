'use client'

import React, { useEffect, useRef, useState } from 'react'

type ScanResult = { message: string; ok: boolean }

export const ScanClient: React.FC = () => {
  const [result, setResult] = useState<ScanResult | null>(null)
  const [manualToken, setManualToken] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus altijd op het verborgen invoerveld, zodat een USB/Bluetooth-
  // scanner (die typt als een toetsenbord + Enter) altijd terechtkomt.
  useEffect(() => {
    inputRef.current?.focus()
    const refocus = () => inputRef.current?.focus()
    window.addEventListener('click', refocus)
    return () => window.removeEventListener('click', refocus)
  }, [])

  const submitToken = async (token: string) => {
    if (!token.trim()) return
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        setResult({ ok: false, message: data.error || 'Scan mislukt' })
      } else {
        const label = data.type === 'in' ? 'Ingecheckt' : 'Uitgecheckt'
        setResult({ ok: true, message: `${label}: ${data.participantName} (${data.routeTitle})` })
      }
    } catch {
      setResult({ ok: false, message: 'Netwerkfout, probeer opnieuw' })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitToken(manualToken)
      setManualToken('')
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Scan een ticket met een USB/Bluetooth-scanner (klik ergens op de pagina zodat het invoerveld
        actief is), of vul het token handmatig in.
      </p>

      <input
        ref={inputRef}
        type="text"
        value={manualToken}
        onChange={(e) => setManualToken(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Scan hier of typ het token"
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        autoFocus
      />

      {result && (
        <div
          className={`rounded-lg p-4 text-sm font-medium ${
            result.ok ? 'bg-green-100 text-green-800' : 'bg-destructive/10 text-destructive'
          }`}
        >
          {result.message}
        </div>
      )}
    </div>
  )
}
