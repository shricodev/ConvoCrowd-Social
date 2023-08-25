import Link from "next/link";
import { toast } from "./use-toast";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";

export const useCustomToast = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: "Login to continue",
      description: "You need to login to perform this operation",
      className: "rounded-xl",
      action: (
        <Link
          href="/sign-in"
          onClick={() => dismiss()}
          className={cn(
            buttonVariants({
              variant: "subtle",
            }),
          )}
        >
          Login
        </Link>
      ),
    });
  };

  return { loginToast };
};
