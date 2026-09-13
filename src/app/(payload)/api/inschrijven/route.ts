import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import crypto from 'crypto'

import config from '@payload-config'
import { mollieClient } from '@/utilities/mollie'

type ParticipantInput = {
  name: string
  birthDate: string
  routeId: string
  optionIds: string[]
  optionInputs?: Record<string, string>
}

type RequestBody = {
  contactName: string
  contactEmail: string
  contactPhone?: string
  participants: ParticipantInput[]
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json()
    const { contactName, contactEmail, contactPhone, participants } = body

    if (!contactName || !contactEmail || !participants?.length) {
      return NextResponse.json({ error: 'Ontbrekende gegevens' }, { status: 400 })
    }

    if (participants.some((p) => !p.name || !p.birthDate || !p.routeId)) {
      return NextResponse.json(
        { error: 'Vul voor elke deelnemer naam, geboortedatum en route in.' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    const { docs: editions } = await payload.find({
      collection: 'edities',
      where: { active: { equals: true } },
      limit: 1,
    })
    const edition = editions[0] as any
    if (!edition) {
      return NextResponse.json({ error: 'Geen actieve editie gevonden' }, { status: 400 })
    }

    const { docs: existingKlanten } = await payload.find({
      collection: 'klanten',
      where: { email: { equals: contactEmail } },
      limit: 1,
    })

    let klant = existingKlanten[0] as any
    let newAccountCreated = false

    if (!klant) {
      const randomPassword = crypto.randomBytes(16).toString('hex')
      klant = await payload.create({
        collection: 'klanten',
        data: {
          name: contactName,
          email: contactEmail,
          password: randomPassword,
        },
      })
      newAccountCreated = true
    }

    const allOptionIds = Array.from(new Set(participants.flatMap((p) => p.optionIds || [])))
    const { docs: options } =
      allOptionIds.length > 0
        ? await payload.find({
            collection: 'prijs-opties',
            where: { id: { in: allOptionIds.map(Number) } },
            limit: 100,
          })
        : { docs: [] as any[] }

    const optionsById = new Map(options.map((o: any) => [String(o.id), o]))

    let totalAmount = 0
    const participantData = participants.map((p) => {
      const optionDocs = (p.optionIds || [])
        .map((id) => optionsById.get(String(id)))
        .filter(Boolean)
      const optionsTotal = optionDocs.reduce((sum, o: any) => sum + Number(o.price), 0)
      totalAmount += Number(edition.pricePerParticipant) + optionsTotal

      return {
        name: p.name,
        birthDate: p.birthDate,
        route: Number(p.routeId),
        selectedOptions: optionDocs.map((o: any) => ({
          option: Number(o.id),
          priceAtRegistration: o.price,
          inputValue: p.optionInputs?.[String(o.id)] || undefined,
        })),
      }
    })

    const registration = await payload.create({
      collection: 'inschrijvingen',
      data: {
        edition: edition.id,
        account: klant.id,
        contactName,
        contactEmail,
        contactPhone,
        status: 'pending',
        totalAmount,
        newAccountCreated,
      },
    })

    await Promise.all(
      participantData.map((p) =>
        payload.create({
          collection: 'deelnemers',
          data: {
            ...p,
            registration: registration.id,
          },
        }),
      ),
    )

    const payment = await mollieClient.payments.create({
      amount: {
        value: totalAmount.toFixed(2),
        currency: 'EUR',
      },
      description: `Inschrijving ${edition.title}`,
      redirectUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/inschrijven/bedankt?registration=${registration.id}`,
      webhookUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/inschrijven/webhook`,
      metadata: {
        registrationId: String(registration.id),
      },
    })

    await payload.update({
      collection: 'inschrijvingen',
      id: registration.id,
      data: {
        molliePaymentId: payment.id,
      },
    })

    return NextResponse.json({ checkoutUrl: payment.getCheckoutUrl() })
  } catch (error) {
    console.error('Inschrijving mislukt:', error)
    return NextResponse.json({ error: 'Er ging iets mis, probeer het opnieuw.' }, { status: 500 })
  }
}
