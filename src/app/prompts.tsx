import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/prompts')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="md:w-content-wide lg:w-content-full mx-auto w-full px-4">
      <Outlet />
    </div>
  )
}
