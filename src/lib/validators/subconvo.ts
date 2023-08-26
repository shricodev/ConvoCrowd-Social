import { z } from "zod";

export const SubconvoValidator = z.object({
  name: z.string().min(3).max(21),
});

export const SubconvoSubscriptionValidator = z.object({
  subconvoId: z.string(),
});

export type CreateSubconvoPayload = z.infer<typeof SubconvoValidator>;
export type SubscribeToSubconvoPayload = z.infer<
  typeof SubconvoSubscriptionValidator
>;
