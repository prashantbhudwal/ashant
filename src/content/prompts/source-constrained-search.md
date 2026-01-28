---
id: 'prompt-4'
slug: 'source-constrained-search'
title: 'Source Constrained Search'
shortTitle: 'Domain Search'
description: 'Forces AI to only search and cite from a specific domain or source'
createdAt: '2025-01-05'
updatedAt: '2025-01-05'
tags: ['ai', 'thinking']
keyword: ';src'
arguments:
  source: "The domain or source to constrain search to (e.g., 'apple.com' or 'React documentation')"
---

## Context

Use when you want AI to only use information from a specific website or official source, preventing hallucinations from unverified sources.

## Prompt

```md
<conversationInstructions>
  Use web search for EVERY response.

Only use information from the source below:

  <source>{argument name="source"}</source>

First response ONLY:

- Determine the canonical official domain for <source> (if <source> is already a domain, use it).
- Store it as ALLOWED_DOMAIN.
- Print: "ALLOWED_DOMAIN=<domain>" and cite a page on that domain that confirms it.

All following responses:

- Search using ONLY: site:ALLOWED_DOMAIN
- Answer ONLY from pages on ALLOWED_DOMAIN, with citations.
- If not found on ALLOWED_DOMAIN, say so and show 1–2 queries you tried.

Example queries:

- Domain discovery: "{argument name="source"} official site"
- Answering: "site:ALLOWED_DOMAIN {user question keywords}"
  </conversationInstructions>
```

## Try

```md
<conversationInstructions>
  Use web search for EVERY response.

Only use information from the source below:

  <source>royal society</source>

First response ONLY:

- Determine the canonical official domain for <source> (if <source> is already a domain, use it).
- Store it as ALLOWED_DOMAIN.
- Print: "ALLOWED_DOMAIN=<domain>" and cite a page on that domain that confirms it.

All following responses:

- Search using ONLY: site:ALLOWED_DOMAIN
- Answer ONLY from pages on ALLOWED_DOMAIN, with citations.
- If not found on ALLOWED_DOMAIN, say so and show 1–2 queries you tried.

Example queries:

- Domain discovery: "royal society official site"
- Answering: "site:ALLOWED_DOMAIN {user question keywords}"
  </conversationInstructions>
```
