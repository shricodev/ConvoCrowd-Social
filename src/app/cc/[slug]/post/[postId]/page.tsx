import { notFound } from "next/navigation";
import { Post, User, Vote } from "@prisma/client";

import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

import { CachedPost } from "@/types/redis";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/Button";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import PostVoteServer from "@/components/PostVote/PostVoteServer";
import { formatTimeToNow } from "@/lib/utils";
import EditorOutput from "@/components/EditorOutput/EditorOutput";
import CommentsSection from "@/components/CommentsSection/CommentsSection";

interface SubconvoPostPageProps {
  params: {
    postId: string;
  };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const SubconvoPostPage = async ({ params }: SubconvoPostPageProps) => {
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`,
  )) as CachedPost;

  let post:
    | (Post & {
        votes: Vote[];
        author: User;
      })
    | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }

  if (!post && !cachedPost) return notFound();

  return (
    <>
      <div className="flex h-full flex-col items-center justify-between sm:flex-row sm:items-start">
        <Suspense fallback={<PostVoteShell />}>
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: { id: params.postId },
                include: {
                  votes: true,
                },
              });
            }}
          />
        </Suspense>

        <div className="w-full flex-1 rounded-sm bg-white p-4 dark:bg-zinc-700 sm:w-0">
          <p className="mt-1 max-h-40 truncate text-xs text-gray-500 dark:text-slate-100">
            Posted by u/{post?.author.username ?? cachedPost.authorUsername}{" "}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>
          <h1 className="py-2 text-xl font-semibold leading-6 text-gray-900 dark:text-slate-50">
            {post?.title ?? cachedPost.title}
          </h1>

          <EditorOutput content={post?.content ?? cachedPost.content} />

          {/* comments section */}
          <Suspense
            fallback={
              <Loader2 className="mx-auto mt-7 h-6 w-6 animate-spin text-zinc-500 dark:text-slate-200" />
            }
          >
            <CommentsSection postId={post?.id || cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </>
  );
};

function PostVoteShell() {
  return (
    <div className="flex w-20 flex-col items-center pr-6">
      {/* upvote */}
      <div
        className={buttonVariants({
          variant: "ghost",
        })}
      >
        <ArrowBigUp className="h-5 w-5 text-zinc-700" />
      </div>

      {/* vote count */}
      <div className="py-2 text-center text-sm font-medium text-zinc-900 dark:text-slate-100">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      {/* downvote */}
      <div
        className={buttonVariants({
          variant: "ghost",
        })}
      >
        <ArrowBigDown className="h-5 w-5 text-zinc-700" />
      </div>
    </div>
  );
}

export default SubconvoPostPage;
