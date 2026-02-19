import { createFileRoute } from '@tanstack/react-router'
import { ProjectCard } from '~/client/components/projects/project-card'
import {
  ContentListLayout,
  ContentListItem,
} from '~/client/components/content-list/content-list-layout'
import { seo } from '~/client/lib/utils/seo'
import { projects } from '~/common/content/projects'
import { C } from '~/common/constants'

export const Route = createFileRoute('/projects/')({
  head: () => {
    const canonicalUrl = `${C.url}/projects`
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Projects',
      description: 'Selected projects with links to source repositories.',
      url: canonicalUrl,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: projects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: project.name,
          url: project.repoUrl,
        })),
      },
    }

    return {
      meta: seo({
        title: 'Projects | prashant',
        description: 'Selected projects and experiments from Prashant Bhudwal.',
        image: `${C.url}/og-ashant.png`,
        keywords: 'projects, github, ai, software, portfolio',
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
    <ContentListLayout>
      {projects.map((project) => (
        <ContentListItem key={project.id}>
          <ProjectCard project={project} />
        </ContentListItem>
      ))}
    </ContentListLayout>
  )
}
