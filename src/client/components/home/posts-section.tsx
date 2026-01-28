'use client'

import { Link } from '@tanstack/react-router'
import { type TPost } from '~/common/types/content.types'
import { formatDate } from '~/client/helpers/format-date'
import { cn } from '~/client/lib/utils'
import { ArrowRight } from 'lucide-react'
import { PostCard } from '~/client/components/blog/post-card'
import { Skeleton } from '~/client/components/ui/skeleton'

const PREVIEW_LIMIT = 5

type PostsSectionProps = {
  posts: TPost[]
  className?: string
}

export function PostsSection({ posts, className }: PostsSectionProps) {
  const displayPosts = posts.slice(0, PREVIEW_LIMIT)
  const remainingPosts = posts.slice(PREVIEW_LIMIT)
  const remainingCount = remainingPosts.length

  // Extract unique tags from remaining posts
  const remainingTags = [...new Set(remainingPosts.flatMap((p) => p.tags))]
  const previewTags = remainingTags.slice(0, 3)
  const hasMoreTags = remainingTags.length > 3

  const formatTagPreview = () => {
    if (previewTags.length === 0) return ''
    const tagList = previewTags.join(', ')
    return ` on ${tagList}`
  }

  return (
    <section id="posts" className={className}>
      <h2 className="text-muted-foreground mb-6 text-sm font-medium tracking-widest uppercase sm:mb-8">
        Posts
      </h2>

      <div className="mb-6 space-y-8 sm:mb-8">
        <ul className="space-y-8">
          {displayPosts.map((post, index) => (
            <li key={post.id}>
              <PostCard post={post} isLatest={index === 0} />
            </li>
          ))}
        </ul>
      </div>

      {remainingCount > 0 && (
        <Link
          to="/posts"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm font-medium transition-colors"
        >
          {remainingCount} more{formatTagPreview()}...{' '}
          <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </section>
  )
}

const LoadingSkeleton = function () {
  return (
    <div className="space-y-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-12" />
            <span className="text-muted-foreground/20">·</span>
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-7 w-3/4 sm:h-9" />
          <Skeleton className="h-16 w-full" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
