"use client";

import { FC, startTransition, useTransition } from "react";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { SubscribeToSubconvoPayload } from "@/lib/validators/subconvo";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SubscribeLeaveSubconvoToggleProps {
  subconvoId: string;
  subconvoName: string;
  isSubscribed: boolean;
}

const SubscribeLeaveSubconvoToggle: FC<SubscribeLeaveSubconvoToggleProps> = ({
  subconvoId,
  subconvoName,
  isSubscribed,
}) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubconvoPayload = {
        subconvoId,
      };

      const { data } = await axios.post("/api/subconvo/subscribe", payload);
      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Something went wrong. Please try again later",
        description: "Could not subscribe to the subconvo",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      // refresh the current page without losing state
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Successfully joined!",
        description: `You are now subscribed to cc/${subconvoName}`,
        variant: "default",
      });
    },
  });

  return isSubscribed ? (
    <Button className="mb-4 mt-1 w-full">Leave Community</Button>
  ) : (
    <Button
      isLoading={isSubLoading}
      onClick={() => subscribe()}
      className="mb-4 mt-1 w-full"
    >
      Join to Post
    </Button>
  );
};

export default SubscribeLeaveSubconvoToggle;
