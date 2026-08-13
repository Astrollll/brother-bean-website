import { defineCollection, z } from "astro:content";

const menu = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    description: z.string(),
    price: z.string(),
    category: z.string(),
  }),
});

export const collections = { menu };
