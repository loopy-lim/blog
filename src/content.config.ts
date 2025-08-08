import { z, defineCollection } from "astro:content";
import { notionLoader } from "@ntcho/notion-astro-loader";
import {
  notionPageSchema,
  transformedPropertySchema,
  propertySchema,
} from "@chlorinec-pkgs/notion-astro-loader/schemas";
import rehypeShiki from "@shikijs/rehype";

import "dotenv/config";
import rehypeNotionImage from "@/lib/rehype-notion-image";

if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
  throw new Error(
    "NOTION_API_KEY and NOTION_DATABASE_ID must be set in environment variables.",
  );
}

const blog = defineCollection({
  loader: notionLoader({
    auth: process.env.NOTION_API_KEY,
    database_id: process.env.NOTION_DATABASE_ID,
    assetPath: "../public/assets/blog",
    filter: {
      property: "draft",
      checkbox: {
        equals: false,
      },
    },
    rehypePlugins: [
      [
        rehypeShiki,
        {
          theme: "github-dark",
        },
      ],
      rehypeNotionImage,
    ],
  }),
  schema: notionPageSchema({
    properties: z.object({
      title: transformedPropertySchema.title,
      description: transformedPropertySchema.rich_text,
      publishAt: transformedPropertySchema.date,
      modifiedAt: propertySchema.last_edited_time,
      tags: transformedPropertySchema.multi_select,
      slug: transformedPropertySchema.rich_text,
    }),
  }),
});

export const collections = { blog };
