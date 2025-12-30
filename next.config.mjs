/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: https://lfbptxisrfcnkbehzmzi.supabase.co https://aijqpdyltuioagyesffe.supabase.co;
              font-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              connect-src 'self' https://lfbptxisrfcnkbehzmzi.supabase.co wss://lfbptxisrfcnkbehzmzi.supabase.co https://aijqpdyltuioagyesffe.supabase.co wss://aijqpdyltuioagyesffe.supabase.co https://va.vercel-scripts.com;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ],
      },
    ]
  },
}

export default nextConfig
