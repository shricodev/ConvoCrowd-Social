import { z } from "zod";
import { StatusCodes } from "http-status-codes";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { UsernameValidator } from "@/lib/validators/username";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: StatusCodes.UNAUTHORIZED });
    }

    const body = await req.json();

    const { username } = UsernameValidator.parse(body);

    const usernameExists = await db.user.findFirst({
      where: { username },
    });

    if (usernameExists) {
      return new Response("Username already exists", {
        status: StatusCodes.CONFLICT,
      });
    }

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username,
      },
    });

    return new Response("Username updated", { status: StatusCodes.OK });
  } catch (error) {
    // if the zod parsing failed.
    if (error instanceof z.ZodError) {
      return new Response(error.message, {
        status: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    return new Response(
      "Could not update the username. Something went wrong.",
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
