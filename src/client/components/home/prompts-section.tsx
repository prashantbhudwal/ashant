import { Link } from '@tanstack/react-router'

import { type TPrompt } from '~/common/types/content.types'
import { ArrowRight } from 'lucide-react'
import { PromptCard } from '~/client/components/prompts/prompt-card'
import { Skeleton } from '~/client/components/ui/skeleton'

type PromptsSectionProps = {
  prompts: TPrompt[]
  className?: string
}

const PREVIEW_LIMIT = 5

export function PromptsSection({ prompts, className }: PromptsSectionProps) {
  const displayPrompts = prompts.slice(0, PREVIEW_LIMIT)
  const remainingCount = prompts.length - PREVIEW_LIMIT

  return (
    <section id="prompts" className={className}>
      <h2 className="text-muted-foreground mb-6 text-sm font-medium tracking-widest uppercase sm:mb-8">
        Prompts
      </h2>
      <ul className="divide-border/40 mb-6 divide-y sm:mb-8">
        {displayPrompts.map((prompt) => (
          <li key={prompt.id}>
            <PromptCard prompt={prompt} />
          </li>
        ))}
      </ul>

      {remainingCount > 0 && (
        <Link
          to="/prompts"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm font-medium transition-colors"
        >
          {remainingCount} more <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </section>
  )
}

export function PromptsLoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 2 }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-lg" />
      ))}
    </>
  )
}
