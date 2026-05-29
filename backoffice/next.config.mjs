/** @type {import('next').NextConfig} */
const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

let remotePatterns = [
  { protocol: "https", hostname: "res.cloudinary.com" },
  { protocol: "http", hostname: "localhost" }
];

try {
  const { protocol, hostname } = new URL(strapiUrl);
  remotePatterns.push({
    protocol: protocol.replace(":", ""),
    hostname
  });
} catch {
  // ignore malformed url, fall back to defaults
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns
  }
};

export default nextConfig;
