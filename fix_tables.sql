-- MASTER FIX SCRIPT
-- Run this to fix missing tables (profiles, products, services, etc.) and RLS issues.

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    "email" text,
    "role" text DEFAULT 'user',
    "name" text,
    "avatar_url" text,
    PRIMARY KEY ("id")
);

-- 2. Create Social Links Table
CREATE TABLE IF NOT EXISTS "public"."social_links" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "platform" text NOT NULL,
    "url" text NOT NULL,
    "icon_name" text,
    "order_index" integer DEFAULT 0,
    PRIMARY KEY ("id")
);

-- 3. Create Products Table
CREATE TABLE IF NOT EXISTS "public"."products" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "short_description" TEXT NOT NULL,
  "details" TEXT,
  "image_url" TEXT,
  "price" NUMERIC,
  "features" TEXT[],
  "created_at" TIMESTAMPTZ DEFAULT NOW(),
  "order_index" INTEGER DEFAULT 0
);

-- 4. Create Services Table
CREATE TABLE IF NOT EXISTS "public"."services" (
  "id" TEXT PRIMARY KEY, -- Slug
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "full_description" TEXT,
  "icon_name" TEXT,
  "icon_url" TEXT,
  "color_theme" TEXT,
  "features" TEXT[],
  "order_index" INTEGER DEFAULT 0,
  "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Testimonials Table
CREATE TABLE IF NOT EXISTS "public"."testimonials" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "role" TEXT,
  "content" TEXT NOT NULL,
  "image_url" TEXT,
  "rating" INTEGER DEFAULT 5,
  "created_at" TIMESTAMPTZ DEFAULT NOW()
);


-- 6. Enable RLS on ALL tables
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."social_links" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."services" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."testimonials" ENABLE ROW LEVEL SECURITY;


-- 7. Reset Policies (DROP and RE-CREATE)

-- Profiles
DROP POLICY IF EXISTS "Users own profile" ON "public"."profiles";
CREATE POLICY "Users own profile" ON "public"."profiles" FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Public read profiles" ON "public"."profiles";
CREATE POLICY "Public read profiles" ON "public"."profiles" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users update own profile" ON "public"."profiles";
CREATE POLICY "Users update own profile" ON "public"."profiles" FOR UPDATE USING (auth.uid() = id);

-- Socials
DROP POLICY IF EXISTS "Public read socials" ON "public"."social_links";
CREATE POLICY "Public read socials" ON "public"."social_links" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin socials" ON "public"."social_links";
CREATE POLICY "Admin socials" ON "public"."social_links" FOR ALL USING (auth.role() = 'authenticated');

-- Products
DROP POLICY IF EXISTS "Public read products" ON "public"."products";
CREATE POLICY "Public read products" ON "public"."products" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin products" ON "public"."products";
CREATE POLICY "Admin products" ON "public"."products" FOR ALL USING (auth.role() = 'authenticated');

-- Services
DROP POLICY IF EXISTS "Public read services" ON "public"."services";
CREATE POLICY "Public read services" ON "public"."services" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin services" ON "public"."services";
CREATE POLICY "Admin services" ON "public"."services" FOR ALL USING (auth.role() = 'authenticated');

-- Testimonials
DROP POLICY IF EXISTS "Public read testimonials" ON "public"."testimonials";
CREATE POLICY "Public read testimonials" ON "public"."testimonials" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin testimonials" ON "public"."testimonials";
CREATE POLICY "Admin testimonials" ON "public"."testimonials" FOR ALL USING (auth.role() = 'authenticated');


-- 8. Force Schema Cache Refresh
COMMENT ON TABLE "public"."profiles" IS 'Profiles Table - Refreshed';
COMMENT ON TABLE "public"."products" IS 'Products Table - Refreshed';
COMMENT ON TABLE "public"."services" IS 'Services Table - Refreshed';
