import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/introduction",
      destination: "/docs/introduction",
      permanent: true,
    },
    {
      source: "/installation",
      destination: "/docs/installation",
      permanent: true,
    },
    {
      source: "/widgets/:slug*",
      destination: "/docs/widgets/:slug*",
      permanent: true,
    },
    {
      source: "/registry/:slug*",
      destination: "/docs/widgets/:slug*",
      permanent: true,
    },
  ],
};

const withMDX = createMDX();

export default withMDX(nextConfig);
