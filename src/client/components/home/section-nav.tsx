"use client";

import { useEffect, useState } from "react";
import { cn } from "~/client/lib/utils";

const sections = [
  { id: "writings", label: "Writings" },
  { id: "tools", label: "Tools" },
  { id: "prompts", label: "Prompts" },
];

export function SectionNav({ className }: { className?: string }) {
  const [activeSection, setActiveSection] = useState("writings");

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const scrollBottom = window.scrollY + viewportHeight;
      const docHeight = document.documentElement.scrollHeight;

      // If at the bottom of the page, activate the last visible section
      if (scrollBottom >= docHeight - 50) {
        // Find the last section that exists on the page
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i].id);
          if (el) {
            setActiveSection(sections[i].id);
            return;
          }
        }
      }

      // Otherwise find the section with the most visibility
      let bestSection = sections[0].id;
      let bestVisibility = 0;

      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const sectionTop = Math.max(0, rect.top);
        const sectionBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, sectionBottom - sectionTop);

        if (visibleHeight > bestVisibility) {
          bestVisibility = visibleHeight;
          bestSection = id;
        }
      }

      setActiveSection(bestSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 160;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav
      className={cn(
        "bg-background border-border/30 sticky top-[84px] z-40 -mx-4 border-b px-4 py-3",
        className,
      )}
    >
      <div className="flex gap-1">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeSection === id
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
