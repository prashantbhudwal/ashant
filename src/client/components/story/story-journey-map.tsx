import { useMemo } from 'react'

import { cn } from '~/client/lib/utils'

import { type Story } from './types'

export function JourneyMap({
  points,
  activeId,
  className,
}: {
  points: Array<Pick<Story, 'id' | 'title' | 'coordinates'>>
  activeId: string | null
  className?: string
}) {
  const normalized = useMemo(() => {
    const longs = points.map((p) => p.coordinates[0])
    const lats = points.map((p) => p.coordinates[1])

    const minLon = Math.min(...longs)
    const maxLon = Math.max(...longs)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)

    const spanLon = maxLon - minLon || 1
    const spanLat = maxLat - minLat || 1

    const padding = 10
    const scale = 100 - padding * 2

    const pts = points.map((p) => {
      const lon = p.coordinates[0]
      const lat = p.coordinates[1]
      const x = padding + ((lon - minLon) / spanLon) * scale
      const y = padding + ((maxLat - lat) / spanLat) * scale
      return { ...p, x, y }
    })

    const path = pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ')

    return { pts, path }
  }, [points])

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(
        'bg-muted/10 border-border/60 h-40 w-full rounded-lg border p-2',
        className,
      )}
      role="img"
      aria-label="Journey map (abstract)"
    >
      <path
        d={normalized.path}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {normalized.pts.map((p) => {
        const isActive = p.id === activeId
        return (
          <g key={p.id} transform={`translate(${p.x} ${p.y})`}>
            <title>{p.title}</title>
            <circle
              r={isActive ? 4 : 3.5}
              fill="var(--color-background)"
              stroke={isActive ? 'var(--color-primary)' : 'var(--color-border)'}
              strokeWidth={2}
            />
            <circle
              r={isActive ? 1.8 : 1.4}
              fill={
                isActive
                  ? 'var(--color-primary)'
                  : 'var(--color-muted-foreground)'
              }
            />
          </g>
        )
      })}
    </svg>
  )
}

