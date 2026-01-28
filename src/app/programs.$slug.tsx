import { createFileRoute } from '@tanstack/react-router'
import { getProgramBySlug } from '~/client/components/programs/programs'
import { useMemo } from 'react'
import { NotFound } from '~/client/components/NotFound'

export const Route = createFileRoute('/programs/$slug')({
  component: RouteComponent,
  loader: async ({ params }) => {
    return params.slug
  },
})

function RouteComponent() {
  const slug = Route.useLoaderData()
  const program = useMemo(() => getProgramBySlug({ slug }), [slug])

  if (!program) {
    return <NotFound />
  }

  const ProgramComponent = program.Component
  const config = {
    layoutWidth: program.layoutWidth,
    supportsMobile: program.supportsMobile,
  }

  return <ProgramComponent config={config} />
}
