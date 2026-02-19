import { type TProject } from '~/common/types/project.types'
import { cn } from '~/client/lib/utils'

type ProjectCardProps = {
  project: TProject
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <a
      href={project.repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full py-3 sm:py-4"
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3
            className={cn(
              'text-foreground text-base font-medium capitalize transition-colors sm:text-lg',
              'group-hover:text-primary',
            )}
          >
            {project.name}
          </h3>
        </div>

        <p className="text-muted-foreground/70 mt-0.5 line-clamp-2 text-sm">
          {project.description}
        </p>
      </div>
    </a>
  )
}
