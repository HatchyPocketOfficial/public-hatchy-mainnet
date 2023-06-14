/** @type {import('next').NextConfig} */
const securityHeaders = [
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  }  
]
module.exports = {
  async headers(){
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  reactStrictMode: true,
  images:{
    domains:['hatchypocket.com', 'account-test.hatchypocket.com', 'localhost']
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  }
}
