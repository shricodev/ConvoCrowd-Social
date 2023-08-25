import { z } from "zod";

export const subconvoValidator = z.object({
  name: z.string().min(3).max(21),
});

export const subconvoSubscriptionValidator = z.object({
  subConvoId: z.string(),
});

export type CreateSubConvoPayload = z.infer<typeof subconvoValidator>;
export type SubscribeToSubConvoPayload = z.infer<
  typeof subconvoSubscriptionValidator
>;
