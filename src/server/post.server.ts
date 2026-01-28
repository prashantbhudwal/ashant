import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export const getPostBySlugServerFn = createServerFn({ method: 'GET' })
  .inputValidator(z.string())
  .handler(async ({ data: slug }) => {
    // Dynamic import to ensure server code (and content JSON) is excluded from client bundle
    const { getPostBySlug } =
      await import('~/server/modules/post/get-post-by-slug')
    const post = await getPostBySlug(slug)
    return post
  })
