import { createFileRoute } from '@tanstack/react-router'
import { programs } from '~/client/components/programs/programs'
import { ProgramCard } from '~/client/components/programs/program-card'
import { seo } from '~/client/lib/utils/seo'
import { C } from '~/common/constants'
import { ArchivedProgramsNotice } from '~/client/components/programs/archived-notice'

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
      meta: [
        ...seo({
          title: 'Archived Programs | prashant',
          description:
            'Archived internal tools for text processing, health, and AI tasks.',
          image: `${C.url}/og-ashant.png`,
          keywords:
            'archived programs, text chunker, text similarity, sweetener comparison',
          url: canonicalUrl,
        }),
        {
          name: 'robots',
          content: 'noindex, nofollow',
        },
      ],
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
    <div className="mx-auto max-w-2xl pt-4 sm:pt-6">
      <ArchivedProgramsNotice />
      <p className="text-muted-foreground mb-12 text-lg leading-relaxed">
        Programs are focused tools designed to solve specific problems I
        encountered regularly. They are kept online as archived references.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </div>
  )
}
