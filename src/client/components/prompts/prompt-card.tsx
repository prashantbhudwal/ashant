import { Link } from '@tanstack/react-router'
import { type TPrompt } from '~/common/types/content.types'
import { formatDate } from '~/client/helpers/format-date'
import { cn } from '~/client/lib/utils'

interface PromptCardProps {
  prompt: TPrompt
  showTags?: boolean
}

export function PromptCard({ prompt, showTags = false }: PromptCardProps) {
  const title = prompt.shortTitle ?? prompt.title
  return (
    <Link
      to="/prompts/$slug"
      params={{ slug: prompt.slug }}
      className="group block py-5 sm:py-6"
    >
      <div className="flex flex-col gap-1">
        <h3
          className={cn(
            'group-hover:text-primary transition-colors',
            'text-foreground text-base font-medium sm:text-lg',
          )}
        >
          {title}
        </h3>
        <time className="text-muted-foreground/70 text-xs tabular-nums">
          {formatDate(prompt.createdAt)}
        </time>
        {prompt.description && (
          <p className="text-muted-foreground/60 mt-0.5 line-clamp-2 text-sm">
            {prompt.description}
          </p>
        )}
        {showTags && prompt.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {prompt.tags.map((tag) => (
              <span
                key={tag}
                className="text-muted-foreground/60 bg-muted/30 rounded px-1.5 py-0.5 text-[10px] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
