'use server'

import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

type LoginResult = { success: true; role: string } | { success: false; error: string }

export async function loginAction(
  email: string,
  password: string,
  rememberMe: boolean,
): Promise<LoginResult> {
  const payload = await getPayload({ config })

  try {
    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    if (!result.token) {
      return { success: false, error: 'E-mailadres of wachtwoord onjuist.' }
    }

    const cookieStore = await cookies()

    cookieStore.set('payload-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      // Alleen bij "onthoud mij" een maxAge meegeven, anders wordt het
      // automatisch een sessie-cookie die verdwijnt bij het sluiten van de browser.
      ...(rememberMe ? { maxAge: 60 * 60 * 24 } : {}),
    })

    return { success: true, role: (result.user as any).role }
  } catch {
    return { success: false, error: 'E-mailadres of wachtwoord onjuist.' }
  }
}
