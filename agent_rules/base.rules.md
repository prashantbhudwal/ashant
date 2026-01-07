---
trigger: always_on
---

# Ideabox (Blog)

**Project Path**: `/Users/prashantbhudwal/Code/ideabox`

## Overview

Ideabox is a personal blog and digital garden application. While it contains legacy references to "Renaissance Reader", its primary function is serving MDX-based content ("posts") with advanced AI and search capabilities.

## Tech Stack

### Core

- **Language**: TypeScript
- **Runtime**: Node.js
- **Package Manager**: pnpm ({% file_link "package.json" %})

### Frontend

- **Framework**: TanStack Start (Vite + React)
- **Routing**: TanStack Router (`src/app` directory, e.g., {% file_link "src/app/blog.$slug.tsx" %})
- **Styling**: Tailwind CSS (v4), Shadcn UI.
  - **Custom Utilities**: Defined in `src/styles/globals.css` (e.g., `w-content-narrow` for stable layout widths).
- **State Management**: Zustand, Jotai
- **Client Components**: `src/client/components`

### Frontend Architecture

- **Global Layout**:
  - Defined in `src/app/__root.tsx`.
  - Wraps the application in a `RootLayout` which provides the `Sidebar`, `Theme`, and `Navbar`.
- **Header (Navbar)**:
  - Located at `src/client/components/navbar`.
  - Composed of "Islands": `TitleIsland` (Navigation/Branding) and `ActionIsland` (Socials/Search).
- **Homepage (`src/app/index.tsx`)**:
  - **Structure**: Divided into distinct sections managed by `SectionNav` for sticky in-page navigation.
    - **Writings**: Blog posts with interactive 11-tag filtering system (10 posts visible initially, "Show more" for rest).
    - **Tools**: Interactive spaces/tools grid (formerly "Spaces").
    - **Prompts**: Collection of AI system prompts with "Import to Raycast" and "Copy as Text" functionality. Cards are expandable, displaying rich context and the prompt code block.
    - **Data Fetching**:
    - `getAllContentServerFn`: Aggregates Posts, Spaces, and Prompts into a single `TContent[]` array.
    - Sorted chronologically by `createdAt`.
    - **Deployment Note**: Prerendering is currently **DISABLED** (`prerender: { enabled: false }` in `vite.config.ts`) to prevent a build hang deadlock.
    - **Vercel Config**:
      - `staticFunctionMiddleware` is disabled (`shouldUseStaticCache = false`) to force server-side execution.
      - Explicit route rules (`vite.config.ts`) ensure `/_server/**` requests bypass Vercel's static cache.
- **Spaces (Tools)**:
  - Interactive mini-apps defined in `spaces.ts` (e.g., Sweetener Comparison, Text Similarity).
  - Rendered via grid layout in `ToolsSection`.

### Backend

- **Server API**: tRPC (`src/server/trpc`)
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM (`src/server/db`, `drizzle/`)
- **Authentication**: `better-auth`

### Content & AI

- **Content Engine**: `content-collections` (MDX processing)
  - Config: {% file_link "content-collections.ts" %}
  - **Unified Content Type**: `TContent` = `TPost` | `TSpace` | `TPrompt`
  - **Collections**:
    1.  **Posts** (`src/content/posts`):
        - Schema includes `title`, `shortTitle`, `tags` (11-tag enum), `description`.
    2.  **Prompts** (`src/content/prompts`):
        - **Format**: Section-based Markdown (`## Context`, lines of text; `## Prompt`, code block).
        - **Schema**: `keyword` (for Raycast), `arguments` (placeholders), `context`, `prompt`.
        - **Transformation**: `parsePromptContent` extracts sections at build time.
    3.  **Generators**:
        - `pnpm prompt:create`: Scaffolds new prompt files using `src/common/scripts/create-prompt.ts`.
- **AI Framework**: Mastra (`src/server/mastra`)
  - Modules for RAG, memory, and agents.

### Features & Spaces

- **Spaces**:
  - **Definition**: Focused, interactive micro-applications defined in `src/client/components/spaces/spaces.ts`.
  - **Structure**:
    - Each space is a React component (e.g., `ChunkerSpace`, `SweetenerSpace`).
    - Often leverage **Server Functions** (`createServerFn`) for backend logic (e.g., text chunking, embeddings).
    - Uses `react-hook-form` and `zod` for interactivity.
  - **Location**: `src/client/components/spaces/`
