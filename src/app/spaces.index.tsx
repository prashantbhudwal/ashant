import { createFileRoute, Link } from '@tanstack/react-router'
import { spaces } from '~/client/components/spaces/spaces'
import { SpaceCard } from '~/client/components/spaces/space-card'
import { seo } from '~/client/lib/utils/seo'
import { C } from '~/common/constants'

export const Route = createFileRoute('/spaces/')({
  head: () => {
    const canonicalUrl = `${C.url}/spaces`
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Tools',
      description:
        'Interactive tools for text processing, health, and AI tasks.',
      url: canonicalUrl,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: spaces.map((space, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: space.title,
          url: `${C.url}/spaces/${space.slug}`,
        })),
      },
    }
    return {
      meta: seo({
        title: 'Tools | prashant',
        description:
          'Interactive tools for text processing, health, and AI tasks.',
        image: `${C.url}/og-ashant.png`,
        keywords: 'tools, text chunker, text similarity, sweetener comparison',
        url: canonicalUrl,
      }),
      links: [{ rel: 'canonical', href: canonicalUrl }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(jsonLd),
        },
      ],
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="md:w-content-narrow lg:w-content-default mx-auto w-full px-4 py-12">
      <h1 className="text-muted-foreground mb-8 text-sm font-medium tracking-widest uppercase">
        Tools
      </h1>
      <p className="text-muted-foreground mb-12 text-lg leading-relaxed">
        Spaces are focused tools designed to solve specific problems I encounter
        regularly.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {spaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </div>
    </div>
  )
}
