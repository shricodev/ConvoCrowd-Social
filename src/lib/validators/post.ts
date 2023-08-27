import { z } from "zod";

export const postValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be longer than 3 characters" })
    .max(125, { message: "Title must be shorter than 125 characters" }),
  subconvoId: z.string(),
  content: z.any(),
});

export type PostCreationRequest = z.infer<typeof postValidator>;
