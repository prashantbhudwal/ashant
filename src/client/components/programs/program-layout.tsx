import { cn } from '~/client/lib/utils'
import type { TSpace } from '~/common/types/content.types'
import { ArchivedProgramsNotice } from './archived-notice'

type LayoutWidth = NonNullable<TSpace['layoutWidth']>

const widthClasses: Record<LayoutWidth, string> = {
  narrow: 'w-full md:w-content-narrow lg:w-content-default',
  default: 'w-full md:w-content-default lg:w-content-wide',
  wide: 'w-full md:w-content-wide lg:w-content-full',
  full: 'w-full lg:w-content-full',
}

interface ProgramLayoutProps {
  title: string
  description: string
  layoutWidth?: LayoutWidth
  supportsMobile?: boolean
  children: React.ReactNode
}

function MobileFallback({ title }: { title: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="text-muted-foreground mb-4 text-6xl">🖥️</div>
      <h2 className="text-foreground mb-2 text-xl font-semibold">
        Desktop Only
      </h2>
      <p className="text-muted-foreground max-w-sm text-sm">
        <span className="text-foreground font-medium">{title}</span> is
        optimized for larger screens. Please visit on a desktop or tablet for
        the best experience.
      </p>
    </div>
  )
}

export function ProgramLayout({
  title,
  description,
  layoutWidth = 'default',
  supportsMobile = true,
  children,
}: ProgramLayoutProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full pt-4 pb-12 sm:pt-6 sm:pb-16',
        widthClasses[layoutWidth],
      )}
    >
      <ArchivedProgramsNotice />
      <div className="mb-12">
        <h1 className="mb-4 text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-lg">{description}</p>
      </div>

      {/* Show content on desktop, or on mobile if supported */}
      {supportsMobile ? (
        children
      ) : (
        <>
          {/* Desktop: show children */}
          <div className="hidden sm:block">{children}</div>
          {/* Mobile: show fallback */}
          <div className="sm:hidden">
            <MobileFallback title={title} />
          </div>
        </>
      )}
    </div>
  )
}
