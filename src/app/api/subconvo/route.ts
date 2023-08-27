import { z } from "zod";
import { StatusCodes } from "http-status-codes";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { SubconvoValidator } from "@/lib/validators/subconvo";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: StatusCodes.UNAUTHORIZED });
    }
    const body = await req.json();
    const { name } = SubconvoValidator.parse(body);

    const subConvoExists = await db.subconvo.findFirst({
      where: {
        name,
      },
    });

    if (subConvoExists) {
      return new Response("SubConvo already exists", {
        status: StatusCodes.CONFLICT,
      });
    }

    const subConvo = await db.subconvo.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    await db.subscription.create({
      data: {
        userId: session.user.id,
        subconvoId: subConvo.id,
      },
    });
    return new Response(subConvo.name);
  } catch (error) {
    // if the zod parsing failed.
    if (error instanceof z.ZodError) {
      return new Response(error.message, {
        status: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }
    return new Response(
      "Could not create the community. Something went wrong.",
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
