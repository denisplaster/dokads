import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // catches broken internal links at build time
  typedRoutes: true,
  // pin the workspace root; there is an unrelated package-lock.json in $HOME
  turbopack: { root: __dirname },
}

export default nextConfig
