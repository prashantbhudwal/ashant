import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getAllContentServerFn } from './index'
import { ContentType, type TPrompt } from '~/common/types/content.types'
import { C } from '~/common/constants'
import { seo } from '~/client/lib/utils/seo'
import { PromptCard } from '~/client/components/prompts/prompt-card'
import {
  ContentListLayout,
  ContentListItem,
} from '~/client/components/content-list/content-list-layout'

const navContentQueryOptions = queryOptions({
  queryKey: ['all-content-prompts'],
  queryFn: () => getAllContentServerFn(),
})

export const Route = createFileRoute('/prompts/')({
  head: () => {
    const canonicalUrl = `${C.url}/prompts`
    return {
      meta: seo({
        title: 'Prompts | prashant',
        description: 'A collection of useful prompts for AI models.',
        image: `${C.url}/og-ashant.png`,
        keywords: 'AI prompts, system prompts, LLM prompts, ChatGPT prompts',
        url: canonicalUrl,
      }),
      links: [{ rel: 'canonical', href: canonicalUrl }],
    }
  },
  loader: async (opts) => {
    return await opts.context.queryClient.ensureQueryData(
      navContentQueryOptions,
    )
  },
  component: PromptsPage,
})

function PromptsPage() {
  const content = useSuspenseQuery(navContentQueryOptions).data
  const prompts = content.filter(
    (item): item is TPrompt => item.type === ContentType.PROMPT,
  )

  return (
    <ContentListLayout>
      {prompts.map((prompt) => (
        <ContentListItem key={prompt.id}>
          <PromptCard prompt={prompt} />
        </ContentListItem>
      ))}
    </ContentListLayout>
  )
}
