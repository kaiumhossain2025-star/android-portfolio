-- Fix for "Could not find table public.profiles" or missing "created_at" column error
-- Run this snippet to specifically fix the User Profiles table.

-- 1. Drop existing policies to avoid errors during drop
DROP POLICY IF EXISTS "Users own profile" ON "public"."profiles";
DROP POLICY IF EXISTS "Public read profiles" ON "public"."profiles";
DROP POLICY IF EXISTS "Users update own profile" ON "public"."profiles";

-- 2. Drop the table (CASCADE will remove dependent objects like policies/triggers)
DROP TABLE IF EXISTS "public"."profiles" CASCADE;

-- 3. Re-create the table with the 'created_at' column
CREATE TABLE "public"."profiles" (
    "id" uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    "email" text,
    "role" text DEFAULT 'user',
    "name" text,
    "avatar_url" text,
    "created_at" timestamp with time zone DEFAULT now(), -- This was missing
    PRIMARY KEY ("id")
);

-- 4. Enable RLS
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

-- 5. Re-apply Policies
CREATE POLICY "Users own profile" ON "public"."profiles" FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Public read profiles" ON "public"."profiles" FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON "public"."profiles" FOR UPDATE USING (auth.uid() = id);

-- 6. Refresh Cache
COMMENT ON TABLE "public"."profiles" IS 'Profiles Table - Fixed created_at';
