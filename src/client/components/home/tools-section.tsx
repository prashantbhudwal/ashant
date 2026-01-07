"use client";

import { Link } from "@tanstack/react-router";
import { type TSerializableSpace } from "~/common/types/content.types";
import { link } from "~/client/lib/link";
import { Image } from "~/client/components/image";
import { cn } from "~/client/lib/utils";
import { ArrowRight } from "lucide-react";
import { SpaceCard } from "~/client/components/spaces/space-card";
import { Skeleton } from "~/client/components/ui/skeleton";

const PREVIEW_LIMIT = 5;

type ToolsSectionProps = {
  spaces: TSerializableSpace[];
  className?: string;
  isLoading?: boolean;
};

export function ToolsSection({
  spaces,
  className,
  isLoading,
}: ToolsSectionProps) {
  const displaySpaces = spaces.slice(0, PREVIEW_LIMIT);
  const remainingCount = spaces.length - PREVIEW_LIMIT;

  return (
    <section id="tools" className={className}>
      <h2 className="text-muted-foreground mb-6 text-sm font-medium tracking-widest uppercase sm:mb-8">
        Tools
      </h2>
      <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4">
        {isLoading
          ? [...Array(4)].map((_, i) => (
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
            ))
          : displaySpaces.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
      </div>

      {remainingCount > 0 && (
        <Link
          to="/spaces"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm font-medium transition-colors"
        >
          {remainingCount} more <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </section>
  );
}
