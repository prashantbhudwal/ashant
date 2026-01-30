import { Link } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6'

import { Button } from '~/client/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/client/components/ui/card'
import { link } from '~/client/lib/link'

import { resolutionAtom } from './resolution-atom'

export function SummaryCard() {
  const resolution = useAtomValue<number>(resolutionAtom)

  return (
    <Card className="border-border/60 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_0%,hsl(var(--primary)/0.15),transparent_60%)]"
      />
      <CardHeader className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl tracking-tight text-balance sm:text-3xl">
              Prashant Bhudwal
            </CardTitle>
            <CardDescription className="text-primary/80 max-w-md text-sm font-medium">
              Engineering · Product · Education
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Link to={link.url.external.authorProfile.linkedIn} target="_blank">
              <Button variant="outline" size="sm" className="gap-2">
                <FaLinkedin />
                <span className="hidden sm:inline">LinkedIn</span>
              </Button>
            </Link>
            <Link to={link.url.external.authorProfile.x} target="_blank">
              <Button variant="outline" size="sm" className="gap-2">
                <FaXTwitter />
                <span className="hidden sm:inline">X</span>
              </Button>
            </Link>
            <Link to={link.url.external.authorProfile.github} target="_blank">
              <Button variant="outline" size="sm" className="gap-2">
                <FaGithub />
                <span className="hidden sm:inline">GitHub</span>
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-muted-foreground leading-relaxed">
          I’m a product guy that codes. I’ve founded three Ed‑tech startups -
          got customers each time, reached recurring revenue twice, and learned
          a lot from all three. These days I build full‑stack web apps with
          language models, mostly in TypeScript (React, Tailwind, tRPC, Prisma,
          Tanstack, Postgres, AISDK).
        </p>
        <p className="text-muted-foreground leading-relaxed">
          This is NOT a resume. It is a narrative of my life. If you prefer the
          conventional route - click the LinkedIn button.
        </p>
      </CardContent>
    </Card>
  )
}
