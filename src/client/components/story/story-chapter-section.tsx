import { InView } from 'react-intersection-observer'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/client/components/ui/card'
import { cn } from '~/client/lib/utils'

import { getStoryParagraphs } from './story-layers'
import { OBSERVER_ROOT_MARGIN } from './story-constants'
import { StoryMarkdown } from './story-markdown'
import { type Story } from './types'

export function ChapterSection({
  chapter,
  resolution,
  isActive,
  isLast,
  onActive,
}: {
  chapter: Story
  resolution: number
  isActive: boolean
  isLast: boolean
  onActive: () => void
}) {
  const visibleSubplots =
    chapter.subplots?.filter((s) => s.resolution.value <= resolution) ?? []

  return (
    <InView
      rootMargin={OBSERVER_ROOT_MARGIN}
      threshold={0}
      onChange={(inView) => {
        if (inView) onActive()
      }}
    >
      {({ ref }) => (
        <section
          ref={ref}
          id={`chapter-${chapter.id}`}
          className={cn('scroll-mt-24', isLast ? 'pb-0' : 'pb-10 sm:pb-12')}
        >
          <div className="grid grid-cols-1 sm:grid-cols-[1rem_1fr] sm:gap-x-8">
            <div className="relative hidden flex-col items-center sm:flex">
              <span
                aria-hidden="true"
                className={cn(
                  'mt-4 h-3 w-3 rounded-full border transition-colors',
                  isActive
                    ? 'border-primary bg-primary'
                    : 'border-border bg-background',
                )}
              />
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="bg-border mt-4 w-px flex-1"
                />
              )}
            </div>

            <Card
              className={cn(
                'border-border/60 transition-shadow hover:shadow-md',
                isActive && 'ring-primary/20 ring-1',
              )}
            >
              <CardHeader className="space-y-3 p-4 sm:p-6">
                <div className="space-y-1">
                  <CardTitle className="text-xl tracking-tight text-balance sm:text-2xl">
                    {chapter.title}
                  </CardTitle>
                  {chapter.description && (
                    <div className="text-muted-foreground text-sm">
                      {chapter.description}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-5 px-4 pt-0 pb-4 sm:space-y-6 sm:px-6 sm:pb-6">
                <div className="space-y-4">
                  {getStoryParagraphs(chapter, resolution).map(
                    (paragraph, i) => (
                      <div
                        key={`${chapter.id}-${i}`}
                        className={cn(
                          'bg-muted/15 border-border/60 rounded-lg border p-3 sm:p-4',
                          i > 0 &&
                            'animate-in fade-in-0 slide-in-from-bottom-2 duration-300',
                        )}
                      >
                        <StoryMarkdown content={paragraph} />
                      </div>
                    ),
                  )}

                  {visibleSubplots.map((subplot) => (
                    <div
                      key={`${chapter.id}-${subplot.id}`}
                      className="bg-muted/10 border-border/60 space-y-3 rounded-lg border px-3 py-2.5 sm:px-4 sm:py-3"
                    >
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">
                          {subplot.title}
                        </div>
                        {subplot.description && (
                          <div className="text-muted-foreground text-xs">
                            {subplot.description}
                          </div>
                        )}
                      </div>
                      {getStoryParagraphs(subplot, resolution).map(
                        (paragraph, i) => (
                          <StoryMarkdown
                            key={`${chapter.id}-${subplot.id}-${i}`}
                            content={paragraph}
                          />
                        ),
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </InView>
  )
}
