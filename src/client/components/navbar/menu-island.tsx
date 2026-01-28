import { Link } from '@tanstack/react-router'
import { cn } from '~/client/lib/utils'

type MenuItem = {
  label: string
  route: string
  isActive: boolean
}

const menuItems: MenuItem[] = [
  {
    label: 'posts',
    route: '/',
    isActive: true,
  },
  {
    label: 'story',
    route: '',
    isActive: false,
  },
  {
    label: 'programs',
    route: '',
    isActive: false,
  },
]

export function MenuIsland({ className }: { className?: string }) {
  return (
    <nav className={cn('my-4 md:my-0', className)}>
      <ul className="flex flex-row items-baseline space-x-2 md:space-x-8">
        {menuItems.map(({ isActive, label, route }) => (
          <li key={label}>
            <Link
              to={route}
              className={cn(
                'relative flex h-8 items-center rounded-md font-mono transition-all md:h-9',
                'bg-clip-text',
                {
                  'text-primary font-medium': isActive,
                  'hover:text-foreground': !isActive,
                  'text-muted-foreground': !isActive,
                },
              )}
            >
              <span
                className={cn(
                  'relative mx-2 md:mx-3',
                  !isActive &&
                    'before:from-foreground before:to-foreground before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:bg-clip-text',
                  !isActive &&
                    'before:translate-x-[-100%] before:transition-transform before:duration-300 before:ease-in-out hover:before:translate-x-0',
                )}
              >
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
