import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { ProjectCard } from '~/client/components/projects/project-card'
import { type TProject } from '~/common/types/project.types'

const PREVIEW_LIMIT = 5

type ProjectsSectionProps = {
  projects: TProject[]
  className?: string
}

export function ProjectsSection({ projects, className }: ProjectsSectionProps) {
  const displayProjects = projects.slice(0, PREVIEW_LIMIT)
  const remainingCount = projects.length - PREVIEW_LIMIT

  return (
    <section id="projects" className={className}>
      <h2 className="text-muted-foreground mb-6 text-sm font-medium tracking-widest uppercase sm:mb-8">
        Projects
      </h2>
      <ul className="divide-border/40 mb-6 divide-y sm:mb-8">
        {displayProjects.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>

      {remainingCount > 0 && (
        <Link
          to="/projects"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm font-medium transition-colors"
        >
          {remainingCount} more <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </section>
  )
}
