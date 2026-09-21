// app/(frontend)/account/wachtwoord-vergeten/[token]/page.tsx
import { getPayload } from 'payload'
import config from '@payload-config'

import { SetPasswordForm } from './SetPasswordForm'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ token: string }>
}

export default async function SetPasswordPage({ params }: Props) {
  const { token } = await params

  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'users',
    where: {
      resetPasswordToken: { equals: token },
    },
    limit: 1,
    depth: 0,
    showHiddenFields: true, // <-- dit ontbrak
  })

  const user = docs[0] as any

  const isExpired =
    !user?.resetPasswordExpiration || new Date(user.resetPasswordExpiration) < new Date()

  if (!user || isExpired) {
    return (
      <main className="mx-auto flex max-w-sm flex-col items-center gap-8 px-6 py-16 text-center">
        <h1 className="text-3xl font-bold">Link ongeldig of verlopen</h1>
        <p className="text-muted-foreground">
          Deze link om je wachtwoord in te stellen is niet meer geldig. Vraag een nieuwe aan.
        </p>

        <a
          href="/account/wachtwoord-vergeten"
          className="inline-block rounded-lg bg-primary px-5 py-3 text-primary-foreground"
        >
          Nieuwe link aanvragen
        </a>
      </main>
    )
  }

  return (
    <main className="mx-auto flex max-w-sm flex-col items-center gap-8 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Wachtwoord instellen</h1>
        <p className="mt-2 text-muted-foreground">
          Kies een nieuw wachtwoord om je account te activeren.
        </p>
      </div>

      <SetPasswordForm token={token} />
    </main>
  )
}
