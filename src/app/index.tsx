import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { getWeekOfLife } from '~/common/utils/date'
import { seo } from '~/client/lib/utils/seo'
import { C } from '~/common/constants'
import {
  type TSerializableContent,
  type TPost,
  type TSerializableSpace,
  type TPrompt,
  ContentType,
} from '~/common/types/content.types'
import { getAllContentServerFn } from '../server/content.server'
import { WritingsSection } from '~/client/components/home/writings-section'
import { ToolsSection } from '~/client/components/home/tools-section'
import { PromptsSection } from '~/client/components/home/prompts-section'
import { StorySection } from '~/client/components/home/story-section'

export { getAllContentServerFn }

// const contentQueryOptions = queryOptions({
//   queryKey: ['all-content'],
//   queryFn: () => getAllContentServerFn(),
// })

export const Route = createFileRoute('/')({
  head: () => {
    const imagePath = `${C.url}/og-ashant.png`
    return {
      title: 'prashant',
      meta: seo({
        title: 'prashant',
        description: `Notes on the world, software and life. Week ${getWeekOfLife()}.`,
        keywords: 'prashant, blog, notes, software, life, tools, prompts',
        image: imagePath,
        imageType: 'image/png',
        url: C.url,
      }),
      links: [
        { rel: 'canonical', href: C.url },
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          href: `${C.url}/api/feed.xml`,
        },
      ],
    }
  },
  loader: async () => {
    const data = await getAllContentServerFn()
    return data
  },
  pendingComponent: () => <>Loading</>,
  component: HomePageContent,
})

function HomePageContent() {
  // const { data: content, status } = useQuery(contentQueryOptions)
  // const isLoading = status === 'pending'
  const loaderContent = useLoaderData({ from: '/' })

  return <HomePage content={loaderContent} />
}

function HomePage({ content }: { content: TSerializableContent[] }) {
  const posts = content.filter(
    (item): item is TPost => item.type === ContentType.POST,
  )
  const spaces = content.filter(
    (item): item is TSerializableSpace => item.type === ContentType.SPACE,
  )
  const prompts = content.filter(
    (item): item is TPrompt => item.type === ContentType.PROMPT,
  )

  return (
    <div className="mx-auto max-w-2xl pt-4 sm:pt-6">
      <div className="mt-8 space-y-16 sm:mt-12 sm:space-y-24">
        <WritingsSection posts={posts} />
        {spaces.length > 0 && <ToolsSection spaces={spaces} />}
        {prompts.length > 0 && <PromptsSection prompts={prompts} />}
        <StorySection />
      </div>
    </div>
  )
}
