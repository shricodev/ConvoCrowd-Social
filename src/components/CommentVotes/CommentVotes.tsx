"use client";

import { FC, useState } from "react";

import { CommentVote, VoteType } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { usePrevious } from "@mantine/hooks";
import { StatusCodes } from "http-status-codes";
import { useMutation } from "@tanstack/react-query";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";

import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";

import { cn } from "@/lib/utils";
import { CommentVoteRequest } from "@/lib/validators/vote";

import { Button } from "../ui/Button";

interface CommentVotesProps {
  commentId: string;
  initialVoteCount: number;
  initialVote?: Pick<CommentVote, "type">;
}

const CommentVotes: FC<CommentVotesProps> = ({
  commentId,
  initialVoteCount,
  initialVote,
}) => {
  const { loginToast } = useCustomToast();
  const [voteCount, setVoteCount] = useState<number>(initialVoteCount);
  const [currentVote, setCurrentVote] = useState(initialVote);
  // in case there is any issue when updating the vote, revert back to the previous vote.
  const prevVote = usePrevious(currentVote);

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType: type,
      };
      await axios.patch("/api/subconvo/post/comment/vote", payload);
    },
    onError: (err, voteType) => {
      if (voteType === "UP") setVoteCount((prev) => prev - 1);
      else setVoteCount((prev) => prev + 1);

      setCurrentVote(prevVote);

      if (err instanceof AxiosError) {
        if (err.response?.status === StatusCodes.UNAUTHORIZED) {
          return loginToast();
        }
      }

      return toast({
        title: "Something went wrong",
        description: "The vote was not registered. Please try again.",
        variant: "destructive",
      });
    },
    onMutate: (type) => {
      // instead of waiting for the server to respond, update the UI immediately
      // if it throws an error, then it will get handled in the onError function
      if (currentVote?.type === type) {
        setCurrentVote(undefined);
        if (type === "UP") setVoteCount((prev) => prev - 1);
        else if (type === "DOWN") setVoteCount((prev) => prev + 1);
      } else {
        setCurrentVote({ type });
        if (type === "UP") setVoteCount((prev) => prev + (currentVote ? 2 : 1));
        else if (type === "DOWN")
          setVoteCount((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });

  return (
    <div className="flex gap-1">
      <Button
        onClick={() => vote("UP")}
        size="sm"
        variant="ghost"
        aria-label="upvote"
        className="dark:hover:bg-transparent"
      >
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700 dark:text-slate-200", {
            "fill-emerald-500 text-emerald-500": currentVote?.type === "UP",
          })}
        />
      </Button>

      <p className="py-2 text-center text-sm font-medium text-zinc-900 dark:text-slate-200">
        {voteCount}
      </p>

      <Button
        onClick={() => vote("DOWN")}
        size="sm"
        variant="ghost"
        aria-label="downvote"
        className="dark:hover:bg-transparent"
      >
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700 dark:text-slate-200", {
            "fill-red-500 text-red-500": currentVote?.type === "DOWN",
          })}
        />
      </Button>
    </div>
  );
};

export default CommentVotes;
