import { createFileRoute } from '@tanstack/react-router'
import { Story } from '~/client/components/story/story'
import { seo } from '~/client/lib/utils/seo'
import { C } from '~/common/constants'

export const Route = createFileRoute('/story')({
  head: () => {
    const canonicalUrl = `${C.url}/story`
    return {
      meta: seo({
        title: 'Story | prashant',
        description:
          'A narrative résumé — cities, work, and experiments that shaped me.',
        image: `${C.url}/og-ashant.png`,
        keywords: 'story, biography, resume, timeline',
        url: canonicalUrl,
      }),
      links: [{ rel: 'canonical', href: canonicalUrl }],
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Story />
}
