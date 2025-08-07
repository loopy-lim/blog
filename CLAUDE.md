# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro.js-based static site generator project, likely a personal blog or portfolio. It uses:
- Astro 5.x for static site generation
- React components 
- Tailwind CSS for styling
- TypeScript for type safety
- SWUP for page transitions

## Key Directories and Files

- `src/` - Main source code directory containing:
  - `components/` - Reusable React components
  - `layouts/` - Page layouts 
  - `pages/` - Astro pages (routes)
  - `contents/` - Content files (markdown, etc.)
- `astro.config.mjs` - Astro configuration with React integration and SWUP page transitions
- `eslint.config.js` - ESLint configuration for TypeScript, React, and Astro
- `package.json` - Dependencies and scripts

## Development Commands

- `pnpm dev` - Start local development server
- `pnpm build` - Build production site to `./dist/`
- `pnpm preview` - Preview built site locally
- `pnpm lint` - Format with Prettier and fix ESLint issues
- `pnpm astro ...` - Run Astro CLI commands

## Architecture Notes

The project uses a typical Astro structure with:
- Astro pages in `src/pages/` that define routes
- Components in `src/components/` 
- Content in `src/contents/`
- Layouts in `src/layouts/`
- Global styles in `src/styles/`

The codebase uses React components and follows Astro's component patterns.