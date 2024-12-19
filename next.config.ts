import withPWA from "next-pwa";
import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/api/**",
      },
    ],
  },
};

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: isDevelopment,
  exclude: [
    // Add exclusions for development files
    /\.map$/,
    /asset-manifest\.json$/,
    /[\\/]dev-sw\.js$/,
    /[\\/]workbox-(.)*\.js$/,
  ],
})(nextConfig);

export default pwaConfig;
