import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_info_card_background" AS ENUM('card', 'primary', 'secondary', 'accent', 'success');
  CREATE TYPE "public"."enum_pages_blocks_info_card_icon_type" AS ENUM('emoji', 'media');
  CREATE TYPE "public"."enum_pages_blocks_info_card_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_info_card_background" AS ENUM('card', 'primary', 'secondary', 'accent', 'success');
  CREATE TYPE "public"."enum__pages_v_blocks_info_card_icon_type" AS ENUM('emoji', 'media');
  CREATE TYPE "public"."enum__pages_v_blocks_info_card_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "pages_blocks_info_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background" "enum_pages_blocks_info_card_background" DEFAULT 'card',
  	"show_header" boolean DEFAULT false,
  	"icon_type" "enum_pages_blocks_info_card_icon_type" DEFAULT 'emoji',
  	"emoji" varchar,
  	"icon_id" integer,
  	"title" varchar,
  	"rich_text" jsonb,
  	"highlight_text" varchar,
  	"show_button" boolean DEFAULT false,
  	"link_type" "enum_pages_blocks_info_card_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_info_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background" "enum__pages_v_blocks_info_card_background" DEFAULT 'card',
  	"show_header" boolean DEFAULT false,
  	"icon_type" "enum__pages_v_blocks_info_card_icon_type" DEFAULT 'emoji',
  	"emoji" varchar,
  	"icon_id" integer,
  	"title" varchar,
  	"rich_text" jsonb,
  	"highlight_text" varchar,
  	"show_button" boolean DEFAULT false,
  	"link_type" "enum__pages_v_blocks_info_card_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_info_card" ADD CONSTRAINT "pages_blocks_info_card_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_card" ADD CONSTRAINT "pages_blocks_info_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_card" ADD CONSTRAINT "_pages_v_blocks_info_card_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_card" ADD CONSTRAINT "_pages_v_blocks_info_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_info_card_order_idx" ON "pages_blocks_info_card" USING btree ("_order");
  CREATE INDEX "pages_blocks_info_card_parent_id_idx" ON "pages_blocks_info_card" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_info_card_path_idx" ON "pages_blocks_info_card" USING btree ("_path");
  CREATE INDEX "pages_blocks_info_card_icon_idx" ON "pages_blocks_info_card" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_info_card_order_idx" ON "_pages_v_blocks_info_card" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_info_card_parent_id_idx" ON "_pages_v_blocks_info_card" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_info_card_path_idx" ON "_pages_v_blocks_info_card" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_info_card_icon_idx" ON "_pages_v_blocks_info_card" USING btree ("icon_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_info_card" CASCADE;
  DROP TABLE "_pages_v_blocks_info_card" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_info_card_background";
  DROP TYPE "public"."enum_pages_blocks_info_card_icon_type";
  DROP TYPE "public"."enum_pages_blocks_info_card_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_info_card_background";
  DROP TYPE "public"."enum__pages_v_blocks_info_card_icon_type";
  DROP TYPE "public"."enum__pages_v_blocks_info_card_link_type";`)
}
