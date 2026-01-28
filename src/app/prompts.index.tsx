import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getAllContentServerFn } from './index'
import { ContentType, type TPrompt } from '~/common/types/content.types'
import { C } from '~/common/constants'
import { seo } from '~/client/lib/utils/seo'
import { PromptCard } from '~/client/components/prompts/prompt-card'

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
    <div className="mx-auto max-w-2xl pt-4 sm:pt-6">
      <div className="mb-12">
        <h1 className="mb-4 text-3xl font-bold tracking-tight">Prompts</h1>
        <p className="text-muted-foreground text-lg">
          Curated inputs for language models.
        </p>
      </div>

      <ul className="divide-y divide-border/40">
        {prompts.map((prompt) => (
          <li key={prompt.id}>
            <PromptCard prompt={prompt} />
          </li>
        ))}
      </ul>
    </div>
  )
}
