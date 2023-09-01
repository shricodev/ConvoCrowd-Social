import { z } from "zod";

export const UsernameValidator = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username must be at most 30 characters long." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username must only contain letters, numbers, and underscores.",
    }),
});

export type UsernameChangeRequest = z.infer<typeof UsernameValidator>;
