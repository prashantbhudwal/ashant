import { cn } from "~/client/lib/utils";
import { TbShovel } from "react-icons/tb";
import { useState } from "react";
import { Button } from "./ui/button";

export async function WIP({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "text-muted-foreground/60 flex items-center space-x-2 rounded py-4 italic",
        className,
      )}
    >
      <TbShovel />
      <span className="sm:hidden">WIP</span>
    </div>
  );
}
