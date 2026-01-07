import { cache } from "react";
import { type TPrompt, ContentType } from "~/common/types/content.types";
import { allPrompts } from "content-collections";

export const getAllPrompts = cache(async (): Promise<TPrompt[]> => {
  const prompts: TPrompt[] = allPrompts.map((prompt) => {
    const { _meta, ...rest } = prompt;
    return {
      ...rest,
      type: ContentType.PROMPT,
    };
  });
  return prompts;
});
