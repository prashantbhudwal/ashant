import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../../ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert } from '../../ui/alert'
import { MDocument } from '@mastra/rag'
import { createServerFn } from '@tanstack/react-start'
import { cn } from '~/client/lib/utils'
import { ScrollArea } from '../../ui/scroll-area'
import { ProgramLayout } from '../program-layout'
import type { TSpace } from '~/common/types/content.types'

interface ChunkerSpaceProps {
  config?: Pick<TSpace, 'layoutWidth' | 'supportsMobile'>
}

export const ChunkerSpace = ({ config }: ChunkerSpaceProps) => {
  return (
    <ProgramLayout
      title="Chunker"
      description="Split text into easily digestible chunks for LLMs."
      layoutWidth={config?.layoutWidth}
      supportsMobile={config?.supportsMobile}
    >
      <Chunker />
    </ProgramLayout>
  )
}

const formSchema = z.object({
  text: z.string().min(10, 'Text must be at least 10 characters long.'),
  chunkSize: z
    .string()
    .min(1, 'Chunk size must be a positive number.')
    .regex(/^\d+$/, 'Chunk size must contain digits only.'),
})

type FormValues = z.infer<typeof formSchema>

const chunkTextServerFn = createServerFn({
  method: 'POST',
})
  .inputValidator(formSchema)
  .handler(async ({ data }) => {
    const { text, chunkSize } = data
    const numericChunkSize = Number(chunkSize)
    if (!text.trim() || numericChunkSize <= 0) {
      return []
    }
    const docFromText = MDocument.fromText(text)
    const chunks = await docFromText.chunk({
      strategy: 'token',
      size: numericChunkSize,
      overlap: 50,
    })
    return chunks.map((chunk) => chunk.text)
  })

function Chunker() {
  const [copiedChunkIndices, setCopiedChunkIndices] = useState<number[]>([])
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      chunkSize: '6000',
    },
  })

  const {
    data: chunks = [],
    refetch,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['chunker'],
    queryFn: () =>
      chunkTextServerFn({ data: formSchema.parse(form.getValues()) }),
    enabled: false,
    retry: 2,
  })

  const handleChunk = (data: FormValues) => {
    queryClient.removeQueries({
      queryKey: ['chunker'],
    })
    setCopiedChunkIndices([])
    refetch()
  }

  const copyChunk = (chunk: string, index: number) => {
    navigator.clipboard.writeText(chunk)
    setCopiedChunkIndices((prev) => [...new Set([...prev, index])])
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleChunk)} className="space-y-6">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter your text here"
                    className="min-h-[150px] w-full resize-y"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chunkSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chunk Size</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="e.g., 512"
                    value={field.value ?? ''}
                    onChange={(event) => {
                      const nextValue = event.target.value
                      // Allow empty string or numbers
                      field.onChange(nextValue)
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isFetching}
          >
            {isFetching ? 'Processing...' : 'Chunk Text'}
          </Button>
        </form>
      </Form>

      {error && (
        <Alert variant="destructive">
          {error instanceof Error
            ? error.message
            : 'An error occurred while chunking the text'}
        </Alert>
      )}

      {chunks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-foreground text-lg font-semibold">
            Chunks ({chunks.length})
          </h2>
          <div className="space-y-6">
            {chunks.map((chunk, index) => {
              const isCopied = copiedChunkIndices.includes(index)
              return (
                <div
                  className={cn(
                    'border-border/30 flex flex-col rounded-lg border',
                    isCopied && 'border-primary/50',
                  )}
                  key={index}
                >
                  <div className="border-border/30 bg-muted/20 flex items-center justify-between border-b p-3">
                    <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Chunk {index + 1}
                    </span>
                    <Button
                      variant={isCopied ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => copyChunk(chunk, index)}
                      className="h-8 min-w-[80px] text-xs transition-all duration-200"
                    >
                      {isCopied ? 'Copy Again' : 'Copy'}
                    </Button>
                  </div>
                  <div className="bg-card p-4">
                    <div className="border-border/10 bg-muted/10 max-h-[300px] w-full overflow-y-auto rounded-md border p-2">
                      <p
                        className={cn(
                          'text-muted-foreground font-mono text-sm break-words whitespace-pre-wrap',
                        )}
                      >
                        {chunk}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
