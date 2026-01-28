import { createFileRoute, Link } from '@tanstack/react-router'
import { programs } from '~/client/components/programs/programs'
import { ProgramCard } from '~/client/components/programs/program-card'
import { seo } from '~/client/lib/utils/seo'
import { C } from '~/common/constants'

export const Route = createFileRoute('/programs/')({
  head: () => {
    const canonicalUrl = `${C.url}/programs`
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Programs',
      description:
        'Interactive programs for text processing, health, and AI tasks.',
      url: canonicalUrl,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: programs.map((program, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: program.title,
          url: `${C.url}/programs/${program.slug}`,
        })),
      },
    }
    return {
      meta: seo({
        title: 'Programs | prashant',
        description:
          'Interactive programs for text processing, health, and AI tasks.',
        image: `${C.url}/og-ashant.png`,
        keywords:
          'programs, text chunker, text similarity, sweetener comparison',
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
        Programs
      </h1>
      <p className="text-muted-foreground mb-12 text-lg leading-relaxed">
        Programs are focused tools designed to solve specific problems I
        encounter regularly.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </div>
  )
}
