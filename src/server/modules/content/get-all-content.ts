import { cache } from 'react'
import type { TContent, ContentType } from '~/common/types/content.types'
import { getAllPosts } from '~/server/modules/post/get-all-posts'
import { getAllPrompts } from '~/server/modules/prompt/get-all-prompts'
import { programs } from '~/client/components/programs/programs'

/**
 * Fetches all content (posts, programs, prompts) and returns a unified array.
 * Sorted by createdAt descending.
 */
export const getAllContent = cache(async (): Promise<TContent[]> => {
  const [posts, prompts] = await Promise.all([getAllPosts(), getAllPrompts()])

  // Programs are defined statically, not async
  const allPrograms = programs.map((program) => ({
    ...program,
    // Omit Component for serialization
    Component: undefined,
  })) as unknown as TContent[]

  const allContent: TContent[] = [...posts, ...allPrograms, ...prompts]

  // Sort by createdAt descending
  allContent.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return allContent
})

/**
 * Filters content by type.
 */
export function filterContentByType(
  content: TContent[],
  type: ContentType | 'all',
): TContent[] {
  if (type === 'all') return content
  return content.filter((item) => item.type === type)
}

/**
 * Filters content by tags (matches ANY of the provided tags).
 */
export function filterContentByTags(
  content: TContent[],
  tags: string[],
): TContent[] {
  if (tags.length === 0) return content
  return content.filter((item) => item.tags.some((tag) => tags.includes(tag)))
}
