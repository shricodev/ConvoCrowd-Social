"use client";

import { FC, useEffect, useRef } from "react";

import axios from "axios";
import { Session } from "next-auth";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";

import Post from "../Post/Post";

import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";

import type { ExtendedPost } from "@/types/db";
import { Loader2 } from "lucide-react";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  subconvoName?: string;
  session?: Session | null;
}

const PostFeed: FC<PostFeedProps> = ({
  initialPosts,
  subconvoName,
  session,
}) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { entry, ref } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  // implement infinite scrolling for posts
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-posts"],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subconvoName ? `&subconvoName=${subconvoName}` : "");

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: {
        pages: [initialPosts],
        pageParams: [1],
      },
    },
  );

  // if the user is intersecting with the last post then fetch other posts as well.
  useEffect(() => {
    if (!isFetchingNextPage && entry?.isIntersecting) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="col-span-2 flex flex-col space-y-6">
      {posts.map((post, index) => {
        const votesCount = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;
          return acc;
        }, 0);

        // check if the post is voted by the current user
        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id,
        );

        // if the post is the last post then fetch data for the next page
        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                votesCount={votesCount}
                currentVote={currentVote}
                commentCount={post.comments.length}
                post={post}
                subconvoName={post.subconvo.name}
              />
            </li>
          );
        }
        return (
          <Post
            key={post.id}
            votesCount={votesCount}
            currentVote={currentVote}
            commentCount={post.comments.length}
            post={post}
            subconvoName={post.subconvo.name}
          />
        );
      })}

      {isFetchingNextPage && (
        <li className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500 dark:text-slate-200" />
        </li>
      )}
    </ul>
  );
};

export default PostFeed;
