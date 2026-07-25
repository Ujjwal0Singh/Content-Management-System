import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const blockSchema = z.object({
  type: z.enum(["header", "text", "list", "table", "math", "image"]),
  data: z.record(z.any()),
  order: z.number().optional(),
});

export const pageSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase letters, numbers, and hyphens"),
  status: z.enum(["draft", "published"]).optional(),
  layout: z.enum(["hero", "grid", "text-section", "formula", "table-page", "custom"]).optional(),
  blocks: z.array(blockSchema).optional(),
});

export const pageUpdateSchema = pageSchema.partial();
