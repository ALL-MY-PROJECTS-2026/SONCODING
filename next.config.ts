import type { NextConfig } from "next";

// GitHub Pages serves this project at https://<owner>.github.io/SONCODING/
// so production builds need the "/SONCODING" base path. Dev keeps it empty
// so http://localhost:3000 works normally.
const isProd = process.env.NODE_ENV === "production";
const repo = "SONCODING";

const nextConfig: NextConfig = {
  output: "export", // static HTML export (no server) — required for GitHub Pages
  basePath: isProd ? `/${repo}` : "",
  trailingSlash: true, // emit /ko/contact/index.html so Pages serves clean URLs
  images: { unoptimized: true }, // no image optimization server on Pages
};

export default nextConfig;
