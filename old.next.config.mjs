/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    // Extract hostname for CSP (e.g., https://xyz.supabase.co)
    const supabaseDomain = supabaseUrl ? new URL(supabaseUrl).origin : '';
    const supabaseWss = supabaseDomain ? supabaseDomain.replace('https://', 'wss://') : '';

    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://images.unsplash.com ${supabaseDomain} https://lfbptxisrfcnkbehzmzi.supabase.co https://aijqpdyltuioagyesffe.supabase.co https://kdxckihjekccmaxywpsn.supabase.co;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      connect-src 'self' ${supabaseDomain} ${supabaseWss} https://lfbptxisrfcnkbehzmzi.supabase.co wss://lfbptxisrfcnkbehzmzi.supabase.co https://aijqpdyltuioagyesffe.supabase.co wss://aijqpdyltuioagyesffe.supabase.co https://kdxckihjekccmaxywpsn.supabase.co wss://kdxckihjekccmaxywpsn.supabase.co https://va.vercel-scripts.com;
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          }
        ],
      },
    ]
  },
}

export default nextConfig
