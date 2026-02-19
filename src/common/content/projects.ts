import { type TProject } from '~/common/types/project.types'

export const projects: TProject[] = [
  {
    id: 'injectbook',
    slug: 'injectbook',
    name: 'injectbook',
    description: 'Turn any ebook into an agent skill.',
    repoUrl: 'https://github.com/prashantbhudwal/injectbook',
    tags: ['ai', 'agents', 'tools'],
    featured: true,
  },
  {
    id: 'buddy',
    slug: 'buddy',
    name: 'buddy',
    description: 'Agent to help you learn anything.',
    repoUrl: 'https://github.com/prashantbhudwal/buddy',
    tags: ['ai', 'agents', 'education'],
    featured: true,
  },
  {
    id: 'citadel',
    slug: 'citadel',
    name: 'citadel',
    description:
      'Local-first music embeddings lab: ingest -> embed -> cluster -> visualize.',
    repoUrl: 'https://github.com/prashantbhudwal/citadel',
    tags: ['embeddings', 'music', 'local-first'],
    featured: true,
  },
  {
    id: 'writing-agent',
    slug: 'writing-agent',
    name: 'pg - essay agent',
    description:
      'Terminal essay writer that drafts one sentence per pass with tool-calling + editor cycles.',
    repoUrl: 'https://github.com/prashantbhudwal/writing-agent',
    tags: ['ai', 'agents', 'writing'],
    featured: true,
  },
  {
    id: 'falcon-edu',
    slug: 'falcon-edu',
    name: 'FalconAI',
    description:
      'AI school platform with multi-role PWA, streaming chat/tests, and paid pilot usage.',
    repoUrl: 'https://github.com/prashantbhudwal/falconEDU',
    tags: ['education', 'pwa', 'ai'],
  },
  {
    id: 'lex-reader',
    slug: 'lex-reader',
    name: 'Lex Reader',
    description: 'AI article reader with RAG and credibility analysis.',
    repoUrl: 'https://github.com/prashantbhudwal/falcontoo',
    tags: ['rag', 'reading', 'ai'],
  },
]

export const getProjectBySlug = ({ slug }: { slug: string }) =>
  projects.find((project) => project.slug === slug)
