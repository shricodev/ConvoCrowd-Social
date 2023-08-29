import { FC } from "react";

import PostFeed from "../PostFeed/PostFeed";

import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";

import { db } from "@/lib/db";

const GeneralFeed: FC = async () => {
  const posts = await db.post.findMany({
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

export default GeneralFeed;
