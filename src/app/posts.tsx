import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getAllContentServerFn } from './index'
import { ContentType, type TPost } from '~/common/types/content.types'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { formatDate } from '~/client/helpers/format-date'
import { cn } from '~/client/lib/utils'
import { seo } from '~/client/lib/utils/seo'
import { C } from '~/common/constants'
import { PostCard } from '~/client/components/blog/post-card'

const navContentQueryOptions = queryOptions({
  queryKey: ['all-content-posts'],
  queryFn: () => getAllContentServerFn(),
})

export const Route = createFileRoute('/posts')({
  head: () => {
    const canonicalUrl = `${C.url}/posts`
    return {
      meta: seo({
        title: 'Posts | prashant',
        description: 'Notes on software, design, and life.',
        image: `${C.url}/og-ashant.png`,
        keywords: 'blog, notes, software, design, philosophy, startups',
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
  component: PostsPage,
})

const allTags = [
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
] as const

function PostsPage() {
  const content = useSuspenseQuery(navContentQueryOptions).data
  const posts = content.filter(
    (item): item is TPost => item.type === ContentType.POST,
  )

  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filteredPosts =
    selectedTags.length > 0
      ? posts.filter((post) =>
          post.tags.some((tag) => selectedTags.includes(tag)),
        )
      : posts

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  return (
    <div className="mx-auto max-w-2xl pt-4 sm:pt-6">
      <ul className="divide-border/40 mb-6 divide-y sm:mb-8">
        {filteredPosts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} showTags />
          </li>
        ))}
      </ul>

      {filteredPosts.length === 0 && (
        <p className="text-muted-foreground py-12 text-center">
          No posts match the selected tags.
        </p>
      )}
    </div>
  )
}
