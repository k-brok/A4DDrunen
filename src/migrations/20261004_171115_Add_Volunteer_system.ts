import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "personen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"account_id" integer,
  	"contactgegevens_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vrijwilliger_toewijzingen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"edition_id" integer NOT NULL,
  	"persoon_id" integer NOT NULL,
  	"positie_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vrijwilliger_behoeften" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"edition_id" integer NOT NULL,
  	"dag_id" integer NOT NULL,
  	"positie_id" integer NOT NULL,
  	"aantal_benodigd" numeric DEFAULT 1 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vrijwilliger_behoeften_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"routes_id" integer
  );
  
  CREATE TABLE "vrijwilliger_diensten" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"behoefte_id" integer NOT NULL,
  	"persoon_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "personen_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "vrijwilliger_toewijzingen_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "vrijwilliger_behoeften_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "vrijwilliger_diensten_id" integer;
  ALTER TABLE "personen" ADD CONSTRAINT "personen_account_id_users_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "personen" ADD CONSTRAINT "personen_contactgegevens_id_contactgegevens_id_fk" FOREIGN KEY ("contactgegevens_id") REFERENCES "public"."contactgegevens"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vrijwilliger_toewijzingen" ADD CONSTRAINT "vrijwilliger_toewijzingen_edition_id_edities_id_fk" FOREIGN KEY ("edition_id") REFERENCES "public"."edities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vrijwilliger_toewijzingen" ADD CONSTRAINT "vrijwilliger_toewijzingen_persoon_id_personen_id_fk" FOREIGN KEY ("persoon_id") REFERENCES "public"."personen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vrijwilliger_toewijzingen" ADD CONSTRAINT "vrijwilliger_toewijzingen_positie_id_vrijwilliger_posities_id_fk" FOREIGN KEY ("positie_id") REFERENCES "public"."vrijwilliger_posities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vrijwilliger_behoeften" ADD CONSTRAINT "vrijwilliger_behoeften_edition_id_edities_id_fk" FOREIGN KEY ("edition_id") REFERENCES "public"."edities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vrijwilliger_behoeften" ADD CONSTRAINT "vrijwilliger_behoeften_dag_id_dagen_id_fk" FOREIGN KEY ("dag_id") REFERENCES "public"."dagen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vrijwilliger_behoeften" ADD CONSTRAINT "vrijwilliger_behoeften_positie_id_vrijwilliger_posities_id_fk" FOREIGN KEY ("positie_id") REFERENCES "public"."vrijwilliger_posities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vrijwilliger_behoeften_rels" ADD CONSTRAINT "vrijwilliger_behoeften_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."vrijwilliger_behoeften"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vrijwilliger_behoeften_rels" ADD CONSTRAINT "vrijwilliger_behoeften_rels_routes_fk" FOREIGN KEY ("routes_id") REFERENCES "public"."routes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vrijwilliger_diensten" ADD CONSTRAINT "vrijwilliger_diensten_behoefte_id_vrijwilliger_behoeften_id_fk" FOREIGN KEY ("behoefte_id") REFERENCES "public"."vrijwilliger_behoeften"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vrijwilliger_diensten" ADD CONSTRAINT "vrijwilliger_diensten_persoon_id_personen_id_fk" FOREIGN KEY ("persoon_id") REFERENCES "public"."personen"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "personen_account_idx" ON "personen" USING btree ("account_id");
  CREATE INDEX "personen_contactgegevens_idx" ON "personen" USING btree ("contactgegevens_id");
  CREATE INDEX "personen_updated_at_idx" ON "personen" USING btree ("updated_at");
  CREATE INDEX "personen_created_at_idx" ON "personen" USING btree ("created_at");
  CREATE INDEX "vrijwilliger_toewijzingen_edition_idx" ON "vrijwilliger_toewijzingen" USING btree ("edition_id");
  CREATE INDEX "vrijwilliger_toewijzingen_persoon_idx" ON "vrijwilliger_toewijzingen" USING btree ("persoon_id");
  CREATE INDEX "vrijwilliger_toewijzingen_positie_idx" ON "vrijwilliger_toewijzingen" USING btree ("positie_id");
  CREATE INDEX "vrijwilliger_toewijzingen_updated_at_idx" ON "vrijwilliger_toewijzingen" USING btree ("updated_at");
  CREATE INDEX "vrijwilliger_toewijzingen_created_at_idx" ON "vrijwilliger_toewijzingen" USING btree ("created_at");
  CREATE INDEX "vrijwilliger_behoeften_edition_idx" ON "vrijwilliger_behoeften" USING btree ("edition_id");
  CREATE INDEX "vrijwilliger_behoeften_dag_idx" ON "vrijwilliger_behoeften" USING btree ("dag_id");
  CREATE INDEX "vrijwilliger_behoeften_positie_idx" ON "vrijwilliger_behoeften" USING btree ("positie_id");
  CREATE INDEX "vrijwilliger_behoeften_updated_at_idx" ON "vrijwilliger_behoeften" USING btree ("updated_at");
  CREATE INDEX "vrijwilliger_behoeften_created_at_idx" ON "vrijwilliger_behoeften" USING btree ("created_at");
  CREATE INDEX "vrijwilliger_behoeften_rels_order_idx" ON "vrijwilliger_behoeften_rels" USING btree ("order");
  CREATE INDEX "vrijwilliger_behoeften_rels_parent_idx" ON "vrijwilliger_behoeften_rels" USING btree ("parent_id");
  CREATE INDEX "vrijwilliger_behoeften_rels_path_idx" ON "vrijwilliger_behoeften_rels" USING btree ("path");
  CREATE INDEX "vrijwilliger_behoeften_rels_routes_id_idx" ON "vrijwilliger_behoeften_rels" USING btree ("routes_id");
  CREATE INDEX "vrijwilliger_diensten_behoefte_idx" ON "vrijwilliger_diensten" USING btree ("behoefte_id");
  CREATE INDEX "vrijwilliger_diensten_persoon_idx" ON "vrijwilliger_diensten" USING btree ("persoon_id");
  CREATE INDEX "vrijwilliger_diensten_updated_at_idx" ON "vrijwilliger_diensten" USING btree ("updated_at");
  CREATE INDEX "vrijwilliger_diensten_created_at_idx" ON "vrijwilliger_diensten" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_personen_fk" FOREIGN KEY ("personen_id") REFERENCES "public"."personen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vrijwilliger_toewijzingen_fk" FOREIGN KEY ("vrijwilliger_toewijzingen_id") REFERENCES "public"."vrijwilliger_toewijzingen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vrijwilliger_behoeften_fk" FOREIGN KEY ("vrijwilliger_behoeften_id") REFERENCES "public"."vrijwilliger_behoeften"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vrijwilliger_diensten_fk" FOREIGN KEY ("vrijwilliger_diensten_id") REFERENCES "public"."vrijwilliger_diensten"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_personen_id_idx" ON "payload_locked_documents_rels" USING btree ("personen_id");
  CREATE INDEX "payload_locked_documents_rels_vrijwilliger_toewijzingen__idx" ON "payload_locked_documents_rels" USING btree ("vrijwilliger_toewijzingen_id");
  CREATE INDEX "payload_locked_documents_rels_vrijwilliger_behoeften_id_idx" ON "payload_locked_documents_rels" USING btree ("vrijwilliger_behoeften_id");
  CREATE INDEX "payload_locked_documents_rels_vrijwilliger_diensten_id_idx" ON "payload_locked_documents_rels" USING btree ("vrijwilliger_diensten_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "personen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vrijwilliger_toewijzingen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vrijwilliger_behoeften" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vrijwilliger_behoeften_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vrijwilliger_diensten" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "personen" CASCADE;
  DROP TABLE "vrijwilliger_toewijzingen" CASCADE;
  DROP TABLE "vrijwilliger_behoeften" CASCADE;
  DROP TABLE "vrijwilliger_behoeften_rels" CASCADE;
  DROP TABLE "vrijwilliger_diensten" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_personen_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_vrijwilliger_toewijzingen_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_vrijwilliger_behoeften_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_vrijwilliger_diensten_fk";
  
  DROP INDEX "payload_locked_documents_rels_personen_id_idx";
  DROP INDEX "payload_locked_documents_rels_vrijwilliger_toewijzingen__idx";
  DROP INDEX "payload_locked_documents_rels_vrijwilliger_behoeften_id_idx";
  DROP INDEX "payload_locked_documents_rels_vrijwilliger_diensten_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "personen_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "vrijwilliger_toewijzingen_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "vrijwilliger_behoeften_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "vrijwilliger_diensten_id";`)
}
