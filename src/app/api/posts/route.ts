import { z } from "zod";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { StatusCodes } from "http-status-codes";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await getAuthSession();
  let followedCommunitiesIds: string[] = [];

  if (session?.user) {
    const followedCommunities = await db.subscription.findMany({
      where: { userId: session.user.id },
      include: {
        subconvo: true,
      },
    });

    followedCommunitiesIds = followedCommunities.map(
      ({ subconvo }) => subconvo.id,
    );
  }

  try {
    // inline zod validation for query params
    const { limit, page, subconvoName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        // optional query param
        subconvoName: z.string().nullish().optional(),
      })
      .parse({
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
        subconvoName: url.searchParams.get("subconvoName"),
      });

    let whereClause = {};

    // if inside a subconvo then only fetch the data for that specific subconvo
    if (subconvoName) {
      whereClause = {
        subconvo: {
          name: subconvoName,
        },
      };
    } else if (session?.user) {
      // if the user is logged in then fetch the data for the communities they follow
      whereClause = {
        subconvo: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      };
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      // don't fetch the already shown posts
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        subconvo: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    });

    return new Response(JSON.stringify(posts), { status: StatusCodes.OK });
  } catch (error) {
    // if the zod parsing failed.
    if (error instanceof z.ZodError) {
      return new Response(error.message, {
        status: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    return new Response("Could not fetch more posts. Something went wrong", {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
