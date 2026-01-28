import { type TPost } from '~/common/types/content.types'
import { useEffect } from 'react'
import { Mdx } from './mdx/mdx.client'

export function Post({ mdxCode, post }: { mdxCode: string; post: TPost }) {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])

  return (
    <article className="max-w-3xl py-6 sm:py-10">
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-col">
          <h1 className="mb-2 text-2xl leading-tight font-bold tracking-tight text-gray-900 sm:mb-3 sm:text-3xl md:text-4xl dark:text-gray-100">
            {post.title}
          </h1>
          <time className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </header>
      <div suppressHydrationWarning>
        <Mdx mdxCode={mdxCode} />
      </div>
    </article>
  )
}
