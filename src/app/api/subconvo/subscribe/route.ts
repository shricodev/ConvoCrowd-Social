import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubconvoSubscriptionValidator } from "@/lib/validators/subconvo";
import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user)
      return new NextResponse("Unauthorized", {
        status: StatusCodes.UNAUTHORIZED,
      });

    const body = await req.json();
    const { subconvoId } = SubconvoSubscriptionValidator.parse(body);

    const subscriptioonExists = await db.subscription.findFirst({
      where: { subconvoId, userId: session.user.id },
    });

    if (subscriptioonExists) {
      return new NextResponse("Already subscribed", {
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

    return new NextResponse(subconvoId);
  } catch (error) {
    // if the zod parsing failed.
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, {
        status: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    return new NextResponse("Could not subscribe. Something went wrong.", {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
