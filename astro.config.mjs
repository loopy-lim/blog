// @ts-check
import { defineConfig } from "astro/config";
import swup from "@swup/astro";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), tsconfigPaths()],
  },
  integrations: [react(), swup({ animationClass: "swup-" })],
});
