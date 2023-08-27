"use client";

import { FC, useState } from "react";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { StatusCodes } from "http-status-codes";
import { useMutation } from "@tanstack/react-query";

import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";

import type { CreateSubconvoPayload } from "@/lib/validators/subconvo";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const Page: FC = () => {
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const { loginToast } = useCustomToast();

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubconvoPayload = {
        name: input,
      };
      const { data } = await axios.post("/api/subconvo", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === StatusCodes.CONFLICT) {
          return toast({
            title: "Error: subconvo name already exists!",
            description: "Please use a different subconvo name",
            variant: "destructive",
            className: "rounded-xl",
          });
        }

        if (err.response?.status === StatusCodes.UNPROCESSABLE_ENTITY) {
          return toast({
            title: "Error: Invalid subconvo name!",
            description: "Please choose a name between 3 and 21 characters",
            variant: "destructive",
            className: "rounded-xl",
          });
        }

        if (err.response?.status === StatusCodes.UNAUTHORIZED) {
          return loginToast();
        }
      }
      return toast({
        title: "Something went wrong. Please try again later",
        description: "Could not create the subconvo",
        variant: "default",
      });
    },
    onSuccess: (data) => {
      router.push(`/cc/${data}`);
    },
  });

  return (
    <div className="container mx-auto flex h-full max-w-3xl items-center">
      <div className="relative h-fit w-full space-y-6 rounded-lg bg-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Create a community</h1>
        </div>

        <hr className="h-px bg-zinc-500" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="pb-2 text-xs">
            Community names including capitalization cannot be changed.
          </p>
          <div className="relative">
            <p className="absolute inset-y-0 left-0 grid w-8 place-items-center text-sm text-zinc-400">
              cc/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-7"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant={"subtle"} onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => createCommunity()}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
