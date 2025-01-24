/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    unoptimized: true
  },
  experimental: {
    optimizeCss: true,
    turbo: {
      rules: {
        // Force Tailwind CSS to be processed by SWC
        '**/*.css': ['style']
      }
    }
  }
};

export default nextConfig;
