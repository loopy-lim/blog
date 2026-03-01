# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog built with **Next.js 15** App Router, using Notion as a headless CMS.
The deployment target is **Cloudflare Pages** with **static export** (`out/`).

## Development Commands

Use `bun` as the package manager (specified in packageManager field).

- `bun dev` - Start development server at `localhost:3000`
- `bun build` - Build static site to `./out/`
- `bun start` - Serve `out/` locally at `localhost:3000`
- `bun lint` - Oxlint
- `bun type-check` - TypeScript type checking

## Architecture

### Content Management
- Blog content is loaded from Notion database using `@notionhq/client` (official SDK)
- Server Components with React cache() for data fetching optimization
- Requires `NOTION_API_KEY` and `NOTION_DATABASE_ID` environment variables
- Static export mode for Cloudflare Pages deployment

### Key Technologies
- **Next.js 15** (App Router)
- **React 19** with Server Components
- **TypeScript** with strict mode
- **Tailwind CSS** with typography plugin
- **@notionhq/client** for Notion API integration

### Directory Structure
```
app/                           # Next.js App Router
├── layout.tsx                 # Root layout (Server Component)
├── page.tsx                   # Homepage
├── globals.css                # Global styles + Notion content styling
├── blog/
│   ├── page.tsx              # Blog list (Server Component)
│   └── [slug]/
│       └── page.tsx          # Individual post (Server Component)
components/                   # React components
├── blog/                     # Blog-specific components
│   ├── NotionContent.tsx    # Notion renderer (Server Component)
│   ├── BlockRenderer.tsx    # Individual block renderer
│   └── PostCard.tsx         # Post list card
lib/                         # Utility functions
├── notion.ts                # Notion API wrapper with caching
└── utils.ts                 # Shared utilities
out/                         # Static export output
```

### Page Structure
- `/` - Homepage with blog navigation
- `/blog` - Blog index page with all posts
- `/blog/[slug]` - Individual blog post pages

### Key Features
- **Server Components**: All data fetching happens on the server
- **Static Export**: Pre-rendered pages for fast CDN delivery
- **Type Safety**: Full TypeScript coverage with proper Notion API types
- **Performance**: React cache() prevents duplicate API calls
- **SEO**: Automatic metadata generation from Notion content

### Environment Setup
Copy `.env.local.example` to `.env.local` and configure:
- `NOTION_API_KEY` - Notion API integration token
- `NOTION_DATABASE_ID` - Notion database ID for blog content
- `NEXT_PUBLIC_SITE_URL` - Site URL for SEO
- `NEXT_PUBLIC_AUTHOR_NAME` - Author name for metadata

### Content Schema (Notion Database)
Blog posts should include these properties:
- `title` (title) - Post title
- `description` (rich_text) - Post description
- `publishAt` (date) - Publication date
- `tags` (multi_select) - Post tags
- `slug` (rich_text) - URL slug
- `draft` (checkbox) - Draft status (false = published)

## Development Guidelines

### Code Style
- Use Server Components by default (no "use client")
- Avoid `any` types - use proper TypeScript interfaces
- Use `@ts-expect-error` sparingly with clear comments
- Keep components focused and reusable

### Performance
- All data fetching should use React `cache()`
- Static export mode for optimal CDN delivery
- Use Suspense boundaries for loading states

### Notion Integration
- All Notion API calls should be in `lib/notion.ts`
- Use proper error handling for API failures
- Cache responses at the function level
