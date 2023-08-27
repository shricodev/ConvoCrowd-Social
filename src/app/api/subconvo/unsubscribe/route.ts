import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubconvoSubscriptionValidator } from "@/lib/validators/subconvo";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

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

    if (!subscriptionExists) {
      return new Response("You are not subscribed to this subconvo", {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    // check if the user is the creator of subconvo.
    const subconvo = await db.subconvo.findFirst({
      where: {
        id: subconvoId,
        creatorId: session.user.id,
      },
    });

    if (subconvo) {
      return new Response("You cannot unsubscribe from your own subconvo", {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    // subscribe the user to the subconvo
    await db.subscription.delete({
      where: {
        userId_subconvoId: {
          subconvoId,
          userId: session.user.id,
        },
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

    return new Response("Could not unsubscribe. Something went wrong.", {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
