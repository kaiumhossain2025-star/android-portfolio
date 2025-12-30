-- Force creation of products table and refresh cache

-- 1. Create table if not exists (Standard definition)
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

-- 2. Enable RLS
ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;

-- 3. Reset Policies (Fixes permissions)
DROP POLICY IF EXISTS "Public read products" ON "public"."products";
CREATE POLICY "Public read products" ON "public"."products" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin products" ON "public"."products";
CREATE POLICY "Admin products" ON "public"."products" FOR ALL USING (auth.role() = 'authenticated');

-- 4. Force Schema Cache Reload (Workaround: trivial comment on table)
COMMENT ON TABLE "public"."products" IS 'Products table - Refreshed Cache';
