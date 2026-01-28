import { lazy, Suspense, useState } from 'react'
import { type TPrompt } from '~/common/types/content.types'
import { formatDate } from '~/client/helpers/format-date'
import { cn } from '~/client/lib/utils'

const Markdown = lazy(() =>
  import('~/client/components/blog/mdx/md.client').then((m) => ({
    default: m.Markdown,
  })),
)

function MarkdownSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="bg-muted h-4 w-3/4 rounded" />
      <div className="bg-muted h-4 w-full rounded" />
      <div className="bg-muted h-4 w-5/6 rounded" />
    </div>
  )
}

function generateChatGPTUrl(tryExample: string): string {
  const encoded = encodeURIComponent(tryExample)
  return `https://chatgpt.com/?prompt=${encoded}`
}

function generateClaudeUrl(tryExample: string): string {
  const encoded = encodeURIComponent(tryExample)
  return `https://claude.ai/new?q=${encoded}`
}

function generateRaycastUrl(prompt: TPrompt): string {
  const snippet = {
    keyword: prompt.keyword || '',
    text: prompt.prompt,
    name: prompt.shortTitle ?? prompt.title,
  }
  const encoded = encodeURIComponent(JSON.stringify(snippet))
  return `https://ray.so/snippets/shared?snippet=${encoded}`
}

type PromptDetailProps = {
  prompt: TPrompt
}

export function PromptDetail({ prompt }: PromptDetailProps) {
  const [copied, setCopied] = useState(false)
  const promptMarkdown = '```xml\n' + prompt.prompt + '\n```'
  const title = prompt.shortTitle ?? prompt.title

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(prompt.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <article className="space-y-10">
      {/* Header */}
      <header className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
          <time className="text-muted-foreground block text-sm tabular-nums">
            {formatDate(prompt.createdAt)}
          </time>
        </div>

        {prompt.description && (
          <p className="text-muted-foreground max-w-prose text-base leading-relaxed">
            {prompt.description}
          </p>
        )}

        {prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {prompt.tags.map((tag) => (
              <span
                key={tag}
                className="bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleCopyPrompt}
          className={cn(
            'rounded-md px-4 py-2 text-sm font-medium transition-colors',
            copied
              ? 'bg-primary/10 text-primary'
              : 'bg-secondary text-secondary-foreground hover:bg-accent',
          )}
        >
          {copied ? 'Copied!' : 'Copy Prompt'}
        </button>

        <button
          type="button"
          onClick={() => window.open(generateRaycastUrl(prompt), '_blank')}
          className="bg-secondary text-secondary-foreground hover:bg-accent rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          Add to Raycast
        </button>

        {prompt.tryExample && (
          <>
            <button
              type="button"
              onClick={() =>
                window.open(generateChatGPTUrl(prompt.tryExample!), '_blank')
              }
              className="bg-secondary text-secondary-foreground hover:bg-accent rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Try in ChatGPT
            </button>
            <button
              type="button"
              onClick={() =>
                window.open(generateClaudeUrl(prompt.tryExample!), '_blank')
              }
              className="bg-secondary text-secondary-foreground hover:bg-accent rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Try in Claude
            </button>
          </>
        )}
      </div>

      {/* Context Section */}
      {prompt.context && (
        <section className="space-y-3">
          <h2 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Context
          </h2>
          <div className="text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
            <Suspense fallback={<MarkdownSkeleton />}>
              <Markdown
                content={prompt.context}
                className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              />
            </Suspense>
          </div>
        </section>
      )}

      {/* Prompt Section */}
      <section className="space-y-3">
        <h2 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          Prompt
        </h2>
        <div className="bg-muted/50 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/30 max-h-[60vh] overflow-y-auto rounded-lg">
          <Suspense fallback={<MarkdownSkeleton />}>
            <Markdown
              content={promptMarkdown}
              className="prose-pre:!bg-transparent prose-pre:!p-4 prose-pre:sm:!p-6 prose-pre:rounded-none prose-pre:whitespace-pre-wrap prose-pre:break-words prose-code:break-words prose-code:text-sm prose-code:font-mono prose-pre:font-mono min-w-full"
            />
          </Suspense>
        </div>
      </section>

      {/* Arguments Section */}
      {prompt.arguments && Object.keys(prompt.arguments).length > 0 && (
        <section className="space-y-3">
          <h2 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Arguments
          </h2>
          <div className="space-y-3">
            {Object.entries(prompt.arguments).map(([key, desc]) => (
              <div
                key={key}
                className="flex flex-col gap-1 sm:flex-row sm:gap-4"
              >
                <code className="bg-muted text-foreground w-fit shrink-0 rounded px-2 py-1 font-mono text-sm font-medium">
                  {key}
                </code>
                <span className="text-muted-foreground text-sm leading-relaxed">
                  {desc}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
