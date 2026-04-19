import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: process.env.IMAGE_HOSTNAME || "localhost" },
      { hostname: "res.cloudinary.com" }
    ]
  },
  pageExtensions: ["ts", "tsx"],
  webpack: (config) => {
    // Fix for @tabler/icons-react vendor chunks issue
    // Prevent Next.js from creating separate vendor chunks for @tabler
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
        },
      },
    };
    return config;
  }
};

export default withNextIntl(nextConfig);
