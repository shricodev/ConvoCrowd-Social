import { z } from "zod";
import { StatusCodes } from "http-status-codes";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { postValidator } from "@/lib/validators/post";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user)
      return new Response("Unauthorized", {
        status: StatusCodes.UNAUTHORIZED,
      });

    const body = await req.json();
    const { subconvoId, title, content } = postValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: { subconvoId, userId: session.user.id },
    });

    if (!subscriptionExists) {
      return new Response("Subscribe to post", {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subconvoId,
      },
    });

    return new Response("OK");
  } catch (error) {
    // if the zod parsing failed.
    if (error instanceof z.ZodError) {
      return new Response(error.message, {
        status: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    return new Response("Could not post. Please try again later", {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
