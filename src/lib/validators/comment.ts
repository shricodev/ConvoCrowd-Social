import { z } from "zod";

export const CommentValidator = z.object({
  postId: z.string(),
  text: z
    .string()
    .min(1, { message: "Comment must be at least a character long!" })
    .max(1000, { message: "Comment must be at most 1000 characters long!" }),
  replyToId: z.string().optional(),
});

export type CommentRequest = z.infer<typeof CommentValidator>;
