import { Link } from "@tanstack/react-router";
import { type TPost } from "~/common/types/content.types";
import { formatDate } from "~/client/helpers/format-date";
import { cn } from "~/client/lib/utils";

interface PostCardProps {
  post: TPost;
  isLatest?: boolean;
  showTags?: boolean;
}

export function PostCard({
  post,
  isLatest = false,
  showTags = false,
}: PostCardProps) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group block py-5 sm:py-6"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3
            className={cn(
              "group-hover:text-primary transition-colors",
              isLatest
                ? "text-foreground text-base font-semibold sm:text-lg md:text-xl"
                : "text-foreground text-base font-medium sm:text-lg",
            )}
          >
            {post.title}
          </h3>
          {isLatest && (
            <span className="bg-primary/10 text-primary shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase">
              New
            </span>
          )}
        </div>
        <time className="text-muted-foreground/70 text-xs tabular-nums">
          {formatDate(post.createdAt)}
        </time>
        {post.description && (
          <p className="text-muted-foreground/60 mt-0.5 line-clamp-2 text-sm">
            {post.description}
          </p>
        )}
        {showTags && post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-muted-foreground/60 bg-muted/30 rounded px-1.5 py-0.5 text-[10px] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
