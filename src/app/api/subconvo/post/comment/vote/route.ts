import { z } from "zod";
import { StatusCodes } from "http-status-codes";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { CommentVoteValidator } from "@/lib/validators/vote";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { commentId, voteType } = CommentVoteValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: StatusCodes.UNAUTHORIZED });
    }

    // check if user has already voted on this post
    const existingVote = await db.commentVote.findFirst({
      where: {
        userId: session.user.id,
        commentId,
      },
    });

    if (existingVote) {
      // if vote type is the same as existing vote, delete the vote
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
        });
        return new Response("OK", { status: StatusCodes.OK });
      } else {
        // if vote type is different, update the vote
        await db.commentVote.update({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
          data: {
            type: voteType,
          },
        });
        return new Response("OK", { status: StatusCodes.OK });
      }
    }

    // if no existing vote, create a new vote
    await db.commentVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        commentId,
      },
    });

    return new Response("OK", { status: StatusCodes.OK });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: StatusCodes.BAD_REQUEST });
    }

    return new Response(
      "Could not post to subconvo at this time. Please try later",
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
