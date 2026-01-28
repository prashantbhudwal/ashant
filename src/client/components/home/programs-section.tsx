import { Link } from '@tanstack/react-router'
import { type TSerializableSpace } from '~/common/types/content.types'
import { ArrowRight } from 'lucide-react'
import { ProgramCard } from '~/client/components/programs/program-card'
import { Skeleton } from '~/client/components/ui/skeleton'

const PREVIEW_LIMIT = 5

type ProgramsSectionProps = {
  programs: TSerializableSpace[]
  className?: string
}

export function ProgramsSection({ programs, className }: ProgramsSectionProps) {
  const displayPrograms = programs.slice(0, PREVIEW_LIMIT)
  const remainingCount = programs.length - PREVIEW_LIMIT

  return (
    <section id="programs" className={className}>
      <h2 className="text-muted-foreground mb-6 text-sm font-medium tracking-widest uppercase sm:mb-8">
        Programs
      </h2>
      <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4">
        {displayPrograms.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>

      {remainingCount > 0 && (
        <Link
          to="/programs"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm font-medium transition-colors"
        >
          {remainingCount} more <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </section>
  )
}

function ProgramsLoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="border-border/40 space-y-3 rounded-lg border p-4"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-md" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </>
  )
}
