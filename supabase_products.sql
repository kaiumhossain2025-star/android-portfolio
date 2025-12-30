
-- Create products table
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

-- Enable RLS
ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public read products" ON "public"."products";
DROP POLICY IF EXISTS "Admin all products" ON "public"."products";

CREATE POLICY "Public read products" ON "public"."products" FOR SELECT USING (true);
CREATE POLICY "Admin all products" ON "public"."products" FOR ALL USING (auth.role() = 'authenticated');

-- Data for products
INSERT INTO "public"."products" ("id", "title", "short_description", "details", "image_url", "price", "features", "order_index") VALUES 
('p1', 'Premium UI Kit', 'A comprehensive UI kit for modern web applications.', 'Accelerate your development with our Premium UI Kit. It includes over 500+ customizable components, dark mode support, and Figma design files. Perfect for SaaS dashboards and landing pages.', 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e', 49.99, ARRAY['500+ Components', 'Figma Files Included', 'React & Vue Support', 'Dark Mode Ready'], 1) ON CONFLICT DO NOTHING;

INSERT INTO "public"."products" ("id", "title", "short_description", "details", "image_url", "price", "features", "order_index") VALUES 
('p2', 'E-commerce Starter', 'Full-stack e-commerce template with Stripe integration.', 'Launch your online store in days, not months. This starter kit comes with a fully functional shopping cart, checkout flow with Stripe, admin panel for product management, and optimized SEO.', 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d', 199.00, ARRAY['Next.js & Supabase', 'Stripe Integration', 'Admin Dashboard', 'Mobile Optimized'], 2) ON CONFLICT DO NOTHING;

INSERT INTO "public"."products" ("id", "title", "short_description", "details", "image_url", "price", "features", "order_index") VALUES 
('p3', 'SaaS Boilerplate', 'The ultimate production-ready SaaS boilerplate.', 'Everything you need to build and launch your SaaS. User authentication, subscription management, team invites, and email notifications are all set up out of the box.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', 299.00, ARRAY['Auth & User Mgmt', 'Subscriptions (Stripe)', 'Team & Roles', 'Email System'], 3) ON CONFLICT DO NOTHING;

INSERT INTO "public"."products" ("id", "title", "short_description", "details", "image_url", "price", "features", "order_index") VALUES 
('p4', 'Mobile App Template', 'Cross-platform mobile app template for React Native.', 'Build beautiful native mobile apps for iOS and Android using a single codebase. Includes pre-built screens for Login, Profile, Settings, and more. Smooth animations and native performance.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', 79.00, ARRAY['React Native / Expo', 'iOS & Android', 'Pre-built Screens', 'Smooth Animations'], 4) ON CONFLICT DO NOTHING;
