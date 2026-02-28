import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // .env.local 파일 로드 (NEXT_PUBLIC_ 및 NOTION_ 접두사만)
  const env = loadEnv(mode, process.cwd(), ['NEXT_PUBLIC_', 'NOTION_', 'GA_', 'GTM_']);

  return {
    plugins: [
      vinext(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
      }),
    ],
    define: {
      'process.env.NOTION_API_KEY': JSON.stringify(env.NOTION_API_KEY),
      'process.env.NOTION_DATABASE_ID': JSON.stringify(env.NOTION_DATABASE_ID),
      'process.env.NEXT_PUBLIC_SITE_URL': JSON.stringify(env.NEXT_PUBLIC_SITE_URL),
      'process.env.NEXT_PUBLIC_AUTHOR_NAME': JSON.stringify(env.NEXT_PUBLIC_AUTHOR_NAME),
      'process.env.NEXT_PUBLIC_GA_ID': JSON.stringify(env.NEXT_PUBLIC_GA_ID),
      'process.env.NEXT_PUBLIC_GTM_ID': JSON.stringify(env.NEXT_PUBLIC_GTM_ID),
    },
    server: {
      port: 3000,
    },
    preview: {
      port: 3000,
    },
  };
});
