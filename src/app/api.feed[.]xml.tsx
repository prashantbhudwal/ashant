import { createFileRoute } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { C } from "~/common/constants";

export const Route = createFileRoute("/api/feed.xml")({
  server: {
    handlers: {
      GET: async () => {
        const posts = allPosts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>prashant</title>
    <link>${C.url}</link>
    <description>Notes on the world, software and life.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${C.url}/api/feed.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map((post) => {
        const postUrl = `${C.url}/blog/${post.slug}`;
        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.description}]]></description>
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

        return new Response(feed, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control":
              "public, max-age=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
