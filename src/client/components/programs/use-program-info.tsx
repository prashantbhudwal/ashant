import { useParams } from '@tanstack/react-router'
import { useMemo } from 'react'
import { getProgramBySlug } from '~/client/components/programs/programs'
import { link } from '~/client/lib/link'

type TProgramInfo = {
  programTitle: string | null
  programId: string | null
  programUrl: string | null
  programShortTitle: string | null
}

const DEFAULT_PROGRAM_INFO: TProgramInfo = {
  programTitle: null,
  programId: null,
  programUrl: null,
  programShortTitle: null,
}

export function useProgramInfo(): TProgramInfo {
  const programSlug = useParams({
    from: '/programs/$slug',
    select: (params) => params.slug,
    structuralSharing: true,
    shouldThrow: false,
  })

  return useMemo(() => {
    if (!programSlug) return DEFAULT_PROGRAM_INFO

    const program = getProgramBySlug({ slug: programSlug })
    if (!program) return DEFAULT_PROGRAM_INFO

    return {
      programTitle: program.title.toLowerCase(),
      programId: program.id,
      programUrl: link.url.internal.program({ slug: program.slug }),
      programShortTitle: program.shortTitle?.toLowerCase() ?? null,
    }
  }, [programSlug])
}
