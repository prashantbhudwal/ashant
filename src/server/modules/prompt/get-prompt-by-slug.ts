import { cache } from 'react'
import { ContentType, type TPrompt } from '~/common/types/content.types'
import { allPrompts } from 'content-collections'

export const getPromptBySlug = cache(async (slug: string): Promise<TPrompt> => {
  const prompt = allPrompts.find((item) => item.slug === slug)

  if (!prompt) {
    throw new Error(`Prompt with slug '${slug}' not found`)
  }

  const { _meta, ...rest } = prompt
  return {
    ...rest,
    type: ContentType.PROMPT,
  }
})
