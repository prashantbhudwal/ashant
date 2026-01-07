import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getAllContentServerFn } from "./index";
import { ContentType, type TPost } from "~/common/types/content.types";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { formatDate } from "~/client/helpers/format-date";
import { cn } from "~/client/lib/utils";
import { seo } from "~/client/lib/utils/seo";
import { C } from "~/common/constants";
import { PostCard } from "~/client/components/blog/post-card";

const navContentQueryOptions = queryOptions({
  queryKey: ["all-content-writings"],
  queryFn: () => getAllContentServerFn(),
});

export const Route = createFileRoute("/writings")({
  head: () => {
    const canonicalUrl = `${C.url}/writings`;
    return {
      meta: seo({
        title: "Writings | prashant",
        description: "Notes on software, design, and life.",
        image: `${C.url}/og-ashant.png`,
        keywords: "blog, notes, software, design, philosophy, startups",
        url: canonicalUrl,
      }),
      links: [{ rel: "canonical", href: canonicalUrl }],
    };
  },
  loader: async (opts) => {
    return await opts.context.queryClient.ensureQueryData(
      navContentQueryOptions,
    );
  },
  component: WritingsPage,
});

const allTags = [
  "startups",
  "business",
  "writing",
  "reading",
  "ai",
  "learning",
  "education",
  "philosophy",
  "software",
  "economics",
  "personal",
] as const;

function WritingsPage() {
  const content = useSuspenseQuery(navContentQueryOptions).data;
  const posts = content.filter(
    (item): item is TPost => item.type === ContentType.POST,
  );

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredPosts =
    selectedTags.length > 0
      ? posts.filter((post) =>
          post.tags.some((tag) => selectedTags.includes(tag)),
        )
      : posts;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-12">
        <h1 className="mb-4 text-3xl font-bold tracking-tight">Writings</h1>
        <p className="text-muted-foreground text-lg">
          Notes on the world, software and life.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                selectedTags.includes(tag)
                  ? "bg-foreground text-background"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted",
              )}
            >
              {tag}
            </button>
          ))}
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="text-muted-foreground hover:text-foreground text-xs underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <ul className="mb-6 sm:mb-8">
        {filteredPosts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} showTags />
          </li>
        ))}
      </ul>

      {filteredPosts.length === 0 && (
        <p className="text-muted-foreground py-12 text-center">
          No posts match the selected tags.
        </p>
      )}
    </div>
  );
}
