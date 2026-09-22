import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_incheckmomenten_type" AS ENUM('in', 'uit');
  ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE 'cleanupOldRegistrations' BEFORE 'schedulePublish';
  ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE 'cleanupOldRegistrations' BEFORE 'schedulePublish';
  CREATE TABLE "incheckmomenten" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"deelnemer_id" integer NOT NULL,
  	"dag_id" integer NOT NULL,
  	"type" "enum_incheckmomenten_type" NOT NULL,
  	"scanned_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_jobs_stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stats" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum_pages_hero_type";
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'logoHero', 'mediumImpact', 'lowImpact');
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::"public"."enum_pages_hero_type";
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'logoHero', 'mediumImpact', 'lowImpact');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "inschrijvingen" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "inschrijvingen" ALTER COLUMN "status" SET DEFAULT 'pending'::text;
  DROP TYPE "public"."enum_inschrijvingen_status";
  CREATE TYPE "public"."enum_inschrijvingen_status" AS ENUM('pending', 'paid', 'canceled', 'expired', 'failed');
  ALTER TABLE "inschrijvingen" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."enum_inschrijvingen_status";
  ALTER TABLE "inschrijvingen" ALTER COLUMN "status" SET DATA TYPE "public"."enum_inschrijvingen_status" USING "status"::"public"."enum_inschrijvingen_status";
  ALTER TABLE "sponsors" ADD COLUMN "ticket_assignment_count" numeric DEFAULT 0 NOT NULL;
  ALTER TABLE "edities" ADD COLUMN "participant_counter" numeric DEFAULT 0;
  ALTER TABLE "inschrijvingen" ADD COLUMN "confirmation_token" varchar;
  ALTER TABLE "inschrijvingen" ADD COLUMN "confirmation_token_expires_at" timestamp(3) with time zone;
  ALTER TABLE "inschrijvingen" ADD COLUMN "personal_data_removed" boolean DEFAULT false;
  ALTER TABLE "inschrijvingen" ADD COLUMN "privacy_accepted_at" timestamp(3) with time zone;
  ALTER TABLE "deelnemers" ADD COLUMN "sponsor_id" integer;
  ALTER TABLE "deelnemers" ADD COLUMN "participant_number" numeric;
  ALTER TABLE "deelnemers" ADD COLUMN "check_in_token" varchar;
  ALTER TABLE "payload_jobs" ADD COLUMN "meta" jsonb;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "incheckmomenten_id" integer;
  ALTER TABLE "incheckmomenten" ADD CONSTRAINT "incheckmomenten_deelnemer_id_deelnemers_id_fk" FOREIGN KEY ("deelnemer_id") REFERENCES "public"."deelnemers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "incheckmomenten" ADD CONSTRAINT "incheckmomenten_dag_id_dagen_id_fk" FOREIGN KEY ("dag_id") REFERENCES "public"."dagen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "incheckmomenten" ADD CONSTRAINT "incheckmomenten_scanned_by_id_users_id_fk" FOREIGN KEY ("scanned_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "incheckmomenten_deelnemer_idx" ON "incheckmomenten" USING btree ("deelnemer_id");
  CREATE INDEX "incheckmomenten_dag_idx" ON "incheckmomenten" USING btree ("dag_id");
  CREATE INDEX "incheckmomenten_scanned_by_idx" ON "incheckmomenten" USING btree ("scanned_by_id");
  CREATE INDEX "incheckmomenten_updated_at_idx" ON "incheckmomenten" USING btree ("updated_at");
  CREATE INDEX "incheckmomenten_created_at_idx" ON "incheckmomenten" USING btree ("created_at");
  ALTER TABLE "deelnemers" ADD CONSTRAINT "deelnemers_sponsor_id_sponsors_id_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."sponsors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_incheckmomenten_fk" FOREIGN KEY ("incheckmomenten_id") REFERENCES "public"."incheckmomenten"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "inschrijvingen_confirmation_token_idx" ON "inschrijvingen" USING btree ("confirmation_token");
  CREATE INDEX "deelnemers_sponsor_idx" ON "deelnemers" USING btree ("sponsor_id");
  CREATE UNIQUE INDEX "deelnemers_check_in_token_idx" ON "deelnemers" USING btree ("check_in_token");
  CREATE INDEX "payload_locked_documents_rels_incheckmomenten_id_idx" ON "payload_locked_documents_rels" USING btree ("incheckmomenten_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "incheckmomenten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs_stats" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "incheckmomenten" CASCADE;
  DROP TABLE "payload_jobs_stats" CASCADE;
  ALTER TABLE "deelnemers" DROP CONSTRAINT "deelnemers_sponsor_id_sponsors_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_incheckmomenten_fk";
  
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum_pages_hero_type";
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::"public"."enum_pages_hero_type";
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "inschrijvingen" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "inschrijvingen" ALTER COLUMN "status" SET DEFAULT 'pending'::text;
  DROP TYPE "public"."enum_inschrijvingen_status";
  CREATE TYPE "public"."enum_inschrijvingen_status" AS ENUM('pending', 'paid', 'cancelled');
  ALTER TABLE "inschrijvingen" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."enum_inschrijvingen_status";
  ALTER TABLE "inschrijvingen" ALTER COLUMN "status" SET DATA TYPE "public"."enum_inschrijvingen_status" USING "status"::"public"."enum_inschrijvingen_status";
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_log_task_slug" USING "task_slug"::"public"."enum_payload_jobs_log_task_slug";
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_task_slug" USING "task_slug"::"public"."enum_payload_jobs_task_slug";
  DROP INDEX "inschrijvingen_confirmation_token_idx";
  DROP INDEX "deelnemers_sponsor_idx";
  DROP INDEX "deelnemers_check_in_token_idx";
  DROP INDEX "payload_locked_documents_rels_incheckmomenten_id_idx";
  ALTER TABLE "sponsors" DROP COLUMN "ticket_assignment_count";
  ALTER TABLE "edities" DROP COLUMN "participant_counter";
  ALTER TABLE "inschrijvingen" DROP COLUMN "confirmation_token";
  ALTER TABLE "inschrijvingen" DROP COLUMN "confirmation_token_expires_at";
  ALTER TABLE "inschrijvingen" DROP COLUMN "personal_data_removed";
  ALTER TABLE "inschrijvingen" DROP COLUMN "privacy_accepted_at";
  ALTER TABLE "deelnemers" DROP COLUMN "sponsor_id";
  ALTER TABLE "deelnemers" DROP COLUMN "participant_number";
  ALTER TABLE "deelnemers" DROP COLUMN "check_in_token";
  ALTER TABLE "payload_jobs" DROP COLUMN "meta";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "incheckmomenten_id";
  DROP TYPE "public"."enum_incheckmomenten_type";`)
}
