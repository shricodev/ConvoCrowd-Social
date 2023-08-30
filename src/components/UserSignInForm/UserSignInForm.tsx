"use client";

import { FC, HTMLAttributes, useState } from "react";

import { signIn } from "next-auth/react";

import { Icons } from "../Icons/Icons";

import { useToast } from "@/hooks/use-toast";

import { cn } from "@/lib/utils";

import { Button } from "../ui/Button";

interface UserSignInFormProps extends HTMLAttributes<HTMLDivElement> {}

const UserSignInForm: FC<UserSignInFormProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>();
  const { toast } = useToast();

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      // send toast notification in case of failure
      toast({
        title: "Something Went Wrong!",
        description:
          "There was an error trying to sign you in with Google. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex justify-center", className)} {...props}>
      <Button
        size="sm"
        className="w-full dark:bg-zinc-700"
        onClick={loginWithGoogle}
        isLoading={isLoading}
      >
        {isLoading ? null : <Icons.google className="mr-2 h-4 w-4" />}
        Google
      </Button>
    </div>
  );
};

export default UserSignInForm;
