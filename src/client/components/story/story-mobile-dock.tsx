import { ListOrdered, SlidersHorizontal } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '~/client/components/ui/dropdown-menu'
import { Button } from '~/client/components/ui/button'
import { cn } from '~/client/lib/utils'

import { LEVELS } from './story-constants'
import { DETAIL_LABELS, type Story } from './types'

export function MobileDock({
  activeChapterId,
  activeChapter,
  resolution,
  points,
  onJump,
  onResolutionChange,
}: {
  activeChapterId: string | null
  activeChapter: Story | null
  resolution: number
  points: Story[]
  onJump: (chapterId: string) => void
  onResolutionChange: (value: number) => void
}) {
  if (!activeChapter) return null

  return (
    <div
      className={cn(
        'bg-background/80 border-border/60 fixed bottom-4 left-1/2 z-50 w-[min(32rem,calc(100vw-1.5rem))] -translate-x-1/2 rounded-xl border p-2 shadow-xl backdrop-blur-md lg:hidden',
      )}
    >
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <ListOrdered className="h-4 w-4" />
              Chapters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72">
            <DropdownMenuLabel>Chapters</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {points.map((chapter) => (
              <DropdownMenuItem
                key={chapter.id}
                onSelect={() => onJump(chapter.id)}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-2 w-2 rounded-full',
                    chapter.id === activeChapterId
                      ? 'bg-primary'
                      : 'bg-muted-foreground/30',
                  )}
                />
                <span className="min-w-0 flex-1 truncate">{chapter.title}</span>
                {chapter.description && (
                  <DropdownMenuShortcut>
                    {chapter.description}
                  </DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              {DETAIL_LABELS[resolution]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuLabel>Read mode</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={String(resolution)}
              onValueChange={(value) => onResolutionChange(Number(value))}
            >
              {LEVELS.map((level) => (
                <DropdownMenuRadioItem
                  key={level.value}
                  value={String(level.value)}
                >
                  {DETAIL_LABELS[level.value]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="min-w-0 flex-1 text-right">
          <div className="truncate text-xs font-medium">
            {activeChapter.title}
          </div>
          {activeChapter.description && (
            <div className="text-muted-foreground truncate text-[10px] tabular-nums">
              {activeChapter.description}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
