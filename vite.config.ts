import { defineConfig } from 'vite'
import type { PluginOption } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import contentCollections from '@content-collections/vite'
import { analyzer } from 'vite-bundle-analyzer'
import viteReact from '@vitejs/plugin-react'
import netlify from '@netlify/vite-plugin-tanstack-start'

const analyze = process.env.ANALYZE === 'true'

export default defineConfig(({ isSsrBuild }) => {
  return {
    server: {
      port: 1111,
    },
    ssr: {
      noExternal: [
        /react-tweet/,
        'wikipedia',
        /^wikipedia/,
        '@types/wikipedia',
        /^@mastra\/.*/,
      ],
    },
    plugins: [
      contentCollections(),
      tsConfigPaths({ projects: ['./tsconfig.json'] }),
      tanstackStart({
        srcDirectory: 'src',
        router: { routesDirectory: 'app' },
        prerender: {
          enabled: true,
          crawlLinks: true,
          filter: ({ path }) => !path.startsWith('/api'),
        },
        pages: [{ path: '/', prerender: { enabled: true } }],
      }),

      netlify(),
      viteReact(),
      ...(analyze
        ? [
            analyzer({
              analyzerMode: 'static',
              openAnalyzer: true,
            }),
          ]
        : []),
    ] as PluginOption[],
  }
})
