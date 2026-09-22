import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_sponsors_card_background" AS ENUM('light', 'dark');
  ALTER TABLE "sponsors" ADD COLUMN "card_background" "enum_sponsors_card_background" DEFAULT 'light' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sponsors" DROP COLUMN "card_background";
  DROP TYPE "public"."enum_sponsors_card_background";`)
}
