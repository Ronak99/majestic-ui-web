import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { pageSchema } from "fumadocs-core/source/schema";
import { z } from "zod";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema.extend({
      type: z.enum(["guide", "widget", "page", "architecture"]).default("guide"),
      preview_url: z.string().url().optional(),
      cli: z.string().optional(),
      dependencies: z.array(z.string()).default([]),
      files: z
        .array(
          z.object({
            name: z.string(),
            path: z.string(),
            language: z.string().default("dart"),
            code: z.string(),
          })
        )
        .default([]),
    }),
  },
});

export default defineConfig();
