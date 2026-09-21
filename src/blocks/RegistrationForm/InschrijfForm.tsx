'use client'

import React, { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type RouteOption = {
  id: string
  title: string
  distance: number
}

type PriceOption = {
  id: string
  label: string
  price: number
  requiresInput?: boolean
  inputLabel?: string | null
}

type Participant = {
  key: string
  name: string
  birthDate: string
  routeId: string
  optionIds: string[]
  optionInputs: Record<string, string>
}

type Props = {
  routes: RouteOption[]
  options: PriceOption[]
  pricePerParticipant: number
}

function emptyParticipant(): Participant {
  return {
    key: crypto.randomUUID(),
    name: '',
    birthDate: '',
    routeId: '',
    optionIds: [],
    optionInputs: {},
  }
}

function calcParticipantTotal(
  p: { optionIds: string[] },
  options: PriceOption[],
  pricePerParticipant: number,
) {
  const optionsTotal = p.optionIds.reduce((sum, id) => {
    const opt = options.find((o) => o.id === id)
    return sum + (opt ? Number(opt.price) : 0)
  }, 0)
  return pricePerParticipant + optionsTotal
}

export const InschrijfForm: React.FC<Props> = ({ routes, options, pricePerParticipant }) => {
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [createAccount, setCreateAccount] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)

  const [selfWalksAlong, setSelfWalksAlong] = useState(true)
  const [selfBirthDate, setSelfBirthDate] = useState('')
  const [selfRouteId, setSelfRouteId] = useState('')
  const [selfOptionIds, setSelfOptionIds] = useState<string[]>([])
  const [selfOptionInputs, setSelfOptionInputs] = useState<Record<string, string>>({})

  const [participants, setParticipants] = useState<Participant[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleSelfOption = (optionId: string) => {
    setSelfOptionIds((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId],
    )
  }

  const updateParticipant = (key: string, patch: Partial<Participant>) => {
    setParticipants((prev) => prev.map((p) => (p.key === key ? { ...p, ...patch } : p)))
  }

  const toggleOption = (key: string, optionId: string) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.key !== key) return p
        const has = p.optionIds.includes(optionId)
        return {
          ...p,
          optionIds: has ? p.optionIds.filter((id) => id !== optionId) : [...p.optionIds, optionId],
        }
      }),
    )
  }

  const setParticipantOptionInput = (key: string, optionId: string, value: string) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.key === key ? { ...p, optionInputs: { ...p.optionInputs, [optionId]: value } } : p,
      ),
    )
  }

  const addParticipant = () => setParticipants((prev) => [...prev, emptyParticipant()])
  const removeParticipant = (key: string) =>
    setParticipants((prev) => prev.filter((p) => p.key !== key))

  const selfTotal = selfWalksAlong
    ? calcParticipantTotal({ optionIds: selfOptionIds }, options, pricePerParticipant)
    : 0

  const total =
    selfTotal +
    participants.reduce((sum, p) => sum + calcParticipantTotal(p, options, pricePerParticipant), 0)

  const renderOptionInputs = (
    selectedIds: string[],
    onChange: (optionId: string, value: string) => void,
    values: Record<string, string>,
  ) =>
    options
      .filter((o) => o.requiresInput && selectedIds.includes(o.id))
      .map((o) => (
        <div key={o.id} className="flex flex-col gap-1 pl-6">
          <label className="text-xs font-medium text-muted-foreground">
            {o.inputLabel || o.label}
          </label>
          <input
            type="text"
            value={values[o.id] || ''}
            onChange={(e) => onChange(o.id, e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
          />
        </div>
      ))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!privacyAccepted) {
      setError('Je moet akkoord gaan met de privacyverklaring om door te gaan.')
      return
    }

    if (!contactName || !contactEmail) {
      setError('Vul je naam en e-mailadres in.')
      return
    }

    if (selfWalksAlong && (!selfBirthDate || !selfRouteId)) {
      setError('Vul je geboortedatum en route in, of geef aan dat je niet meeloopt.')
      return
    }

    if (participants.some((p) => !p.name || !p.birthDate || !p.routeId)) {
      setError('Vul voor elke deelnemer naam, geboortedatum en route in.')
      return
    }

    if (!selfWalksAlong && participants.length === 0) {
      setError('Voeg minimaal één deelnemer toe.')
      return
    }

    setSubmitting(true)

    const allParticipants = [
      ...(selfWalksAlong
        ? [
            {
              name: contactName,
              birthDate: selfBirthDate,
              routeId: selfRouteId,
              optionIds: selfOptionIds,
              optionInputs: selfOptionInputs,
            },
          ]
        : []),
      ...participants.map((p) => ({
        name: p.name,
        birthDate: p.birthDate,
        routeId: p.routeId,
        optionIds: p.optionIds,
        optionInputs: p.optionInputs,
      })),
    ]

    try {
      const res = await fetch('/api/inschrijven', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName,
          contactEmail,
          contactPhone,
          createAccount,
          privacyAccepted,
          participants: allParticipants,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Er ging iets mis, probeer het opnieuw.')
        setSubmitting(false)
        return
      }

      window.location.href = data.checkoutUrl
    } catch {
      setError('Er ging iets mis, probeer het opnieuw.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      {/* Contactgegevens + inschrijver als deelnemer */}
      <Card className="border-none shadow-md">
        <CardContent className="flex flex-col gap-4 p-6">
          <h2 className="text-lg font-bold text-card-foreground">Jouw gegevens</h2>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Naam</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">E-mailadres</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">
              Telefoonnummer (optioneel)
            </label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>

          <label className="flex items-center gap-2 border-t border-dashed border-border pt-4 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={createAccount}
              onChange={(e) => setCreateAccount(e.target.checked)}
            />
            Maak een account voor mij aan, zodat ik mijn inschrijvingen later kan terugzien
          </label>

          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="mt-0.5"
              required
            />
            <span>
              Ik ga akkoord met de{' '}
              <a
                href="/privacyverklaring"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                privacyverklaring
              </a>
            </span>
          </label>

          <label className="flex items-center gap-2 border-t border-dashed border-border pt-4 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={!selfWalksAlong}
              onChange={(e) => setSelfWalksAlong(!e.target.checked)}
            />
            Ik loop niet mee, ik schrijf alleen anderen in
          </label>

          {selfWalksAlong && (
            <div className="flex flex-col gap-4 border-t border-dashed border-border pt-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground">Jouw geboortedatum</label>
                <input
                  type="date"
                  value={selfBirthDate}
                  onChange={(e) => setSelfBirthDate(e.target.value)}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground">Jouw route</label>
                <select
                  value={selfRouteId}
                  onChange={(e) => setSelfRouteId(e.target.value)}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Kies een route</option>
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {String(r.distance).replace('.', ',')} km — {r.title}
                    </option>
                  ))}
                </select>
              </div>

              {options.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-foreground">Extra&apos;s</span>
                  {options.map((o) => (
                    <div key={o.id} className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={selfOptionIds.includes(o.id)}
                          onChange={() => toggleSelfOption(o.id)}
                        />
                        {o.label} (+€{Number(o.price).toFixed(2)})
                      </label>
                      {o.requiresInput &&
                        selfOptionIds.includes(o.id) &&
                        renderOptionInputs(
                          [o.id],
                          (optId, value) =>
                            setSelfOptionInputs((prev) => ({ ...prev, [optId]: value })),
                          selfOptionInputs,
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overige deelnemers */}
      <div className="flex flex-col gap-4">
        {participants.map((p, index) => (
          <Card key={p.key} className="border-none shadow-md">
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-card-foreground">Deelnemer {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeParticipant(p.key)}
                  aria-label="Verwijder deelnemer"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground">Naam</label>
                <input
                  type="text"
                  value={p.name}
                  onChange={(e) => updateParticipant(p.key, { name: e.target.value })}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground">Geboortedatum</label>
                <input
                  type="date"
                  value={p.birthDate}
                  onChange={(e) => updateParticipant(p.key, { birthDate: e.target.value })}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground">Route</label>
                <select
                  value={p.routeId}
                  onChange={(e) => updateParticipant(p.key, { routeId: e.target.value })}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Kies een route</option>
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {String(r.distance).replace('.', ',')} km — {r.title}
                    </option>
                  ))}
                </select>
              </div>

              {options.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-foreground">Extra&apos;s</span>
                  {options.map((o) => (
                    <div key={o.id} className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={p.optionIds.includes(o.id)}
                          onChange={() => toggleOption(p.key, o.id)}
                        />
                        {o.label} (+€{Number(o.price).toFixed(2)})
                      </label>
                      {o.requiresInput &&
                        p.optionIds.includes(o.id) &&
                        renderOptionInputs(
                          [o.id],
                          (optId, value) => setParticipantOptionInput(p.key, optId, value),
                          p.optionInputs,
                        )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <Button type="button" variant="outline" onClick={addParticipant} className="gap-2">
          <Plus className="h-4 w-4" />
          Nog een deelnemer toevoegen
        </Button>
      </div>

      {/* Totaal + submit */}
      <div className="flex flex-col gap-4 border-t border-dashed border-border pt-6">
        <div className="flex items-center justify-between text-lg font-bold text-foreground">
          <span>Totaal</span>
          <span>€{total.toFixed(2)}</span>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Bezig...' : 'Doorgaan naar betalen'}
        </Button>
      </div>
    </form>
  )
}
