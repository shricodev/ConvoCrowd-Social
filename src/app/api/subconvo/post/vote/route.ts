import { z } from "zod";
import { StatusCodes } from "http-status-codes";

import { CACHE_AFTER_UPVOTES } from "@/config";

import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { getAuthSession } from "@/lib/auth";
import { PostVoteValidator } from "@/lib/validators/vote";

import type { CachedPost } from "@/types/redis";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { postId, voteType } = PostVoteValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: StatusCodes.UNAUTHORIZED });
    }

    const existingVote = await db.vote.findFirst({
      where: { userId: session.user.id, postId },
    });

    const post = await db.post.findUnique({
      where: { id: postId },
      // for caching
      include: {
        author: true,
        votes: true,
      },
    });

    if (!post) {
      return new Response("Post not found", { status: StatusCodes.NOT_FOUND });
    }

    if (existingVote) {
      // if the user has votedon an already voted post
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        });
        return new Response("OK", { status: StatusCodes.OK });
      }

      await db.vote.update({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      });

      // cache the post if it is above the threshold. For popular post to fetch fast.
      // recount the votes
      const votesCount = post.votes.reduce((acc, vote) => {
        if (vote.type === "UP") {
          return acc + 1;
        }
        if (vote.type === "DOWN") {
          return acc - 1;
        }
        return acc;
      }, 0);

      if (votesCount >= CACHE_AFTER_UPVOTES) {
        const cachePayload: CachedPost = {
          id: post.id,
          authorUsername: post.author.username ?? post.author.name ?? "",
          content: JSON.stringify(post.content),
          title: post.title,
          currentVote: voteType,
          createdAt: post.createdAt,
        };

        await redis.hset(`post:${postId}`, cachePayload);
      }
      return new Response("OK", { status: StatusCodes.OK });
    }
    await db.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        postId,
      },
    });

    const votesCount = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") {
        return acc + 1;
      }
      if (vote.type === "DOWN") {
        return acc - 1;
      }
      return acc;
    }, 0);

    if (votesCount >= CACHE_AFTER_UPVOTES) {
      const cachePayload: CachedPost = {
        id: post.id,
        authorUsername: post.author.username ?? post.author.name ?? "",
        content: JSON.stringify(post.content),
        title: post.title,
        currentVote: voteType,
        createdAt: post.createdAt,
      };
      await redis.hset(`post:${postId}`, cachePayload);
    }
    return new Response("OK", { status: StatusCodes.OK });
  } catch (error) {
    // if the zod parsing failed.
    if (error instanceof z.ZodError) {
      return new Response(error.message, {
        status: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    return new Response("Could not vote. please try again", {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
