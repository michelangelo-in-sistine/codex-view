import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

const allowedDevOrigins = [
  ...new Set(
    Object.values(networkInterfaces())
      .flatMap((addresses) => addresses ?? [])
      .filter((address) => address.family === "IPv4" && !address.internal)
      .map((address) => address.address)
  )
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins
};

export default nextConfig;
