import { FC } from "react";

import { notFound } from "next/navigation";

import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

import PostFeed from "@/components/PostFeed/PostFeed";
import SmallCreatePost from "@/components/SmallCreatePost/SmallCreatePost";

interface PageProps {
  params: {
    slug: string;
  };
}

const page: FC<PageProps> = async ({ params }) => {
  const { slug } = params;

  const session = await getAuthSession();
  const subconvo = await db.subconvo.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subconvo: true,
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  });

  if (!subconvo) return notFound();

  return (
    <>
      <h1 className="h-14 text-3xl font-bold md:text-4xl">
        cc/{subconvo.name}
      </h1>
      <SmallCreatePost session={session} />
      <PostFeed
        session={session}
        initialPosts={subconvo.posts}
        subconvoName={subconvo.name}
      />
    </>
  );
};

export default page;
