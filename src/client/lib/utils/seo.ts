import { C } from "~/common/constants";

interface SeoOptions {
  title: string;
  description?: string;
  image?: string;
  keywords?: string;
  type?: "website" | "article";
  imageType?: "image/webp" | "image/png" | "image/jpeg";
  /** Full canonical URL for this page (e.g., https://ashant.in/blog/my-post) */
  url?: string;
  /** ISO date string for article published time */
  publishedTime?: string;
  /** ISO date string for article modified time */
  modifiedTime?: string;
  /** Reading time in minutes (for Twitter card labels) */
  readingTime?: number;
}

export const seo = ({
  title,
  description,
  keywords,
  image,
  type = "website",
  imageType = "image/png",
  url,
  publishedTime,
  modifiedTime,
  readingTime,
}: SeoOptions) => {
  const canonicalUrl = url ?? C.url;

  const tags = [
    // Basic
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },

    // Twitter
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:creator", content: C.xHandle },
    { name: "twitter:site", content: C.xHandle },

    // Twitter reading time labels (only for articles)
    ...(readingTime
      ? [
          { name: "twitter:label1", content: "Reading time" },
          { name: "twitter:data1", content: `${readingTime} min` },
        ]
      : []),

    // OpenGraph / Article (must use `property` for FB & LinkedIn)
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "article:author", content: C.fullName },
    { property: "og:url", content: canonicalUrl },
    { property: "og:site_name", content: "ashant" },
    { property: "og:locale", content: "en_US" },

    // Article-specific timestamps
    ...(publishedTime
      ? [{ property: "article:published_time", content: publishedTime }]
      : []),
    ...(modifiedTime
      ? [{ property: "article:modified_time", content: modifiedTime }]
      : []),

    // Robots directives
    { name: "robots", content: "index,follow" },
    {
      name: "googlebot",
      content:
        "index,follow,max-video-preview:-1,max-image-preview:large,max-snippet:-1",
    },

    // Social image (adds only if `image` provided)
    ...(image
      ? [
          { name: "twitter:image", content: image },
          { name: "twitter:card", content: "summary_large_image" },
          { property: "og:image", content: image },
          { property: "og:image:width", content: "1200" },
          { property: "og:image:height", content: "630" },
          { property: "og:image:alt", content: title },
          { property: "og:image:type", content: imageType },
        ]
      : []),
  ];

  return tags;
};
