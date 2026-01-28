import { createFileRoute } from '@tanstack/react-router'
import { Story } from '~/client/components/story/story'

export const Route = createFileRoute('/story')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mx-auto max-w-2xl">
      <Story />
    </div>
  )
}
