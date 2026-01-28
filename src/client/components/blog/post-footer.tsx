import { link } from '~/client/lib/link'
import { C } from '~/common/constants'
import { Separator } from '~/client/components/ui/separator'
import { Button } from '~/client/components/ui/button'
import { Link } from '@tanstack/react-router'

export const PostFooter = ({
  slug,
  title,
}: {
  slug: string
  title: string
}) => {
  const postUrl = link.url.internal.post({ slug })
  const tweetText = `\n\nRead "${title}" by ${C.xHandle}\n${postUrl}`
  const whatsAppText = `\n\nRead "${title}" by ${C.firstName}\n${postUrl}`
  return (
    <>
      <div className="font-sm mt-8 flex flex-col space-y-2 space-x-4 text-center text-neutral-600 md:flex-row dark:text-neutral-300">
        <Link
          to={
            `https://github.com/prashantbhudwal/ideabox/edit/main/content/posts/` +
            slug +
            `/` +
            slug +
            '.mdx'
          }
          className="text-muted-foreground/50 pb-6 font-semibold underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          Improve on Github
        </Link>
        <Link
          to={
            'https://x.com/intent/tweet?text=' + encodeURIComponent(tweetText)
          }
          className="text-muted-foreground/50 pb-6 font-semibold underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          Discuss on X
        </Link>
        <Link
          to={'https://wa.me/?text=' + encodeURIComponent(whatsAppText)}
          className="text-muted-foreground/50 pb-6 font-semibold underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          Share on WhatsApp
        </Link>
      </div>
    </>
  )
}

const SupportMe = () => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Button size={'lg'}>
        <Link to={link.url.external.authorProfile.buyMeACoffee}>Pay ₹100</Link>
      </Button>
      <div className="text-muted-foreground max-w-xs text-center text-sm font-semibold md:max-w-prose">
        Support my writing by paying for this post
      </div>
    </div>
  )
}
