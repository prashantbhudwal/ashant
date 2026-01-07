import { Link } from "@tanstack/react-router";
import { type TSerializableSpace } from "~/common/types/content.types";
import { link } from "~/client/lib/link";
import { Image } from "~/client/components/image";
import { cn } from "~/client/lib/utils";

interface SpaceCardProps {
  space: TSerializableSpace;
}

export function SpaceCard({ space }: SpaceCardProps) {
  return (
    <Link
      to="/spaces/$slug"
      params={{ slug: space.slug }}
      className="group block"
    >
      <div
        className={cn(
          "relative h-36 overflow-hidden rounded-lg sm:h-48 sm:rounded-xl",
          "border-border/50 hover:border-border border transition-all",
          "hover:outline-primary hover:outline",
        )}
      >
        {space.heroImage && (
          <Image
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            src={link.path.images.spaces({ imgName: space.heroImage })}
            alt={`${space.title} - ${space.description}`}
            fill
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute right-0 bottom-0 left-0 p-3 sm:p-4">
          <h3 className="text-base font-semibold text-white drop-shadow-md sm:text-lg">
            {space.shortTitle ?? space.title}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-white/80 sm:mt-1 sm:text-sm">
            {space.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
