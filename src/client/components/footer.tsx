'use client'

import { Link } from '@tanstack/react-router'
import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6'
import { link } from '~/client/lib/link'
import { Button } from '~/client/components/ui/button'

export function Footer() {
  const socialLinks = [
    {
      name: 'X (Twitter)',
      url: link.url.external.authorProfile.x,
      icon: <FaXTwitter className="h-4 w-4" />,
    },
    {
      name: 'GitHub',
      url: link.url.external.authorProfile.github,
      icon: <FaGithub className="h-4 w-4" />,
    },
    {
      name: 'LinkedIn',
      url: link.url.external.authorProfile.linkedIn,
      icon: <FaLinkedin className="h-4 w-4" />,
    },
  ]

  return (
    <footer className="border-border/40 mt-24 border-t py-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-8 px-4 text-center">
        <div className="flex gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                {link.icon}
                <span className="sr-only">{link.name}</span>
              </Button>
            </a>
          ))}
        </div>

        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Prashant Bhudwal. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
