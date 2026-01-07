import { Button } from "~/client/components/ui/button";
import { useState } from "react";
import { Input } from "~/client/components/ui/input";
import { Textarea } from "~/client/components/ui/textarea";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/client/components/ui/form";
import { useServerFn } from "@tanstack/react-start";
import { embedAndCompareProd, InputSchema } from "./compare.server";
import { SpaceLayout } from "../space-layout";
import { cn } from "~/client/lib/utils";
import type { TSpace } from "~/common/types/content.types";

interface SimilaritySpaceProps {
  config?: Pick<TSpace, "layoutWidth" | "supportsMobile">;
}

export function SimilaritySpace({ config }: SimilaritySpaceProps) {
  return (
    <SpaceLayout
      title="Similarity"
      description="Find similarity between two texts using OpenAI embeddings."
      layoutWidth={config?.layoutWidth}
      supportsMobile={config?.supportsMobile}
    >
      <SimilarityForm />
    </SpaceLayout>
  );
}

function SimilarityForm() {
  const [similarity, setSimilarity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const compare = useServerFn(embedAndCompareProd);

  const form = useForm<z.infer<typeof InputSchema>>({
    resolver: zodResolver(InputSchema),
    defaultValues: {
      text1: "",
      text2: "",
      apiKey: "",
    },
  });

  async function onSubmit(values: z.infer<typeof InputSchema>) {
    setError(null);
    setIsLoading(true);
    try {
      const result = await compare({ data: values });
      if (result) {
        setSimilarity(result);
      }
    } catch (error: unknown) {
      setError(
        (error as Error).message ?? "An error occurred while comparing texts",
      );
      setSimilarity(0);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="text1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Text</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[150px] resize-y"
                  placeholder="Enter first text here..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="text2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Second Text</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[150px] resize-y"
                  placeholder="Enter second text here..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OpenAI API Key</FormLabel>
              <FormControl>
                <Input type="password" placeholder="sk-..." {...field} />
              </FormControl>
              <FormDescription>
                Your API key is required for generating embeddings. We don't
                store it.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div
            className="border-destructive/30 text-destructive rounded-lg border p-4 text-sm"
            role="alert"
          >
            <span className="font-medium">Error:</span> {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? "Calculating..." : "Compare Texts"}
          </Button>

          {similarity > 0 && !isLoading && (
            <div className="border-border/30 rounded-lg border p-4">
              <p className="text-foreground text-lg font-semibold">
                Similarity:{" "}
                <span className="text-primary">
                  {Math.round(similarity * 100)}%
                </span>
              </p>
              <div className="border-border/30 mt-3 h-2 w-full overflow-hidden rounded-full border">
                <div
                  className={cn(
                    "bg-primary h-full rounded-full transition-all duration-300",
                  )}
                  style={{
                    width: `${Math.min(100, Math.round(similarity * 100))}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
