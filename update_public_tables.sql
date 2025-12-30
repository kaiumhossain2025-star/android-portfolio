-- TARGETED FIX: Profiles and Products with explicit 'public' schema

----------- [1. PUBLIC.PROFILES] -----------

-- Ensure Table Exists
CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    "email" text,
    "role" text DEFAULT 'user',
    "name" text,
    "avatar_url" text,
    "created_at" timestamp with time zone DEFAULT now(),
    PRIMARY KEY ("id")
);

-- RLS & Policies
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read profiles" ON "public"."profiles";
CREATE POLICY "Public read profiles" ON "public"."profiles" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users own profile" ON "public"."profiles";
CREATE POLICY "Users own profile" ON "public"."profiles" FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile" ON "public"."profiles";
CREATE POLICY "Users update own profile" ON "public"."profiles" FOR UPDATE USING (auth.uid() = id);

-- Populate Data (Backfill from auth.users)
INSERT INTO "public"."profiles" ("id", "email", "role", "name", "created_at")
SELECT 
    au.id,
    au.email,
    'user', 
    COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', ''),
    au.created_at
FROM auth.users au
LEFT JOIN "public"."profiles" p ON p.id = au.id
WHERE p.id IS NULL;


----------- [2. PUBLIC.PRODUCTS] -----------

-- Ensure Table Exists
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

-- RLS & Policies
ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read products" ON "public"."products";
CREATE POLICY "Public read products" ON "public"."products" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin products" ON "public"."products";
CREATE POLICY "Admin products" ON "public"."products" FOR ALL USING (auth.role() = 'authenticated');

-- Populate Data (If empty)
INSERT INTO "public"."products" ("id", "title", "short_description", "price", "image_url")
SELECT 'p1', 'Example Product', 'An example product description.', 99.99, 'https://via.placeholder.com/150'
WHERE NOT EXISTS (SELECT 1 FROM "public"."products");


----------- [3. REFRESH CACHE] -----------
NOTIFY pgrst, 'reload schema';
