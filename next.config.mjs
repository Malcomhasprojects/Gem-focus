/** @type {import('next').NextConfig} */
const staticExport = process.env.BUILD_STATIC === '1'

const nextConfig = {
  ...(staticExport
    ? {
        output: 'export',
        trailingSlash: true,
      }
    : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
