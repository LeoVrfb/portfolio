import { defineCollection, z } from "astro:content";

const work = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().optional(),
    publishDate: z.date(),
    tags: z.array(z.string()),
    img: z.string().optional(),
    img_alt: z.string().optional(),
    mediaType: z
      .enum(["image", "video", "carousel"])
      .optional()
      .default("image"),
    videoUrl: z.string().optional(),
    images: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = {
  work: work,
};
