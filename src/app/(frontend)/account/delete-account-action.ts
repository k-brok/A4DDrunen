'use server'

import { cookies, headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function deleteAccountAction() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers })

  if (!user || (user as any).role !== 'klant') {
    redirect('/account/inloggen')
  }

  await payload.delete({
    collection: 'users',
    id: user.id,
  })

  const cookieStore = await cookies()
  cookieStore.delete('payload-token')

  redirect('/?accountverwijderd=1')
}
