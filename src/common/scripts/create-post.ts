import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import readline from 'readline'

type PostType = 'regular' | 'interactive'

type PostCreationResult = {
  success: boolean
  message: string
  postPath?: string
  componentsPath?: string
  indexPath?: string
}

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Define paths
const CONTENT_DIR = path.join(process.cwd(), 'src', 'content')
const POSTS_DIR = path.join(CONTENT_DIR, 'posts')
const DRAFTS_DIR = path.join(POSTS_DIR, 'drafts')
const INTERACTIVE_DIR = path.join(POSTS_DIR, 'interactive')
const COMPONENTS_FILE = path.join(
  process.cwd(),
  'src',
  'client',
  'components',
  'blog',
  'mdx',
  'post-components.tsx',
)

/**
 * Prompts the user with a question and returns their answer
 */
const prompt = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim())
    })
  })
}

/**
 * Creates a directory if it doesn't already exist
 */
const createDirIfNotExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`Created directory: ${dirPath}`)
  }
}

/**
 * Generates frontmatter content
 */
const generateFrontmatter = (
  slug: string,
  now: string,
  postId: string,
): string => {
  const title = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return `---
title: ${title}
createdAt: ${now}
updatedAt: ${now}
id: ${postId}
shortTitle: ''
heroImage: ''
description: ''
# Valid tags: startups, business, writing, reading, ai, learning, education, philosophy, software, economics, personal, health, thinking
tags: []
slug: ${slug}
---

Write your post content here.
`
}

/**
 * Creates a regular (plain markdown) post
 */
const createRegularPost = async (
  slug: string,
  withImages: boolean,
): Promise<PostCreationResult> => {
  // If withImages is true, create a directory with index.md
  // If withImages is false, create a flat .md file

  const now = new Date().toISOString()
  const postId = uuidv4()
  const content = generateFrontmatter(slug, now, postId)

  if (withImages) {
    const postDir = path.join(DRAFTS_DIR, slug)

    if (fs.existsSync(postDir)) {
      return {
        success: false,
        message: `Post directory '${slug}' already exists`,
      }
    }

    createDirIfNotExists(postDir)
    const filePath = path.join(postDir, 'index.md')
    fs.writeFileSync(filePath, content)
    console.log(`Created: ${slug}/index.md`)

    return {
      success: true,
      message: `Regular post (folder) '${slug}' created!`,
      postPath: filePath,
    }
  } else {
    const filePath = path.join(DRAFTS_DIR, `${slug}.md`)

    if (fs.existsSync(filePath)) {
      return {
        success: false,
        message: `Post '${slug}.md' already exists`,
      }
    }

    fs.writeFileSync(filePath, content)
    console.log(`Created: ${slug}.md`)

    return {
      success: true,
      message: `Regular post (file) '${slug}' created!`,
      postPath: filePath,
    }
  }
}

/**
 * Creates an interactive (MDX with components) post
 */
const createInteractivePost = async (
  slug: string,
): Promise<PostCreationResult> => {
  const postDir = path.join(INTERACTIVE_DIR, slug)

  if (fs.existsSync(postDir)) {
    return {
      success: false,
      message: `Interactive post '${slug}' already exists`,
    }
  }

  // Create directories
  createDirIfNotExists(postDir)
  const componentsDir = path.join(postDir, 'components')
  createDirIfNotExists(componentsDir)

  const now = new Date().toISOString()
  const postId = uuidv4()

  // Create MDX file
  const mdxContent = generateFrontmatter(slug, now, postId)
  const mdxFilePath = path.join(postDir, `${slug}.mdx`)
  fs.writeFileSync(mdxFilePath, mdxContent)
  console.log(`Created: ${slug}.mdx`)

  // Create index.tsx
  const camelCaseSlug = slug.replace(/-([a-z])/g, (_, letter) =>
    (letter as string).toUpperCase(),
  )
  const indexContent = `import dynamic from "next/dynamic";

export const ${camelCaseSlug} = {
  // Add your components here, for example:
  // ExampleComponent: dynamic(
  //   () => import("./components/example-component"),
  //   { ssr: false },
  // ),
};
`

  const indexFilePath = path.join(postDir, 'index.tsx')
  fs.writeFileSync(indexFilePath, indexContent)
  console.log(`Created: index.tsx`)

  // Update post-components.tsx
  if (fs.existsSync(COMPONENTS_FILE)) {
    let componentsContent = fs.readFileSync(COMPONENTS_FILE, 'utf-8')

    const importStatement = `import { ${camelCaseSlug} } from "~/content/posts/interactive/${slug}";\n`

    const importIndex = componentsContent.indexOf('import')
    if (importIndex !== -1) {
      const endOfImportLine = componentsContent.indexOf('\n', importIndex) + 1
      componentsContent =
        componentsContent.substring(0, endOfImportLine) +
        importStatement +
        componentsContent.substring(endOfImportLine)
    }

    const postComponentsIndex = componentsContent.indexOf(
      'const postComponents = {',
    )
    if (postComponentsIndex !== -1) {
      const afterOpenBrace =
        componentsContent.indexOf('{', postComponentsIndex) + 1
      const newComponentEntry = `\n  ...${camelCaseSlug},`
      componentsContent =
        componentsContent.substring(0, afterOpenBrace) +
        newComponentEntry +
        componentsContent.substring(afterOpenBrace)
    }

    fs.writeFileSync(COMPONENTS_FILE, componentsContent)
    console.log(`Updated: post-components.tsx`)
  }

  return {
    success: true,
    message: `Interactive post '${slug}' created!`,
    postPath: mdxFilePath,
    componentsPath: componentsDir,
    indexPath: indexFilePath,
  }
}

/**
 * Main function
 */
const main = async (): Promise<void> => {
  try {
    console.log('🚀 Post Creator\n')

    // Ask for post type
    console.log('Post types:')
    console.log('  1. regular     - Plain markdown (.md)')
    console.log('  2. interactive - MDX with React components\n')

    const typeInput = await prompt('Select type (1 or 2): ')
    const postType: PostType = typeInput === '2' ? 'interactive' : 'regular'
    let withImages = false

    if (postType === 'regular') {
      const imageInput = await prompt('Does this post include images? (y/n): ')
      if (imageInput.toLowerCase().startsWith('y')) {
        withImages = true
      }
    }

    // Get slug
    const slug = await prompt('Enter post slug (kebab-case): ')

    if (!slug) {
      console.error('\n❌ Slug cannot be empty')
      return
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      console.error('\n❌ Slug must be in kebab-case (e.g., my-post-slug)')
      return
    }

    // Create post based on type
    const result =
      postType === 'interactive'
        ? await createInteractivePost(slug)
        : await createRegularPost(slug, withImages)

    if (result.success) {
      console.log('\n✅ ' + result.message)
      console.log(`\nEdit: ${result.postPath}`)
      if (result.componentsPath) {
        console.log(`Components: ${result.componentsPath}`)
      }
    } else {
      console.error('\n❌ ' + result.message)
    }
  } catch (error) {
    console.error(
      `\n❌ Error: ${error instanceof Error ? error.message : String(error)}`,
    )
  } finally {
    rl.close()
  }
}

main()
