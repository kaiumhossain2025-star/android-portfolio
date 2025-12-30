process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://kdxckihjekccmaxywpsn.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkeGNraWhqZWtjY21heHl3cHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDcwNzgsImV4cCI6MjA4MjY4MzA3OH0.R_qbMxaDWKE3HRNl9rFkIPDy-rRzroXU2hKgF6lBVm8'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkeGNraWhqZWtjY21heHl3cHNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzEwNzA3OCwiZXhwIjoyMDgyNjgzMDc4fQ.2fsGVhwFvF-4vhhGrxT4Q_Q4wt59Lr9Vwh16jgdyh7s'

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
