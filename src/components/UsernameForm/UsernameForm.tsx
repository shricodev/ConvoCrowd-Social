"use client";

import { FC } from "react";

import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { StatusCodes } from "http-status-codes";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "@/hooks/use-toast";

import {
  UsernameChangeRequest,
  UsernameValidator,
} from "@/lib/validators/username";

import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/Card";

interface UsernameFormProps {
  user: Pick<User, "id" | "username">;
}

const UsernameForm: FC<UsernameFormProps> = ({ user }) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UsernameChangeRequest>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      username: user?.username || "",
    },
  });

  const { mutate: updateUsername, isLoading } = useMutation({
    mutationFn: async ({ username }: UsernameChangeRequest) => {
      const payload: UsernameChangeRequest = {
        username,
      };

      const { data } = await axios.patch("/api/username", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === StatusCodes.CONFLICT) {
          return toast({
            description:
              "Username already exists. Please use a different username",
            variant: "destructive",
            className: "rounded-xl",
          });
        }
      }
      return toast({
        title: "Something went wrong. Please try again later",
        description: "Could not change the username",
        variant: "default",
      });
    },
    onSuccess: () => {
      toast({
        description: "Your username changed successfully",
      });
      router.refresh();
    },
  });

  return (
    <form
      onSubmit={handleSubmit((event) => {
        updateUsername(event);
      })}
    >
      <Card>
        <CardHeader>
          <CardTitle>Your username</CardTitle>
          <CardDescription>
            Please enter the username you want to use.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute left-0 top-0 grid h-10 w-8 place-items-center">
              <span className="mr-1 text-sm text-zinc-400">u/</span>
            </div>

            <Label className="sr-only" htmlFor="username">
              Username
            </Label>
            <Input
              id="username"
              className="max-w-sm pl-6"
              size={32}
              {...register("username")}
            />

            {errors?.username && (
              <p className="px-1 text-xs text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={isLoading} className="dark:bg-zinc-800">
            Change username
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UsernameForm;
