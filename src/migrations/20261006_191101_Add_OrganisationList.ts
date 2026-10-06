import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_organization_group" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_organization_group" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "vrijwilliger_posities" ADD COLUMN "list_visability" boolean DEFAULT false;
  ALTER TABLE "personen" ADD COLUMN "list_visability" boolean DEFAULT false;
  ALTER TABLE "personen" ADD COLUMN "foto_id" integer;
  ALTER TABLE "personen" ADD COLUMN "foto_toestemming" boolean DEFAULT false;
  ALTER TABLE "personen" ADD COLUMN "volgorde" numeric DEFAULT 0;
  ALTER TABLE "pages_blocks_organization_group" ADD CONSTRAINT "pages_blocks_organization_group_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_organization_group" ADD CONSTRAINT "_pages_v_blocks_organization_group_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_organization_group_order_idx" ON "pages_blocks_organization_group" USING btree ("_order");
  CREATE INDEX "pages_blocks_organization_group_parent_id_idx" ON "pages_blocks_organization_group" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_organization_group_path_idx" ON "pages_blocks_organization_group" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_organization_group_order_idx" ON "_pages_v_blocks_organization_group" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_organization_group_parent_id_idx" ON "_pages_v_blocks_organization_group" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_organization_group_path_idx" ON "_pages_v_blocks_organization_group" USING btree ("_path");
  ALTER TABLE "personen" ADD CONSTRAINT "personen_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "personen_foto_idx" ON "personen" USING btree ("foto_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_organization_group" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_organization_group" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_organization_group" CASCADE;
  DROP TABLE "_pages_v_blocks_organization_group" CASCADE;
  ALTER TABLE "personen" DROP CONSTRAINT "personen_foto_id_media_id_fk";
  
  DROP INDEX "personen_foto_idx";
  ALTER TABLE "vrijwilliger_posities" DROP COLUMN "list_visability";
  ALTER TABLE "personen" DROP COLUMN "list_visability";
  ALTER TABLE "personen" DROP COLUMN "foto_id";
  ALTER TABLE "personen" DROP COLUMN "foto_toestemming";
  ALTER TABLE "personen" DROP COLUMN "volgorde";`)
}
