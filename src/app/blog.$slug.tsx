import { createFileRoute } from '@tanstack/react-router'
import { PostFooter } from '~/client/components/blog/post-footer'
import { RecommendedPosts } from '~/client/components/blog/recommended-posts'
import { Post } from '~/client/components/blog/post'
import { type TPost } from '~/common/types/content.types'
import { seo } from '~/client/lib/utils/seo'
import { C } from '~/common/constants'
import { getPostBySlugServerFn } from '../server/post.server'

export const Route = createFileRoute('/blog/$slug')({
  component: RouteComponent,
  loader: async ({ params }) => {
    console.log('🔥 LOADER CALLED FOR SLUG:', params.slug)
    const post = await getPostBySlugServerFn({ data: params.slug })

    if (!post) {
      throw new Error('Post not found')
    }
    const { _meta, mdx, ...postWithoutMeta } = post
    return {
      post: { ...postWithoutMeta } as TPost,
      mdx,
    }
  },
  head: ({ params, loaderData }) => {
    const post = loaderData?.post
    if (!post) {
      throw new Error('Post not found')
    }
    const imagePath = post.heroImage
      ? `${C.url}/blog/${params.slug}/${post.heroImage}.webp`
      : ''
    const canonicalUrl = `${C.url}/blog/${post.slug}`

    // Estimate reading time (~200 words per minute)
    const wordCount = post.content?.split(/\s+/).length ?? 0
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))

    // JSON-LD BlogPosting structured data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      image: imagePath || undefined,
      author: {
        '@type': 'Person',
        name: C.fullName,
        url: C.url,
      },
      datePublished: post.createdAt,
      dateModified: post.updatedAt ?? post.createdAt,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
      publisher: {
        '@type': 'Person',
        name: C.fullName,
      },
    }

    return {
      title: post.title,
      meta: seo({
        title: post.title,
        description: post.description,
        keywords: post.tags.join(', '),
        image: imagePath,
        type: 'article',
        imageType: 'image/webp',
        url: canonicalUrl,
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt ?? post.createdAt,
        readingTime,
      }),
      links: [{ rel: 'canonical', href: canonicalUrl }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(jsonLd),
        },
      ],
    }
  },
})

function RouteComponent() {
  const { post, mdx } = Route.useLoaderData()
  if (!post) {
    return <div>Post not found</div>
  }
  return (
    <div className="flex flex-col items-center gap-8">
      <Post mdxCode={mdx} post={post} />
      <RecommendedPosts currentPostId={post.id} />
      <PostFooter slug={post.slug} title={post.title} />
    </div>
  )
}
