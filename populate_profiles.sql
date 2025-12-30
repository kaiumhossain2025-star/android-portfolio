-- 1. Ensure the profiles table exists
CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    "email" text,
    "role" text DEFAULT 'user',
    "name" text,
    "avatar_url" text,
    "created_at" timestamp with time zone DEFAULT now(),
    PRIMARY KEY ("id")
);

-- 2. Enable RLS
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

-- 3. Re-apply Policies
DROP POLICY IF EXISTS "Public read profiles" ON "public"."profiles";
CREATE POLICY "Public read profiles" ON "public"."profiles" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users own profile" ON "public"."profiles";
CREATE POLICY "Users own profile" ON "public"."profiles" FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile" ON "public"."profiles";
CREATE POLICY "Users update own profile" ON "public"."profiles" FOR UPDATE USING (auth.uid() = id);

-- 4. Create Trigger Function to handle new user signups automatically
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    'user',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.created_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. POPULATE PROFILES from auth.users (for existing users who missed the trigger)
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

-- 7. Force Schema Cache Reload
NOTIFY pgrst, 'reload schema';
