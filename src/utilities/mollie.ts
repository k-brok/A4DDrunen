import createMollieClient, { type MollieClient } from '@mollie/api-client'

let _mollieClient: MollieClient | null = null

export function getMollieClient(): MollieClient {
  if (!_mollieClient) {
    const apiKey = process.env.MOLLIE_API_KEY

    if (!apiKey) {
      throw new Error('MOLLIE_API_KEY is not set')
    }

    _mollieClient = createMollieClient({ apiKey })
  }

  return _mollieClient
}
