"use client";

import { FC } from "react";
import { Button } from "../ui/Button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const CloseModal: FC = () => {
  const router = useRouter();
  return (
    <Button
      variant="subtle"
      className="h-6 w-6 rounded-md p-0"
      aria-label="close modal"
      onClick={() => router.back()}
    >
      <X className="h-4 w-4" />
    </Button>
  );
};

export default CloseModal;
