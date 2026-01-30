import { useAtom } from 'jotai'
import { useMemo, useState } from 'react'

import { Badge } from '~/client/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/client/components/ui/card'
import { cn } from '~/client/lib/utils'

import { resolutionAtom } from './resolution-atom'
import { layersPoints } from './story-data'
import { ChapterSection } from './story-chapter-section'
import { LEVELS } from './story-constants'
import { MobileDock } from './story-mobile-dock'
import { SummaryCard } from './summary-card'
import { DETAIL_LABELS, LEVEL } from './types'

export function Story() {
  const [resolution, setResolution] = useAtom<number>(resolutionAtom)
  const [activeChapterId, setActiveChapterId] = useState<string | null>(
    layersPoints[0]?.id ?? null,
  )

  const activeChapter = useMemo(() => {
    if (!activeChapterId) return null
    return layersPoints.find((p) => p.id === activeChapterId) ?? null
  }, [activeChapterId])

  const currentLevel = useMemo(() => {
    return LEVELS.find((l) => l.value === resolution) ?? LEVEL.basic
  }, [resolution])

  const jumpToChapter = (chapterId: string) => {
    setActiveChapterId(chapterId)
    document
      .getElementById(`chapter-${chapterId}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="mx-auto w-full max-w-6xl pt-4 sm:pt-6">
      <div className="space-y-10 pb-24 sm:pb-16">
        <SummaryCard />

        <div className="grid gap-10 lg:grid-cols-[340px_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <Card className="border-border/60">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-base">Read mode</CardTitle>
                  <CardDescription>
                    Choose how deep the narrative goes.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted/20 border-border/60 flex w-full rounded-lg border p-1">
                    {LEVELS.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        aria-pressed={resolution === level.value}
                        onClick={() => setResolution(level.value)}
                        className={cn(
                          'flex-1 rounded-md px-3 py-2 text-sm font-medium transition',
                          resolution === level.value
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {DETAIL_LABELS[level.value]}
                      </button>
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {currentLevel.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-base">Chapters</CardTitle>
                  <CardDescription>Jump to any chapter.</CardDescription>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-1">
                    {layersPoints.map((chapter) => {
                      const totalSubplots = chapter.subplots?.length ?? 0
                      const visibleSubplots =
                        chapter.subplots?.filter(
                          (s) => s.resolution.value <= resolution,
                        ).length ?? 0

                      return (
                        <button
                          key={chapter.id}
                          type="button"
                          onClick={() => jumpToChapter(chapter.id)}
                          className={cn(
                            'hover:bg-muted/30 flex w-full items-start gap-3 rounded-md px-2 py-2 text-left transition-colors',
                            chapter.id === activeChapterId && 'bg-muted/40',
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              'mt-1.5 h-2 w-2 shrink-0 rounded-full border',
                              chapter.id === activeChapterId
                                ? 'border-primary bg-primary'
                                : 'border-border bg-background',
                            )}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate text-sm font-medium">
                                {chapter.title}
                              </span>
                              {chapter.description && (
                                <Badge
                                  variant="secondary"
                                  className="shrink-0 font-mono text-[10px] font-medium"
                                >
                                  {chapter.description}
                                </Badge>
                              )}
                            </div>
                            {totalSubplots > 0 && (
                              <div className="text-muted-foreground mt-0.5 text-xs">
                                {visibleSubplots}/{totalSubplots} sections
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </aside>

          <main className="min-w-0">
            <div className="space-y-10">
              {layersPoints.map((chapter, index) => (
                <ChapterSection
                  key={chapter.id}
                  chapter={chapter}
                  resolution={resolution}
                  isActive={chapter.id === activeChapterId}
                  isLast={index === layersPoints.length - 1}
                  onActive={() => setActiveChapterId(chapter.id)}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
      <MobileDock
        activeChapterId={activeChapterId}
        activeChapter={activeChapter}
        resolution={resolution}
        points={layersPoints}
        onJump={jumpToChapter}
        onResolutionChange={setResolution}
      />
    </div>
  )
}
