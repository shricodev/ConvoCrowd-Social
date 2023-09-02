import { FC } from "react";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";

import SignIn from "@/components/SignIn/SignIn";
import { buttonVariants } from "@/components/ui/Button";

const page: FC = () => {
  return (
    <div className="absolute inset-0">
      <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-20">
        <Link
          href="/"
          className={cn(
            "mb-20 self-start dark:bg-zinc-600 dark:text-slate-50",
            buttonVariants({ variant: "ghost" }),
          )}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Home
        </Link>
        <SignIn />
      </div>
    </div>
  );
};

export default page;
