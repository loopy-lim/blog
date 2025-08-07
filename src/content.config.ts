import { z, defineCollection } from "astro:content";
import { notionLoader } from "@chlorinec-pkgs/notion-astro-loader";
import {
  notionPageSchema,
  transformedPropertySchema,
  propertySchema,
} from "@chlorinec-pkgs/notion-astro-loader/schemas";

import "dotenv/config";

if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
  throw new Error(
    "NOTION_API_KEY and NOTION_DATABASE_ID must be set in environment variables.",
  );
}

const blog = defineCollection({
  loader: notionLoader({
    auth: process.env.NOTION_API_KEY,
    database_id: process.env.NOTION_DATABASE_ID,
    imageSavePath: "public/images/blog",
    filter: {
      property: "draft",
      checkbox: {
        equals: false,
      },
    },
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
