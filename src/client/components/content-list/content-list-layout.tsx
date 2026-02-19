import { Children, type ReactNode } from 'react'
import { cn } from '~/client/lib/utils'

interface ContentListLayoutProps {
  children: ReactNode
  className?: string
  emptyState?: ReactNode
}

export function ContentListLayout({
  children,
  className,
  emptyState,
}: ContentListLayoutProps) {
  const itemCount = Children.count(children)

  return (
    <div
      className={cn('mx-auto w-full max-w-xl shrink-0 pt-4 sm:pt-6', className)}
    >
      <ul className="divide-border/40 w-full divide-y">{children}</ul>
      {itemCount === 0 && emptyState}
    </div>
  )
}

interface ContentListItemProps {
  children: ReactNode
}

export function ContentListItem({ children }: ContentListItemProps) {
  return <li className="w-full">{children}</li>
}
