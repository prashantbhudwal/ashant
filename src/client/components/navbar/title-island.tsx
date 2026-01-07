import { Link } from "@tanstack/react-router";
import { cn } from "~/client/lib/utils";

type TTitleIslandProps = {
  className?: string;
};

export function TitleIsland({ className }: TTitleIslandProps) {
  return (
    <Link to="/">
      <span
        className={cn(
          "font-mono text-2xl font-bold md:text-3xl 2xl:text-4xl",
          className,
        )}
      >
        pr
        <span className="decoration-primary underline decoration-1 underline-offset-3 md:underline-offset-4 2xl:underline-offset-5">
          ashant
        </span>
      </span>
    </Link>
  );
}
