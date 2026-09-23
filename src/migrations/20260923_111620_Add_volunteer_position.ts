import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_vrijwilliger_posities_icon_type" AS ENUM('emoji', 'media');
  CREATE TABLE "pages_blocks_volunteer_positions_group" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_volunteer_positions_group" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "vrijwilliger_posities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"icon_type" "enum_vrijwilliger_posities_icon_type" DEFAULT 'emoji',
  	"emoji" varchar,
  	"icon_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "vrijwilliger_posities_id" integer;
  ALTER TABLE "pages_blocks_volunteer_positions_group" ADD CONSTRAINT "pages_blocks_volunteer_positions_group_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_volunteer_positions_group" ADD CONSTRAINT "_pages_v_blocks_volunteer_positions_group_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vrijwilliger_posities" ADD CONSTRAINT "vrijwilliger_posities_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_volunteer_positions_group_order_idx" ON "pages_blocks_volunteer_positions_group" USING btree ("_order");
  CREATE INDEX "pages_blocks_volunteer_positions_group_parent_id_idx" ON "pages_blocks_volunteer_positions_group" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_volunteer_positions_group_path_idx" ON "pages_blocks_volunteer_positions_group" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_volunteer_positions_group_order_idx" ON "_pages_v_blocks_volunteer_positions_group" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_volunteer_positions_group_parent_id_idx" ON "_pages_v_blocks_volunteer_positions_group" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_volunteer_positions_group_path_idx" ON "_pages_v_blocks_volunteer_positions_group" USING btree ("_path");
  CREATE INDEX "vrijwilliger_posities_icon_idx" ON "vrijwilliger_posities" USING btree ("icon_id");
  CREATE INDEX "vrijwilliger_posities_updated_at_idx" ON "vrijwilliger_posities" USING btree ("updated_at");
  CREATE INDEX "vrijwilliger_posities_created_at_idx" ON "vrijwilliger_posities" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vrijwilliger_posities_fk" FOREIGN KEY ("vrijwilliger_posities_id") REFERENCES "public"."vrijwilliger_posities"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_vrijwilliger_posities_id_idx" ON "payload_locked_documents_rels" USING btree ("vrijwilliger_posities_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_volunteer_positions_group" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_volunteer_positions_group" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vrijwilliger_posities" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_volunteer_positions_group" CASCADE;
  DROP TABLE "_pages_v_blocks_volunteer_positions_group" CASCADE;
  DROP TABLE "vrijwilliger_posities" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_vrijwilliger_posities_fk";
  
  DROP INDEX "payload_locked_documents_rels_vrijwilliger_posities_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "vrijwilliger_posities_id";
  DROP TYPE "public"."enum_vrijwilliger_posities_icon_type";`)
}
