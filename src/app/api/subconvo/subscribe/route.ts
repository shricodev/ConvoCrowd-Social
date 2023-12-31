import { z } from "zod";
import { StatusCodes } from "http-status-codes";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { SubconvoSubscriptionValidator } from "@/lib/validators/subconvo";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user)
      return new Response("Unauthorized", {
        status: StatusCodes.UNAUTHORIZED,
      });

    const body = await req.json();
    const { subconvoId } = SubconvoSubscriptionValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: { subconvoId, userId: session.user.id },
    });

    if (subscriptionExists) {
      return new Response("Already subscribed", {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    // subscribe the user to the subconvo
    await db.subscription.create({
      data: {
        subconvoId,
        userId: session.user.id,
      },
    });

    return new Response(subconvoId);
  } catch (error) {
    // if the zod parsing failed.
    if (error instanceof z.ZodError) {
      return new Response(error.message, {
        status: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    return new Response("Could not subscribe. Something went wrong.", {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
