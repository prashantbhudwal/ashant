import { Markdown } from '~/client/components/blog/mdx/md.client'
import { cn } from '~/client/lib/utils'

export function StoryMarkdown({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  return (
    <Markdown
      content={content}
      className={cn(
        'prose-base prose-p:leading-relaxed prose-p:my-2 prose-a:text-primary prose-a:underline-offset-4 hover:prose-a:underline prose-pre:my-4',
        className,
      )}
    />
  )
}
