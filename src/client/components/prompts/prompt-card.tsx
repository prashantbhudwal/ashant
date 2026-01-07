import { useState } from "react";
import { type TPrompt } from "~/common/types/content.types";
import { cn } from "~/client/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu";
import { ChevronDown, Copy, ExternalLink } from "lucide-react";
import { Markdown } from "~/client/components/blog/mdx/md.client";

interface PromptCardProps {
  prompt: TPrompt;
}

/**
 * Generates a Raycast snippet sharing URL
 */
function generateRaycastUrl(prompt: TPrompt): string {
  const snippet = {
    keyword: prompt.keyword || "",
    text: prompt.prompt,
    name: prompt.shortTitle ?? prompt.title,
  };
  const encoded = encodeURIComponent(JSON.stringify(snippet));
  return `https://ray.so/snippets/shared?snippet=${encoded}`;
}

export function PromptCard({ prompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const promptText = prompt.prompt;
  const isLong = promptText.length > 300;

  const handleCopyText = async () => {
    await navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportToRaycast = () => {
    const url = generateRaycastUrl(prompt);
    window.open(url, "_blank");
  };

  // Wrap prompt in code block for rendering
  const promptMarkdown = "```xml\n" + promptText + "\n```";

  return (
    <div className="border-border/30 rounded-lg border">
      {/* Header - always visible */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="hover:bg-muted/30 flex cursor-pointer items-start justify-between gap-3 p-3 transition-colors select-none sm:gap-4 sm:p-4"
      >
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-primary/60 font-mono text-sm">{">"}</span>
            <span className="text-foreground text-base font-medium md:text-lg">
              {prompt.shortTitle ?? prompt.title}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">{prompt.description}</p>
        </div>
        <div
          className="flex shrink-0 gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                  copied
                    ? "bg-green-500/20 text-green-600 dark:text-green-400"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {copied ? "Copied!" : "Copy"}
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopyText}>
                <Copy className="mr-2 h-4 w-4" />
                Copy as Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImportToRaycast}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Import to Raycast
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Expandable prompt content */}
      {expanded && (
        <div className="border-border/30 border-t">
          {prompt.context && (
            <div className="bg-muted/30 border-border/30 border-b px-6 py-6">
              <span className="text-muted-foreground/50 mb-3 block text-[10px] font-bold tracking-widest uppercase">
                Context
              </span>
              <Markdown
                content={prompt.context}
                className="prose-sm text-muted-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              />
            </div>
          )}
          <div className="bg-muted/40 hover:bg-muted/50 px-6 py-6 transition-colors">
            <span className="text-muted-foreground/50 mb-3 block text-[10px] font-bold tracking-widest uppercase">
              Prompt
            </span>
            <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40 border-border/50 bg-background max-h-96 overflow-y-auto rounded-md border">
              <Markdown
                content={promptMarkdown}
                className="prose-pre:!bg-transparent prose-pre:!p-6 prose-pre:rounded-none prose-pre:whitespace-pre-wrap prose-pre:break-words prose-code:break-words prose-code:font-mono prose-pre:font-mono min-w-full"
              />
            </div>
          </div>

          {prompt.arguments && Object.keys(prompt.arguments).length > 0 && (
            <div className="bg-muted/30 border-border/30 border-t px-6 py-6">
              <span className="text-muted-foreground/50 mb-3 block text-[10px] font-bold tracking-widest uppercase">
                Arguments
              </span>
              <div className="grid gap-3">
                {Object.entries(prompt.arguments).map(([key, desc]) => (
                  <div
                    key={key}
                    className="grid grid-cols-[100px_1fr] gap-4 text-xs sm:grid-cols-[140px_1fr]"
                  >
                    <code className="bg-muted text-primary/90 h-fit w-fit rounded px-1.5 py-0.5 font-mono font-medium">
                      {key}
                    </code>
                    <span className="text-muted-foreground leading-relaxed">
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isLong && (
            <div className="border-border/30 text-muted-foreground border-t px-6 py-3 text-center text-xs">
              {promptText.length.toLocaleString()} characters
            </div>
          )}
        </div>
      )}
    </div>
  );
}
