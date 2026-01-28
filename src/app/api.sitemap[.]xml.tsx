import { createFileRoute } from '@tanstack/react-router'
import { allPosts } from 'content-collections'
import { spaces } from '~/client/components/spaces/spaces'
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
          { loc: `${baseUrl}/spaces`, priority: '0.8', changefreq: 'monthly' },
        ]

        // Blog posts
        const blogPages = allPosts.map((post) => ({
          loc: `${baseUrl}/blog/${post.slug}`,
          lastmod: post.updatedAt ?? post.createdAt,
          priority: '0.7',
          changefreq: 'monthly',
        }))

        // Spaces/Tools
        const spacePages = spaces.map((space) => ({
          loc: `${baseUrl}/spaces/${space.slug}`,
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
          ...spacePages,
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
