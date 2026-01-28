import { C } from '../../common/constants'

const authorProfile = {
  x: 'https://x.com/' + C.xUsername,
  linkedIn: 'https://www.linkedin.com/in/prashantbhudwal/',
  github: 'https://github.com/prashantbhudwal',
  buyMeACoffee: 'https://buymeacoffee.com/' + C.bmcUsername,
}

export const link = {
  path: {
    post: ({ slug }: { slug: string }) => `/blog/${slug}`,
    program: ({ slug }: { slug: string }) => `/programs/${slug}`,
    images: {
      programs: ({ imgName }: { imgName: string }) => `/programs/${imgName}`,
      blog: ({ imgName }: { imgName: string }) => `/blog/${imgName}.webp`,
    },
  },
  url: {
    internal: {
      post: ({ slug }: { slug: string }) => C.base + '/blog/' + slug,
      program: ({ slug }: { slug: string }) => C.base + '/programs/' + slug,
    },
    external: {
      authorProfile,
    },
  },
}
