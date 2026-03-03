/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Prevents your site from being embedded in an iframe on another site (clickjacking protection)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Stops browsers from guessing the file type of uploaded files (MIME sniffing protection)
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Controls how much referrer info is sent when clicking links
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disables access to camera, microphone, and geolocation APIs
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Forces HTTPS for 1 year (only active in production)
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
];

const nextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to every page and API route
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        // Allow images served from your own domain in production
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_APP_URL
          ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname
          : 'localhost',
      },
      {
        // Allow localhost for local development
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

module.exports = nextConfig;
