import { Link } from '@tanstack/react-router'
import { Button } from '~/client/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function StorySection({ className }: { className?: string }) {
  return (
    <section id="story" className={className}>
      <h2 className="text-muted-foreground mb-6 text-sm font-medium tracking-widest uppercase sm:mb-8">
        Story
      </h2>
      <div className="border-border/30 rounded-lg border p-4 sm:p-6">
        <h3 className="mb-1 text-lg font-bold tracking-tight sm:text-xl md:text-2xl">
          Prashant Bhudwal
        </h3>
        <p className="text-primary/80 mb-3 text-sm font-medium sm:mb-4">
          Engineering, Product & Education
        </p>
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed sm:mb-6">
          I am a product guy that codes. I have founded three Ed-tech startups,
          getting customers all three times and reaching recurring revenue
          twice. I build full-stack web applications with language models.
        </p>
        <Link to="/story">
          <Button variant="outline" size="sm" className="group gap-2">
            Read full story
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
