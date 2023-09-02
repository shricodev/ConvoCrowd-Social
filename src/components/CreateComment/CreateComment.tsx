"use client";

import { FC, useState } from "react";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { StatusCodes } from "http-status-codes";
import { useMutation } from "@tanstack/react-query";

import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";

import { CommentRequest } from "@/lib/validators/comment";

import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
}

const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId }) => {
  const [commentInput, setCommentInput] = useState<string>("");
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };

      const { data } = await axios.patch(`/api/subconvo/post/comment`, payload);
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === StatusCodes.UNAUTHORIZED) {
          return loginToast();
        }
      }

      return toast({
        title: "Something went wrong",
        description: "The vote was not registered. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setCommentInput("");
    },
  });

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment">Your comment</Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          className="max-h-52 w-full resize-y bg-zinc-50 dark:bg-zinc-900"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          rows={1}
          placeholder="What are your thoughts?"
        />
        <div className="mt-2 flex justify-end">
          <Button
            onClick={() => comment({ postId, text: commentInput, replyToId })}
            disabled={commentInput.length === 0}
            isLoading={isLoading}
            variant="default"
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
