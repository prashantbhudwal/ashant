import { useLocation } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useProgramInfo } from '~/client/components/programs/use-program-info'

type TPathInfo = {
  segments: string[]
  segment: string | null
  isRoot: boolean
  isBlog: boolean
  isProgram: boolean
  backLink: string
  showSiteName: boolean
  programInfo: ReturnType<typeof useProgramInfo> | null
}

const getBackLink = (pathname: string, isProgram: boolean): string => {
  if (isProgram) return '/programs'

  const backLinkMap: Record<string, string> = {
    '/': '/',
    '/blog': '/',
    '/programs': '/',
    '/programs/$slug': '/programs',
  }

  return backLinkMap[pathname] ?? '/'
}

export function usePathInfo(): TPathInfo {
  const pathname = useLocation({
    select: (loc) => loc.pathname,
    structuralSharing: true,
  })

  const programInfoData = useProgramInfo()

  return useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    const lastSegment = segments[segments.length - 1] ?? null
    const isRoot = lastSegment === null
    const isBlog = segments.includes('blog')
    const isProgram = segments.includes('programs') && segments.length > 1
    const backLink = getBackLink(pathname, isProgram)
    const showSiteName = isRoot || isBlog
    const programInfo = isProgram ? programInfoData : null

    return {
      segments,
      segment: lastSegment,
      isRoot,
      isBlog,
      isProgram,
      backLink,
      showSiteName,
      programInfo,
    }
  }, [pathname, programInfoData])
}
