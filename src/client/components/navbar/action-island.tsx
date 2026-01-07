"use client";
import { Link } from "@tanstack/react-router";
import { FaXTwitter, FaGithub, FaAddressBook, FaDiceD6 } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { Button } from "~/client/components/ui/button";
import { cn } from "~/client/lib/utils";
import { useAtom, useSetAtom } from "jotai";
import { SearchModalAtom } from "../search/search-modal-atom";

type ActionItem = {
  icon: React.ReactElement;
  link: string;
  name: string;
  target: string;
};

const actionItems: ActionItem[] = [];

export function ActionIsland({ className }: { className?: string }) {
  // const segment = useSelectedLayoutSegment();
  // if (segment === "(spaces)" || segment === "story") {
  //   return null;
  // }

  return (
    <ul className={cn(className)}>
      {actionItems.map((action) => (
        <Button size="icon" variant="ghost" key={action.name}>
          <Link
            to={action.link}
            className="flex items-center transition-all"
            rel="noopener noreferrer"
            target={action.target}
          >
            {action.icon}
          </Link>
        </Button>
      ))}
      <ActionIslandButtons />
    </ul>
  );
}

export function ActionIslandButtons({ className }: { className?: string }) {
  const setSearchModalOpen = useSetAtom(SearchModalAtom);

  return (
    <>
      {/* Desktop: Full search bar style */}
      <button
        onClick={() => setSearchModalOpen(true)}
        className="border-border/50 bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:border-border hidden items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors md:flex"
      >
        <FaSearch className="h-3.5 w-3.5" />
        <span>Search...</span>
        <kbd className="border-border/50 bg-muted text-muted-foreground pointer-events-none ml-2 inline-flex h-5 items-center justify-center gap-1 rounded border px-1.5 font-sans text-[10px] font-medium select-none">
          <span className="opacity-70">⌘</span>
          <span>K</span>
        </kbd>
      </button>

      {/* Mobile: Icon only */}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setSearchModalOpen(true)}
        className="md:hidden"
      >
        <FaSearch className="text-muted-foreground h-4 w-4" />
      </Button>
    </>
  );
}
