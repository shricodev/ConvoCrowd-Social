import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import { FC } from "react";
import PostFeed from "../PostFeed/PostFeed";
import { Session } from "next-auth";

interface CustomFeedProps {
  session: Session | null;
}

const CustomFeed: FC<CustomFeedProps> = async ({ session }) => {
  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session?.user?.id,
    },
    include: {
      subconvo: true,
    },
  });

  const posts = await db.post.findMany({
    where: {
      subconvo: {
        name: {
          in: followedCommunities.map((sub) => sub.subconvo.name),
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subconvo: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  });

  return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;
