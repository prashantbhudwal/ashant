import { createFileRoute } from '@tanstack/react-router'
import { getSpaceBySlug } from '~/client/components/spaces/spaces'
import { useMemo } from 'react'
import { NotFound } from '~/client/components/NotFound'

export const Route = createFileRoute('/spaces/$slug')({
  component: RouteComponent,
  loader: async ({ params }) => {
    return params.slug
  },
})

function RouteComponent() {
  const slug = Route.useLoaderData()
  const space = useMemo(() => getSpaceBySlug({ slug }), [slug])

  if (!space) {
    return <NotFound />
  }

  const SpaceComponent = space.Component
  const config = {
    layoutWidth: space.layoutWidth,
    supportsMobile: space.supportsMobile,
  }

  return <SpaceComponent config={config} />
}
