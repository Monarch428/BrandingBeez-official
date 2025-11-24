CREATE TABLE "case_studies" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_page" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"client" varchar(255) NOT NULL,
	"industry" varchar(100) NOT NULL,
	"results" jsonb NOT NULL,
	"description" text,
	"image_url" varchar(500),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"messages" jsonb DEFAULT '[]'::jsonb,
	"client_info" jsonb,
	"recommendations" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chat_sessions_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"phone" text,
	"website" text,
	"status" text DEFAULT 'pending',
	"region" text DEFAULT 'US',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clients_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"company" text,
	"inquiry_type" text NOT NULL,
	"message" text NOT NULL,
	"preferred_contact" text NOT NULL,
	"agency_name" text,
	"country" text NOT NULL,
	"top_priority" text NOT NULL,
	"coupon_code" text,
	"services_selected" jsonb,
	"budget" text,
	"timeline" text,
	"referral_source" text,
	"service_details" jsonb,
	"automation_details" jsonb,
	"dedicated_resource_details" jsonb,
	"website_details" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupon_usage" (
	"id" serial PRIMARY KEY NOT NULL,
	"coupon_id" integer,
	"email" text NOT NULL,
	"used_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"description" text NOT NULL,
	"discount_percentage" integer NOT NULL,
	"max_uses" integer DEFAULT 1,
	"current_uses" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	CONSTRAINT "coupons_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "dedicated_resources_leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"resource_type" varchar(100) NOT NULL,
	"hiring_level" varchar(100),
	"multiple_resources" jsonb,
	"additional_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "featured_clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_page" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"logo" varchar(500),
	"website" varchar(500),
	"description" text NOT NULL,
	"achievements" jsonb NOT NULL,
	"industry" varchar(100) NOT NULL,
	"timeframe" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pricing_packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_page" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"price" varchar(100) NOT NULL,
	"description" text,
	"features" jsonb NOT NULL,
	"is_popular" boolean DEFAULT false,
	"order_index" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "seo_audits" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer,
	"website_url" text NOT NULL,
	"audit_data" jsonb,
	"score" integer,
	"status" text DEFAULT 'pending',
	"recommendations" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "service_pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"subtitle" varchar(500),
	"description" text,
	"hero_title" varchar(255),
	"hero_subtitle" varchar(500),
	"audit_form_type" varchar(50),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "service_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "coupon_usage" ADD CONSTRAINT "coupon_usage_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seo_audits" ADD CONSTRAINT "seo_audits_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;