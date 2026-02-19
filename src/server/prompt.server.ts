import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export const getPromptBySlugServerFn = createServerFn({ method: 'GET' })
  .inputValidator(z.string())
  .handler(async ({ data: slug }) => {
    const { getPromptBySlug } =
      await import('~/server/modules/prompt/get-prompt-by-slug')
    return await getPromptBySlug(slug)
  })
