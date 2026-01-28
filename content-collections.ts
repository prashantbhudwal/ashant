import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import remarkGfm from 'remark-gfm'
import { z } from 'zod'
import { ContentType } from '~/common/types/content.types'

const posts = defineCollection({
  name: 'posts',
  directory: 'src/content/posts',
  include: '**/*.{md,mdx}',
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    title: z.string(),
    shortTitle: z.string().optional(),
    description: z.string().optional(),
    heroImage: z.string().optional(),
    tags: z.array(
      z.enum([
        'startups',
        'business',
        'writing',
        'reading',
        'ai',
        'learning',
        'education',
        'philosophy',
        'software',
        'economics',
        'personal',
        'health',
        'thinking',
      ]),
    ),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm],
    })
    return {
      ...document,
      mdx,
      type: ContentType.POST,
    }
  },
})

/**
 * Parses markdown content to extract ## Context section, ## Prompt code block, and ## Try code block
 */
function parsePromptContent(content: string): {
  context: string | undefined
  prompt: string
  tryExample: string | undefined
} {
  // Extract content between ## Context and ## Prompt (or end of content before ## Prompt)
  const contextMatch = /## Context\s*\n([\s\S]*?)(?=\n## Prompt|\n```|$)/.exec(
    content,
  )
  const contextRaw = contextMatch?.[1]?.trim() || undefined
  // Remove HTML comments from context
  const context =
    contextRaw?.replace(/<!--[\s\S]*?-->/g, '').trim() || undefined

  // Extract content inside ```md ... ``` code block under ## Prompt
  const promptSection = content.split('## Try')[0] || content
  const codeBlockMatch = /```md\s*\n([\s\S]*?)```/.exec(promptSection)
  const prompt = codeBlockMatch?.[1]?.trim() || ''

  // Extract content inside ## Try section's ```md ... ``` code block
  const trySection = content.split('## Try')[1]
  const tryMatch = trySection
    ? /```md\s*\n([\s\S]*?)```/.exec(trySection)
    : null
  const tryExample = tryMatch?.[1]?.trim() || undefined

  return { context: context || undefined, prompt, tryExample }
}

const prompts = defineCollection({
  name: 'prompts',
  directory: 'src/content/prompts',
  include: '**/*.md',
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    title: z.string(),
    shortTitle: z.string().optional(),
    description: z.string().optional(),
    heroImage: z.string().optional(),
    tags: z.array(
      z.enum([
        'startups',
        'business',
        'writing',
        'reading',
        'ai',
        'learning',
        'education',
        'philosophy',
        'software',
        'economics',
        'personal',
        'health',
        'thinking',
      ]),
    ),
    keyword: z.string().optional(),
    arguments: z.record(z.string(), z.string()).optional(),
    content: z.string(),
  }),
  transform: async (document) => {
    const { context, prompt, tryExample } = parsePromptContent(document.content)
    return {
      ...document,
      context,
      prompt,
      tryExample,
      type: ContentType.PROMPT,
    }
  },
})

export default defineConfig({
  collections: [posts, prompts],
})
