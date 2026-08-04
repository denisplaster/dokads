import type { NextConfig } from 'next'

const usingLocalFileDb = (process.env.DATABASE_URL ?? '').startsWith('pglite://')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // catches broken internal links at build time
  typedRoutes: true,
  // pin the workspace root; there is an unrelated package-lock.json in $HOME
  turbopack: { root: __dirname },
  // local-dev-only database driver — never bundled
  serverExternalPackages: ['@electric-sql/pglite'],
  // PGlite is a single-process file database; parallel prerender workers each
  // open their own handle and abort. Only affects local builds.
  ...(usingLocalFileDb ? { experimental: { cpus: 1, workerThreads: false } } : {}),
}

export default nextConfig
