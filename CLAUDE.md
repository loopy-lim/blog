# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog built with Astro 5, using Notion as a headless CMS for blog content. The site features an interactive landing page with Canvas/Konva animations, a blog section, and an about page with experience and project information.

## Development Commands

Use `pnpm` as the package manager (specified in packageManager field).

- `pnpm dev` - Start development server at `localhost:4321`
- `pnpm build` - Build production site to `./dist/`
- `pnpm preview` - Preview build locally
- `pnpm astro ...` - Run Astro CLI commands
- `pnpm lint` - Format with Prettier and fix with ESLint

## Architecture

### Content Management
- Blog content is loaded from Notion database using `@ntcho/notion-astro-loader`
- Content configuration in `src/content.config.ts` with schema validation
- Requires `NOTION_API_KEY` and `NOTION_DATABASE_ID` environment variables
- Assets are downloaded to `src/public/assets/blog/` directory

### Key Technologies
- **Astro 5** with React integration
- **Tailwind CSS** with Vite plugin and typography plugin
- **Sharp** for image optimization
- **Konva/React-Konva** for interactive canvas animations
- **Shiki** for syntax highlighting in blog posts
- **Swup** for page transitions

### Directory Structure
```
src/
├── components/
│   ├── about/          # About page sections (me, experiences, skills)
│   ├── commons/        # Shared UI components
│   ├── hooks/          # React hooks (useTheme, useResize)
│   └── intro/          # Landing page animations
├── contents/           # Static content files (experiences, projects)
├── layouts/           # Astro layouts
├── lib/               # Utility functions
├── pages/             # Astro routes
└── styles/            # Global styles
```

### Page Structure
- `/` - Landing page with interactive canvas animations
- `/about-me` - Personal information, experience, and skills
- `/blog` - Blog index page with all posts
- `/blog/[id]` - Individual blog post pages
- `/projects/[id]` - Project detail pages (dynamic routing from content)

### Key Components
- Interactive canvas animations using Konva in `src/components/intro/`
- Blog content rendered from Notion data with custom prose styling
- Responsive design with Tailwind CSS and custom hooks for window resizing
- Theme switching functionality via `useTheme` hook

### Environment Setup
Copy `.env.example` to `.env` and configure:
- `NOTION_API_KEY` - Notion API integration token
- `NOTION_DATABASE_ID` - Notion database ID for blog content

### Content Schema
Blog posts in Notion should include these properties:
- `title` (title) - Post title
- `description` (rich_text) - Post description
- `publishAt` (date) - Publication date
- `modifiedAt` (last_edited_time) - Last modification date
- `tags` (multi_select) - Post tags
- `slug` (rich_text) - URL slug
- `draft` (checkbox) - Draft status (false = published)