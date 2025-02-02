import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  experimental: {
    // Experimental features
    optimizeCss: true,
    scrollRestoration: true,
    largePageDataBytes: 128 * 1000, // 128KB
  },
  // Ignore specific files/directories
  webpack: (config) => {
    config.ignoreWarnings = [
      { message: /Critical dependency/i },
      { message: /Failed to parse source map/i },
    ];
    return config;
  }
};

export default nextConfig;