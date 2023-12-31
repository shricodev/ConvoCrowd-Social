import { FC, useEffect, useRef, useState } from "react";

import { MessageCircle } from "lucide-react";
import { Post, User, Vote } from "@prisma/client";

import EditorOutput from "../EditorOutput/EditorOutput";

import PostVoteClient from "../PostVote/PostVoteClient";

import { formatTimeToNow } from "@/lib/utils";

type PartialVote = Pick<Vote, "type">;

interface PostProps {
  subconvoName: string;
  // this is just to get the author details of the post.
  post: Post & {
    author: User;
    votes: Vote[];
  };
  commentCount: number;
  votesCount: number;
  currentVote?: PartialVote;
}

const Post: FC<PostProps> = ({
  subconvoName,
  post,
  commentCount,
  votesCount,
  currentVote,
}) => {
  // to fix the date issue different on the client and server. HYDRATION ISSUE
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const postRef = useRef<HTMLDivElement>(null);
  const now = new Date();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <div className="rounded-md bg-white shadow-md dark:bg-zinc-800 ">
      <div className="flex justify-between px-6 py-4">
        <PostVoteClient
          postId={post.id}
          initialVoteCount={votesCount}
          initialVote={currentVote?.type}
        />

        <div className="w-0 flex-1">
          <div className="mt-1 max-h-40 text-sm text-gray-500 dark:text-slate-300">
            {subconvoName ? (
              <>
                <a
                  href={`/cc/${subconvoName}`}
                  className="text-sm text-zinc-900 underline underline-offset-2 dark:text-slate-100"
                >
                  cc/{subconvoName}
                </a>
                <span className="px-1">•</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.username}</span>{" "}
            {isHydrated
              ? formatTimeToNow(new Date(post.createdAt))
              : now.getUTCFullYear()}
          </div>

          <a href={`/cc/${subconvoName}/post/${post.id}`}>
            <h1 className="py-2 text-lg font-semibold leading-6 text-gray-900 dark:text-slate-50">
              {post.title}
            </h1>
          </a>
          {/* ref to dynamically track its height and show blurry thing in the end if it is too long */}
          <div
            className="relative max-h-40 w-full overflow-clip text-sm"
            ref={postRef}
          >
            <EditorOutput content={post.content} />

            {postRef.current?.clientHeight &&
            postRef.current?.clientHeight >= 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent dark:from-zinc-800" />
            ) : null}
          </div>
        </div>
      </div>

      <div className="z-20 bg-gray-50 p-4 text-sm dark:bg-black/20 sm:px-6 ">
        <a
          href={`/cc/${subconvoName}/post/${post.id}`}
          className="flex w-fit items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          {commentCount} comments
        </a>
      </div>
    </div>
  );
};

export default Post;
