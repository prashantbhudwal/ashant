import { Skeleton } from "~/client/components/ui/skeleton";

export function HomePending() {
  return (
    <div className="mx-auto max-w-2xl pt-4 sm:pt-6">
      <div className="mt-8 space-y-16 sm:mt-12 sm:space-y-24">
        {/* Writings Section Skeleton */}
        <section>
          <Skeleton className="mb-6 h-6 w-24" /> {/* Section Title */}
          <div className="space-y-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-12" />
                  <span className="text-muted-foreground/20">·</span>
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-7 w-3/4 sm:h-9" />
                <Skeleton className="h-16 w-full" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tools Section Skeleton */}
        <section>
          <Skeleton className="mb-6 h-6 w-24" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="border-border/40 space-y-3 rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-md" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Prompts Section Skeleton */}
        <section>
          <Skeleton className="mb-6 h-6 w-24" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
