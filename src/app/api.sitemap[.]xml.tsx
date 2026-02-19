import { createFileRoute } from '@tanstack/react-router'
import { allPosts, allPrompts } from 'content-collections'
import { C } from '~/common/constants'

export const Route = createFileRoute('/api/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const baseUrl = C.url

        // Static pages
        const staticPages = [
          { loc: baseUrl, priority: '1.0', changefreq: 'daily' },
          { loc: `${baseUrl}/posts`, priority: '0.9', changefreq: 'weekly' },
          { loc: `${baseUrl}/prompts`, priority: '0.8', changefreq: 'weekly' },
          { loc: `${baseUrl}/projects`, priority: '0.8', changefreq: 'weekly' },
        ]

        // Blog posts
        const blogPages = allPosts.map((post) => ({
          loc: `${baseUrl}/blog/${post.slug}`,
          lastmod: post.updatedAt ?? post.createdAt,
          priority: '0.7',
          changefreq: 'monthly',
        }))

        // Prompts
        const promptPages = allPrompts.map((prompt) => ({
          loc: `${baseUrl}/prompts/${prompt.slug}`,
          lastmod: prompt.updatedAt ?? prompt.createdAt,
          priority: '0.6',
          changefreq: 'monthly',
        }))

        type SitemapPage = {
          loc: string
          lastmod?: string | Date // Allow Date or string
          changefreq: string
          priority: string
        }

        const allPages: SitemapPage[] = [
          ...staticPages,
          ...blogPages,
          ...promptPages,
        ]

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.loc}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

        return new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control':
              'public, max-age=3600, stale-while-revalidate=86400',
          },
        })
      },
    },
  },
})
