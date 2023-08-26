import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubconvoValidator } from "@/lib/validators/subconvo";
import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { name } = SubconvoValidator.parse(body);

    const subConvoExists = await db.subconvo.findFirst({
      where: {
        name,
      },
    });

    if (subConvoExists) {
      return new NextResponse("SubConvo already exists", {
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
    return new NextResponse(subConvo.name);
  } catch (error) {
    // if the zod parsing failed.
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, {
        status: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }
    return new NextResponse(
      "Could not create the community. Something went wrong.",
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
