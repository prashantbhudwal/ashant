import { z } from "zod";
import type {
  TChunkConfig,
  TEmbeddingConfig,
} from "~/server/modules/vector/rag.config";
export enum ContentType {
  POST = "post",
  PROMPT = "prompt",
  SPACE = "space",
}
export type TContentType = (typeof ContentType)[keyof typeof ContentType];

const ZContentBase = z.object({
  id: z.string(),
  slug: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  title: z.string(),
  shortTitle: z.string().optional(),
  description: z.string().optional(),
  heroImage: z.string().optional(),
  tags: z.array(
    z.enum([
      "startups",
      "business",
      "writing",
      "reading",
      "ai",
      "learning",
      "education",
      "philosophy",
      "software",
      "economics",
      "personal",
      "health",
      "thinking",
    ]),
  ),
});

type TContentBase = z.infer<typeof ZContentBase>;

export const ZPostFrontmatter = ZContentBase.pick({
  id: true,
  title: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
  shortTitle: true,
  description: true,
  heroImage: true,
  tags: true,
});

export type TPost = TContentBase & {
  type: ContentType.POST;
  content: string;
};
export type TSpace = TContentBase & {
  type: ContentType.SPACE;
  Component: React.ComponentType<{
    config?: Pick<TSpace, "layoutWidth" | "supportsMobile">;
  }>;
  /** Layout width: narrow (max-w-2xl), default (max-w-3xl), wide (max-w-5xl), full (max-w-6xl) */
  layoutWidth?: "narrow" | "default" | "wide" | "full";
  /** If false, shows a fallback message on mobile devices */
  supportsMobile?: boolean;
};

export type TPrompt = TContentBase & {
  type: ContentType.PROMPT;
  prompt: string;
  keyword?: string;
  context?: string;
  arguments?: Record<string, string>;
};

export type TPostIndexingMetadata = (TPost | TSpace | TPrompt) & {
  embeddingConfig: TEmbeddingConfig;
  isChunked: boolean;
  chunkConfig: TChunkConfig | null;
};

// Union type for all content types
export type TContent = TPost | TSpace | TPrompt;

// Serializable version for server functions (omits non-serializable Component)
export type TSerializableSpace = Omit<TSpace, "Component">;
export type TSerializableContent = TPost | TSerializableSpace | TPrompt;
