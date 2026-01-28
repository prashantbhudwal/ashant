import { createFileRoute } from '@tanstack/react-router'
import { type TPrompt } from '~/common/types/content.types'
import { seo } from '~/client/lib/utils/seo'
import { C } from '~/common/constants'
import { PromptDetail } from '~/client/components/prompts/prompt-detail'
import { getPromptBySlugServerFn } from '~/server/prompt.server'

export const Route = createFileRoute('/prompts/$slug')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const prompt = await getPromptBySlugServerFn({ data: params.slug })
    if (!prompt) {
      throw new Error('Prompt not found')
    }
    return {
      prompt: prompt as TPrompt,
    }
  },
  head: ({ loaderData }) => {
    const prompt = loaderData?.prompt
    if (!prompt) {
      throw new Error('Prompt not found')
    }
    const canonicalUrl = `${C.url}/prompts/${prompt.slug}`
    return {
      title: `${prompt.title} | Prompts`,
      meta: seo({
        title: `${prompt.title} | Prompts`,
        description:
          prompt.description ?? 'A prompt from the Ashant prompt library.',
        image: `${C.url}/og-ashant.png`,
        keywords: prompt.tags.join(', '),
        url: canonicalUrl,
      }),
      links: [{ rel: 'canonical', href: canonicalUrl }],
    }
  },
})

function RouteComponent() {
  const { prompt } = Route.useLoaderData()
  if (!prompt) {
    return <div>Prompt not found</div>
  }

  return (
    <div className="mx-auto max-w-2xl pt-4 sm:pt-6">
      <PromptDetail prompt={prompt} />
    </div>
  )
}
