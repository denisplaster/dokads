CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"id_token" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_registrations" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text,
	"email" text NOT NULL,
	"age_range" text,
	"is_minor" boolean DEFAULT false NOT NULL,
	"city" text,
	"connection" text,
	"accessibility" text,
	"dietary" text,
	"wants_updates" boolean DEFAULT false NOT NULL,
	"agreed_guidelines" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'registered' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"blurb" text DEFAULT '' NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"date" text NOT NULL,
	"backup_date" text,
	"time" text DEFAULT '' NOT NULL,
	"timezone" text DEFAULT '' NOT NULL,
	"region_slug" text DEFAULT 'online' NOT NULL,
	"venue_kind" text DEFAULT 'online' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"format" text DEFAULT 'online' NOT NULL,
	"audience" text DEFAULT 'open to all' NOT NULL,
	"age_policy" text DEFAULT 'all ages' NOT NULL,
	"cost" text DEFAULT 'Free' NOT NULL,
	"plus_ones" boolean DEFAULT true NOT NULL,
	"capacity" integer,
	"waitlist" boolean DEFAULT false NOT NULL,
	"min_age" integer,
	"guardian_consent_under" integer,
	"deadline" text,
	"perk" text,
	"tentative_notes" jsonb DEFAULT '[]'::jsonb,
	"needs_food_info" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"connection" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"description" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"interests" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"timing" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"venues" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"region_slug" text,
	"age_range" text,
	"is_minor" boolean DEFAULT false NOT NULL,
	"wants_updates" boolean DEFAULT false NOT NULL,
	"wants_local" boolean DEFAULT false NOT NULL,
	"wants_volunteer" boolean DEFAULT false NOT NULL,
	"agreed_guidelines" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"slug" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"country" text NOT NULL,
	"status" text DEFAULT 'interest' NOT NULL,
	"intro" text,
	"organisers" jsonb DEFAULT '[]'::jsonb,
	"socials" jsonb DEFAULT '[]'::jsonb,
	"updates" jsonb DEFAULT '[]'::jsonb,
	"sort_order" integer DEFAULT 100 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"blurb" text DEFAULT '' NOT NULL,
	"format" text DEFAULT 'read' NOT NULL,
	"audience" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"badge" text,
	"card" text DEFAULT 'index' NOT NULL,
	"link" text,
	"status" text DEFAULT 'open call' NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 100 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "stories" (
	"slug" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"dek" text DEFAULT '' NOT NULL,
	"kind" text DEFAULT 'essay' NOT NULL,
	"byline" text DEFAULT 'Anonymous' NOT NULL,
	"byline_style" text DEFAULT 'anonymous' NOT NULL,
	"location" text,
	"issue" text DEFAULT '001' NOT NULL,
	"reading_time" integer DEFAULT 3 NOT NULL,
	"pullquote" text,
	"art" text,
	"featured" boolean DEFAULT false NOT NULL,
	"body" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"is_placeholder" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"name" text,
	"email" text,
	"subject" text DEFAULT '' NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'organiser' NOT NULL,
	"region_slug" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "event_reg_unique_idx" ON "event_registrations" USING btree ("event_id","email");--> statement-breakpoint
CREATE INDEX "event_reg_event_idx" ON "event_registrations" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "events_status_date_idx" ON "events" USING btree ("status","date");--> statement-breakpoint
CREATE INDEX "events_region_idx" ON "events" USING btree ("region_slug");--> statement-breakpoint
CREATE UNIQUE INDEX "members_email_idx" ON "members" USING btree ("email");--> statement-breakpoint
CREATE INDEX "members_region_idx" ON "members" USING btree ("region_slug");--> statement-breakpoint
CREATE INDEX "submissions_kind_status_idx" ON "submissions" USING btree ("kind","status");