import { Suspense } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getWeekOfLife } from "~/common/utils/date";
import { seo } from "~/client/lib/utils/seo";
import { C } from "~/common/constants";
import {
  type TSerializableContent,
  type TPost,
  type TSerializableSpace,
  type TPrompt,
  ContentType,
} from "~/common/types/content.types";
import { createServerFn } from "@tanstack/react-start";
import { getAllContent } from "~/server/modules/content/get-all-content";
import { queryOptions, useQuery } from "@tanstack/react-query";
// import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import { WritingsSection } from "~/client/components/home/writings-section";
import { ToolsSection } from "~/client/components/home/tools-section";
import { PromptsSection } from "~/client/components/home/prompts-section";
import { StorySection } from "~/client/components/home/story-section";
import { Button } from "~/client/components/ui/button";
import { HomePending } from "~/client/components/home/home-pending";

const shouldUseStaticCache = false;

export const getAllContentServerFn = createServerFn({ method: "GET" })
  .middleware([])
  .handler(async (): Promise<TSerializableContent[]> => {
    const content = await getAllContent();
    const serializable: TSerializableContent[] = content.map((item) => {
      // Handle Spaces: remove Component
      if (item.type === ContentType.SPACE && "Component" in item) {
        const { Component, ...rest } = item;
        return rest;
      }
      // Handle Posts: remove content string to reduce payload
      if (item.type === ContentType.POST) {
        const { content: _, ...rest } = item;
        return { ...rest, content: "" };
      }
      return item;
    });
    return serializable;
  });

const contentQueryOptions = queryOptions({
  queryKey: ["all-content"],
  queryFn: () => getAllContentServerFn(),
});

export const Route = createFileRoute("/")({
  head: () => {
    const imagePath = `${C.url}/og-ashant.png`;
    return {
      title: "prashant",
      meta: seo({
        title: "prashant",
        description: `Notes on the world, software and life. Week ${getWeekOfLife()}.`,
        keywords: "prashant, blog, notes, software, life, tools, prompts",
        image: imagePath,
        imageType: "image/png",
        url: C.url,
      }),
      links: [
        { rel: "canonical", href: C.url },
        {
          rel: "alternate",
          type: "application/rss+xml",
          href: `${C.url}/api/feed.xml`,
        },
      ],
    };
  },
  loader: async () => {
    // No prefetch - force client-side fetch for instant skeleton
    return;
  },
  component: HomePageContent,
});

function HomePageContent() {
  const { data: content, status } = useQuery(contentQueryOptions);
  const isLoading = status === "pending";

  return <HomePage content={content || []} isLoading={isLoading} />;
}

function HomePage({
  content,
  isLoading,
}: {
  content: TSerializableContent[];
  isLoading: boolean;
}) {
  const posts = content.filter(
    (item): item is TPost => item.type === ContentType.POST,
  );
  const spaces = content.filter(
    (item): item is TSerializableSpace => item.type === ContentType.SPACE,
  );
  const prompts = content.filter(
    (item): item is TPrompt => item.type === ContentType.PROMPT,
  );

  return (
    <div className="mx-auto max-w-2xl pt-4 sm:pt-6">
      {/* Sections */}
      <div className="mt-8 space-y-16 sm:mt-12 sm:space-y-24">
        <WritingsSection posts={posts} isLoading={isLoading} />
        {(isLoading || spaces.length > 0) && (
          <ToolsSection spaces={spaces} isLoading={isLoading} />
        )}
        {(isLoading || prompts.length > 0) && (
          <PromptsSection prompts={prompts} isLoading={isLoading} />
        )}
        <StorySection />
      </div>
    </div>
  );
}

function HeroPost({ post }: { post: TSerializableContent }) {
  return (
    <section className="border-border/30 border-b py-10">
      <Link
        to="/blog/$slug"
        params={{ slug: post.slug }}
        className="group block"
      >
        <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
          <span>Latest</span>
          <span>·</span>
          <time>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </div>
        <h2 className="text-foreground group-hover:text-primary text-2xl font-semibold transition-colors md:text-3xl">
          {post.title}
        </h2>
        {post.description && (
          <p className="text-muted-foreground mt-2 line-clamp-2 max-w-xl text-base">
            {post.description}
          </p>
        )}
      </Link>
    </section>
  );
}
