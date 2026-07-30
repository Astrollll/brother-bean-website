import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
  }),
});

const menu = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    description: z.string(),
    price: z.string(),
    category: z.string(),
  }),
});

export const collections = { blog, menu };
