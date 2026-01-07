// vite.config.ts (TanStack Start RC)
import { defineConfig } from "vite";
import type { PluginOption } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import contentCollections from "@content-collections/vite"; // ⬅️ was @content-collections/vinxi
import { visualizer } from "rollup-plugin-visualizer";
import viteReact from "@vitejs/plugin-react";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";

const analyze = process.env.ANALYZE === "true";

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
      // RC uses a Vite-native src layout. Keep your routes in src/app:
      srcDirectory: "src", // default in RC
      router: { routesDirectory: "app" }, // means your routes live at src/app/*
      prerender: {
        enabled: false,
        crawlLinks: true,
        filter: ({ path }) => path.startsWith("/blog/"),

        // filter: ({ path }) => path.startsWith("/blog/"),
        onSuccess: ({ page }) => {
          console.log(`Rendered ${page.path}!`);
        },
      },
      // pages: [{ path: "/", prerender: { enabled: true } }],
    }),
    // For Vercel (Nitro app) — Vercel can auto-detect Nitro, but you can be explicit:
    nitroV2Plugin({
      preset: "vercel",
      nodeModulesDirs: ["./node_modules/@libsql"],
      routeRules: {
        "/_server/**": { headers: { "cache-control": "no-cache" } },
      },
      storage: {
        cache: {
          driver: "fs",
          base: "/tmp/nitro/cache",
        },
        "nitro:cache": {
          driver: "fs",
          base: "/tmp/nitro/cache",
        },
      },
    }),
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
