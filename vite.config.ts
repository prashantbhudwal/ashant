// vite.config.ts (TanStack Start RC)
import { defineConfig } from "vite";
import type { PluginOption } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import contentCollections from "@content-collections/vite"; // ⬅️ was @content-collections/vinxi
import { visualizer } from "rollup-plugin-visualizer";
import viteReact from "@vitejs/plugin-react";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { nitro } from "nitro/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";

const analyze = process.env.ANALYZE === "true";

// Function to get all blog slugs for prerendering
// Reads the file system directly to avoid build artifacts issues
import fs from "node:fs";
import path from "node:path";

function getBlogRoutes() {
  const postsDir = path.resolve(__dirname, "src/content/posts");
  const routes = ["/"]; // Always prerender home

  if (!fs.existsSync(postsDir)) return routes;

  try {
    const files = fs
      .readdirSync(postsDir)
      .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));

    files.forEach((file) => {
      const content = fs.readFileSync(path.join(postsDir, file), "utf-8");
      const match = content.match(/slug:\s*([^\s]+)/);
      if (match && match[1]) {
        // Remove quotes if present
        const slug = match[1].replace(/['"]/g, "");
        routes.push(`/blog/${slug}`);
      }
    });

    console.log(`[vite] Found ${routes.length} routes to prerender`);
  } catch (e) {
    console.warn("[vite] Failed to read posts for prerendering:", e);
  }

  return routes;
}

const prerenderRoutes = getBlogRoutes();

export default defineConfig({
  server: {
    port: 1111,
  },
  ssr: {
    noExternal: [
      /react-tweet/,
      "wikipedia",
      /^wikipedia/,
      "@types/wikipedia",
      /^@mastra\/.*/,
    ],
    // external: ["@mastra/*"],
  },
  plugins: [
    contentCollections(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      srcDirectory: "src",
      router: { routesDirectory: "app" },
      prerender: {
        enabled: true,
        crawlLinks: true,
        filter: ({ path }) => !path.startsWith("/api"),
      },
      pages: [{ path: "/", prerender: { enabled: true } }],
    }),
    netlify(),
    viteReact(),
    ...(analyze
      ? [
          visualizer({
            filename: "dist/stats.html",
            open: true,
            gzipSize: true,
            brotliSize: true,
            template: "treemap",
          }),
        ]
      : []),
  ] as PluginOption[],
});
// // For Vercel (Nitro app) — Vercel can auto-detect Nitro, but you can be explicit:
// nitroV2Plugin({
//   preset: "vercel",
//   nodeModulesDirs: ["./node_modules/@libsql"],
//   routeRules: {
//     "/_server/**": { headers: { "cache-control": "no-cache" } },
//   },
//   storage: {
//     cache: {
//       driver: "fs",
//       base: "/tmp/nitro/cache",
//     },
//     "nitro:cache": {
//       driver: "fs",
//       base: "/tmp/nitro/cache",
//     },
//   },
// }),
