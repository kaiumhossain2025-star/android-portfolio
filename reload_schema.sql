-- Force PostgREST schema cache reload
-- Run this if you see "Could not find table in schema cache" errors

NOTIFY pgrst, 'reload schema';
