"use client";

import { Link } from "@tanstack/react-router";

import { type TPrompt } from "~/common/types/content.types";
import { ArrowRight } from "lucide-react";
import { PromptCard } from "~/client/components/prompts/prompt-card";
import { Skeleton } from "~/client/components/ui/skeleton";

type PromptsSectionProps = {
  prompts: TPrompt[];
  className?: string;
  isLoading?: boolean;
};

/**
 * Generates a Raycast snippet sharing URL
 */
function generateRaycastUrl(prompt: TPrompt): string {
  const snippet = {
    keyword: prompt.keyword || "",
    text: prompt.prompt,
    name: prompt.shortTitle ?? prompt.title,
  };
  const encoded = encodeURIComponent(JSON.stringify(snippet));
  return `https://ray.so/snippets/shared?snippet=${encoded}`;
}

const PREVIEW_LIMIT = 5;

export function PromptsSection({
  prompts,
  className,
  isLoading,
}: PromptsSectionProps) {
  const displayPrompts = prompts.slice(0, PREVIEW_LIMIT);
  const remainingCount = prompts.length - PREVIEW_LIMIT;

  return (
    <section id="prompts" className={className}>
      <h2 className="text-muted-foreground mb-6 text-sm font-medium tracking-widest uppercase sm:mb-8">
        Prompts
      </h2>
      <div className="mb-6 space-y-2 sm:mb-8 sm:space-y-3">
        {isLoading
          ? [...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))
          : displayPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
      </div>

      {remainingCount > 0 && (
        <Link
          to="/prompts"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm font-medium transition-colors"
        >
          {remainingCount} more <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </section>
  );
}
