import { FC } from "react";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { notFound } from "next/navigation";
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
      {/* TODO: SHOW POSTS IN USER FEED */}
    </>
  );
};

export default page;
