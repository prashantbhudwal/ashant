import { createServerFn } from '@tanstack/react-start'
import { staticFunctionMiddleware } from '@tanstack/start-static-server-functions'
import {
  ContentType,
  type TSerializableContent,
} from '~/common/types/content.types'

export const getAllContentServerFn = createServerFn({ method: 'GET' })
  .middleware([staticFunctionMiddleware])
  .handler(async (): Promise<TSerializableContent[]> => {
    // Dynamic import to ensure server code is tree-shaken from client bundle
    const { getAllContent } =
      await import('~/server/modules/content/get-all-content')

    const content = await getAllContent()
    const serializable: TSerializableContent[] = content.map((item) => {
      // Handle Spaces: remove Component
      if (item.type === ContentType.SPACE && 'Component' in item) {
        const { Component, ...rest } = item
        return rest
      }
      // Handle Posts: remove content string to reduce payload
      if (item.type === ContentType.POST) {
        const { content: _, ...rest } = item
        return { ...rest, content: '' }
      }
      return item
    })
    return serializable
  })
