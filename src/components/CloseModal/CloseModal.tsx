"use client";

import { FC } from "react";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "../ui/Button";

const CloseModal: FC = () => {
  const router = useRouter();
  return (
    <Button
      variant="subtle"
      className="h-6 w-6 rounded-md p-0 dark:bg-zinc-700"
      aria-label="close modal"
      onClick={() => router.back()}
    >
      <X className="h-4 w-4 dark:text-slate-50" />
    </Button>
  );
};

export default CloseModal;
