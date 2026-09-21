import type { TaskConfig } from 'payload'

export const cleanupOldRegistrations: TaskConfig<any> = {
  slug: 'cleanupOldRegistrations',
  retries: 1,
  inputSchema: [],
  outputSchema: [
    {
      name: 'editionsProcessed',
      type: 'number',
    },
    {
      name: 'registrationsAnonymized',
      type: 'number',
    },
  ],
  // Elke nacht om 03:00 automatisch een job inplannen op de 'cleanup'-queue.
  schedule: [
    {
      cron: '0 3 * * *',
      queue: 'cleanup',
    },
  ],
  handler: async ({ req }) => {
    const { payload } = req

    // Bewaartermijn: 1,5 jaar na het einde van de editie.
    const cutoff = new Date()
    cutoff.setMonth(cutoff.getMonth() - 18)

    const { docs: expiredEditions } = await payload.find({
      collection: 'edities',
      where: {
        endDate: { less_than_equal: cutoff.toISOString() },
      },
      limit: 100,
      req,
    })

    let registrationsAnonymized = 0

    for (const edition of expiredEditions) {
      const { docs: registrations } = await payload.find({
        collection: 'inschrijvingen',
        where: {
          edition: { equals: edition.id },
          personalDataRemoved: { not_equals: true },
        },
        limit: 200,
        req,
      })

      for (const registration of registrations) {
        // Alle deelnemersgegevens (naam, geboortedatum, route, opties) mogen
        // volledig verwijderd worden.
        await payload.delete({
          collection: 'deelnemers',
          where: { registration: { equals: registration.id } },
          req,
        })

        // De inschrijving zelf blijft bestaan (bedrag, status, editie — fiscale
        // bewaarplicht van 7 jaar), maar de persoonsgegevens worden geanonimiseerd.
        await payload.update({
          collection: 'inschrijvingen',
          id: registration.id,
          data: {
            contactName: 'Verwijderd',
            contactEmail: `verwijderd+${registration.id}@geanonimiseerd.invalid`,
            contactPhone: null,
            personalDataRemoved: true,
          },
          req,
        })

        registrationsAnonymized += 1
      }
    }

    return {
      output: {
        editionsProcessed: expiredEditions.length,
        registrationsAnonymized,
      },
    }
  },
}
