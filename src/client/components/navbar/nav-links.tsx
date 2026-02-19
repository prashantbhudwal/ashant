'use client'

import { useLocation, useNavigate } from '@tanstack/react-router'
import { cn } from '~/client/lib/utils'

const items = [
  { name: 'posts', path: '/posts', hash: 'posts' },
  { name: 'projects', path: '/projects', hash: 'projects' },
  { name: 'prompts', path: '/prompts', hash: 'prompts' },
]

export function NavLinks({ className }: { className?: string }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  const handleNavigation = async (path: string, hash: string) => {
    await navigate({ to: path })
    // if (isHome) {
    //   // Scroll to section
    //   const element = document.getElementById(hash)
    //   if (element) {
    //     const offset = 100 // Adjusted for sticky nav height
    //     const top =
    //       element.getBoundingClientRect().top + window.scrollY - offset
    //     window.scrollTo({ top, behavior: 'smooth' })
    //   } else {
    //     // Fallback if element not found (e.g. story section might not be mounted?)
    //     navigate({ to: path })
    //   }
    // } else {
    //   // Navigate to page
    //   navigate({ to: path })
    // }
  }

  return (
    <div
      className={cn(
        'flex items-center gap-4 text-sm font-medium md:gap-6 md:text-[15px]',
        className,
      )}
    >
      <div className="flex items-center gap-4 md:gap-6">
        {items.map((item) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`)
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path, item.hash)}
              className={cn(
                'transition-colors',
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.name}
            </button>
          )
        })}
      </div>

      <div className="bg-border/50 h-4 w-px" />

      <button
        onClick={() => handleNavigation('/story', 'story')}
        className={cn(
          'transition-colors',
          location.pathname === '/story' ||
            location.pathname.startsWith('/story/')
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        story
      </button>
    </div>
  )
}
