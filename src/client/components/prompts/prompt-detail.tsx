import { lazy, Suspense, useState } from 'react'
import { type TPrompt } from '~/common/types/content.types'
import { formatDate } from '~/client/helpers/format-date'
import { Badge } from '~/client/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/client/components/ui/accordion'
import { Button } from '~/client/components/ui/button'

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
  const title = prompt.shortTitle ?? prompt.title

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const argumentEntries = Object.entries(prompt.arguments ?? {})
  const hasArguments = argumentEntries.length > 0

  const chatGptUrl = prompt.tryExample
    ? generateChatGPTUrl(prompt.tryExample)
    : null
  const claudeUrl = prompt.tryExample
    ? generateClaudeUrl(prompt.tryExample)
    : null
  const raycastUrl = generateRaycastUrl(prompt)

  const defaultAccordionValues: string[] = []
  if (prompt.context) defaultAccordionValues.push('context')

  return (
    <article className="space-y-8 sm:space-y-10">
      <header className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
        </div>

        {prompt.description && (
          <p className="text-muted-foreground max-w-prose text-base leading-relaxed">
            {prompt.description}
          </p>
        )}
      </header>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Prompt
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={handleCopyPrompt}>
              {copied ? 'Copied' : 'Copy'}
            </Button>

            <Button asChild size="sm" variant="outline">
              <a href={raycastUrl} target="_blank" rel="noreferrer">
                Raycast
              </a>
            </Button>

            {chatGptUrl && (
              <Button asChild size="sm" variant="outline">
                <a href={chatGptUrl} target="_blank" rel="noreferrer">
                  ChatGPT
                </a>
              </Button>
            )}

            {claudeUrl && (
              <Button asChild size="sm" variant="outline">
                <a href={claudeUrl} target="_blank" rel="noreferrer">
                  Claude
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="bg-muted/30 overflow-hidden rounded-xl border">
          <pre className="text-foreground p-4 font-mono text-sm leading-relaxed break-words whitespace-pre-wrap sm:p-5">
            {prompt.prompt}
          </pre>
        </div>
      </section>

      {(prompt.context || hasArguments) && (
        <section className="space-y-3">
          <Accordion
            type="multiple"
            defaultValue={defaultAccordionValues}
            className="border-border/40 overflow-hidden rounded-xl border"
          >
            {prompt.context && (
              <AccordionItem
                value="context"
                className="border-border/40 last:border-b-0"
              >
                <AccordionTrigger className="px-4 sm:px-5">
                  Context
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-5">
                  <div className="text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                    <Suspense fallback={<MarkdownSkeleton />}>
                      <Markdown
                        content={prompt.context}
                        className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                      />
                    </Suspense>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {hasArguments && (
              <AccordionItem
                value="arguments"
                className="border-border/40 last:border-b-0"
              >
                <AccordionTrigger className="px-4 sm:px-5">
                  Arguments ({argumentEntries.length})
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-5">
                  <dl className="grid gap-4 sm:grid-cols-2">
                    {argumentEntries.map(([key, desc]) => (
                      <div key={key} className="space-y-1">
                        <dt>
                          <code className="bg-muted text-foreground inline-flex w-fit rounded px-2 py-1 font-mono text-xs font-medium">
                            {key}
                          </code>
                        </dt>
                        <dd className="text-muted-foreground text-sm leading-relaxed">
                          {desc}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </section>
      )}
    </article>
  )
}
