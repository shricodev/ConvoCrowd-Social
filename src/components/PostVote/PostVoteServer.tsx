import { getAuthSession } from "@/lib/auth";
import { Post, Vote, VoteType } from "@prisma/client";
import { notFound } from "next/navigation";
import PostVoteClient from "./PostVoteClient";

interface PostVoteServerProps {
  postId: string;
  initialVotesCount?: number;
  initialVote?: VoteType | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

const PostVoteServer = async ({
  postId,
  initialVotesCount,
  initialVote,
  getData,
}: PostVoteServerProps) => {
  const session = await getAuthSession();

  let _votesCount: number = 0;
  let _currentVote: VoteType | null | undefined = null;

  if (getData) {
    const post = await getData();
    if (!post) return notFound();

    _votesCount = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      else if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    _currentVote = post.votes.find((vote) => vote.userId === session?.user.id)
      ?.type;
  } else {
    _votesCount = initialVotesCount!;
    _currentVote = initialVote;
  }

  return (
    <>
      <PostVoteClient
        postId={postId}
        initialVoteCount={_votesCount}
        initialVote={_currentVote}
        className="flex flex-row sm:flex-col"
      />
    </>
  );
};

export default PostVoteServer;
