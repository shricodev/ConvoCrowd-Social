import { FC } from "react";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import SignUp from "@/components/SignUp/SignUp";

const page: FC = () => {
  return (
    <div className="absolute inset-0">
      <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-20">
        <Link
          href="/"
          className={cn(
            "mb-20 self-start",
            buttonVariants({ variant: "ghost" }),
          )}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Home
        </Link>
        <SignUp />
      </div>
    </div>
  );
};

export default page;
