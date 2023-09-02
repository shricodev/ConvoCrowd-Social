"use client";

import { FC, useRef, useState } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { CommentVote, User, Comment } from "@prisma/client";

import CommentVotes from "../CommentVotes/CommentVotes";

import UserAvatar from "../UserAvatar/UserAvatar";

import { formatTimeToNow } from "@/lib/utils";
import { CommentRequest } from "@/lib/validators/comment";

import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { toast } from "@/hooks/use-toast";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface PostCommentProps {
  comment: ExtendedComment;
  votesCount: number;
  currentVote: CommentVote | undefined;
  postId: string;
}

const PostComment: FC<PostCommentProps> = ({
  comment,
  votesCount,
  currentVote,
  postId,
}) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [commentReplyInput, setCommentReplyInput] = useState<string>("");

  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };
      const { data } = await axios.patch("/api/subconvo/post/comment", payload);
      return data;
    },
    onSuccess: () => {
      router.refresh();
      setIsReplying(false);
      setCommentReplyInput("");
    },
    onError: (error) => {
      return toast({
        title: "Something went wrong",
        description: "The comment was not posted. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex flex-col" ref={commentRef}>
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || comment.author.username || null,
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        />
        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900 dark:text-slate-50">
            u/{comment.author.username}
          </p>
          <p className="max-h-40 truncate text-xs text-zinc-500 dark:text-slate-200">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className="mt-2 text-sm text-zinc-900 dark:text-slate-50">
        {comment.text}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <CommentVotes
          commentId={comment.id}
          initialVoteCount={votesCount}
          initialVote={currentVote}
        />
        <Button
          onClick={() => {
            if (!session) return router.push("/sign-in");
            setIsReplying(true);
          }}
          variant="ghost"
          size="xs"
          aria-label="reply"
          className="dark:text-slate-200 dark:hover:bg-transparent"
        >
          <MessageCircle className="mr-1.5 h-4 w-4 dark:text-slate-200" />
          Reply
        </Button>
        {isReplying ? (
          <div className="grid w-full gap-1.5">
            <Label htmlFor="comment-reply-input">Your comment</Label>
            <div className="mt-2">
              <Textarea
                id="comment-reply-input"
                className="max-h-52 w-full resize-y bg-zinc-50 dark:bg-zinc-900"
                value={commentReplyInput}
                onChange={(e) => setCommentReplyInput(e.target.value)}
                rows={1}
                placeholder="What are your thoughts?"
              />
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  tabIndex={-1}
                  variant="subtle"
                  onClick={() => setIsReplying(false)}
                  className="dark:bg-zinc-700 dark:text-slate-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (!commentReplyInput) return;
                    postComment({
                      postId,
                      text: commentReplyInput,
                      replyToId: comment.replyToId ?? comment.id,
                    });
                  }}
                  disabled={commentReplyInput.length === 0}
                  isLoading={isLoading}
                  className="dark:bg-zinc-900"
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PostComment;
