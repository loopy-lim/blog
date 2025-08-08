# GEMINI Project Context

g## Project Overview

This project is a personal blog built using the [Astro](https://astro.build/) framework. It appears to be a minimal Astro starter kit that has been customized. The content is written in Markdown and the project uses React components, as indicated by the presence of `@astrojs/react` and `react` in the dependencies. The styling is done with [Tailwind CSS](https://tailwindcss.com/).

The project is configured to use `pnpm` as the package manager.

## Building and Running

The following scripts are available in `package.json`:

*   `pnpm dev`: Starts the local development server at `localhost:4321`.
*   `pnpm build`: Builds the production-ready site to the `./dist/` directory.
*   `pnpm preview`: Previews the built site locally before deploying.
*   `pnpm lint`: Lints and formats the code using Prettier and ESLint.

## Development Conventions

The project uses [Prettier](https://prettier.io/) for code formatting and [ESLint](https://eslint.org/) for code quality. The configuration for these tools can be found in `.prettierrc.mjs` and `eslint.config.js` respectively. It is recommended to run `pnpm lint` before committing any changes to ensure code consistency.