- **Search**:
  - Vector Search: Qdrant
  - Full-text Search: MiniSearch
- **Modules**:
  - `post`: Blog post logic
  - `search`: Indexing and retrieval
  - `vector`: Embeddings and semantic search
  - `reader`: Legacy/Sub-module for reading features

## Project Structure

- **`src/app`**: Application routes (TanStack Router).
  - `index.tsx`: Home page.
  - `blog.$slug.tsx`: Single post view.
  - `api.trpc.$.tsx`: TRPC API handler.
- **`src/server`**: Backend logic.
  - `modules/`: Domain sets (post, search, vector).
  - `mastra/`: AI agent configuration.
- **`src/client`**: Frontend-only code (components, hooks).
- **`src/content`**: Static content (MDX files).

## UI Design Philosophy

### Core Principles

1. **Minimalism Over Clutter**
   - Avoid redundant UI elements (e.g., no dual-sticky bars).
   - Copy should be tight — remove words that context makes obvious.
   - Prefer simplicity over decoration.

2. **Symmetry & Alignment**
   - Navbar elements should be visually balanced (e.g., logo and search equal widths).
   - Content should align horizontally across sections.
   - Layouts should feel intentional and structured.

3. **Consistency**
   - Cards and containers should share the same visual treatment (backgrounds, borders, padding).
   - Typography hierarchy should be consistent across sections.
   - Avoid one-off styling that breaks the visual language.

4. **Proportional Typography**
   - Text sizes should scale subtly between breakpoints (e.g., `text-sm` → `text-[15px]`).
   - Avoid aggressive jumps that feel jarring.
   - Titles, descriptions, and labels should share a clear hierarchy.

5. **Meaningful Copy**
   - "View all" links should show exact counts (e.g., "3 more" not "View all").
   - Conditional rendering — don't show elements if there's nothing to show.
   - Avoid redundant words (e.g., "3 more" not "3 more writings" under a "WRITINGS" heading).

6. **Functional Affordances**
   - Search should look like a search bar (input-style with placeholder + keyboard hint).
   - Keyboard shortcuts should be clearly displayed and legible.
   - Sticky footers should stay at the bottom of the viewport.

7. **Layout Stability & Fixed Widths**
   - **Problem**: Fluid layouts (`max-w-*`) can cause horizontal layout shifts when content varies.
   - **Solution**: Use **Fixed Width** containers for main content areas.
   - **Implementation**: Custom Tailwind utilities (`w-content-*`) ensure content containers snap to predictable sizes at specific breakpoints.
     - `w-content-narrow` (42rem / 672px): Focused reading (posts).
     - `w-content-default` (48rem / 768px): Standard pages.
     - `w-content-wide` (64rem / 1024px): Grid layouts (tools/spaces).
     - `w-content-full` (80rem / 1280px): Dashboard views.

8. **Responsive Design**
   - All elements must work on both mobile and desktop.
   - Typography should scale appropriately — readable on phones, not overwhelming on large monitors.
   - Mobile-first: design for mobile (`w-full`), then lock to fixed widths on larger screens (`w-content-*`).
   - Use Tailwind breakpoints (`sm`, `md`, `lg`) for responsive adjustments.
   - **Fixed Widths**: Prefer fixed-width containers (`w-content-narrow`, etc.) over fluid `max-w-*` containers for main content areas to prevent layout shifts.
   - Desktop-specific UI (e.g., search bar with `⌘K` hint) can simplify to icon-only on mobile.

### Styling Preferences

| Element          | Preference                                                                   |
| ---------------- | ---------------------------------------------------------------------------- |
| Card backgrounds | Transparent or subtle (`bg-muted/30` avoided, prefer border-only)            |
| Borders          | Subtle, consistent (`border-border/30`)                                      |
| Padding          | Consistent across similar components (`p-4` or `p-6`)                        |
| Border radius    | Prefer `rounded-lg` for cards                                                |
| Typography       | `text-foreground` for titles, `text-muted-foreground` for secondary text     |
| Links            | Minimal copy, show counts, include context when helpful (e.g., tag previews) |

---
