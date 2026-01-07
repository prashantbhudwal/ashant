import { cn } from "~/client/lib/utils";
import { ActionIsland } from "./action-island";
import { TitleIsland } from "./title-island";
import { NavLinks } from "./nav-links";

export function Navbar({ className }: { className?: string }) {
  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full",
        "bg-background/80 border-border/10 border-b backdrop-blur-md",
        className,
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div className="w-40 shrink-0">
          <TitleIsland />
        </div>
        <NavLinks className="hidden md:flex" />
        <div className="flex w-40 shrink-0 justify-end">
          <ActionIsland />
        </div>
      </div>
      {/* Mobile nav links - below logo on small screens */}
      <div className="pt-3 md:hidden">
        <NavLinks />
      </div>
    </nav>
  );
}
