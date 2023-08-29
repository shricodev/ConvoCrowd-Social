import Link from "next/link";

import { Icons } from "../Icons/Icons";

import UserAccountDropdown from "../UserAccountDropdown/UserAccountDropdown";

import { cn } from "@/lib/utils";
import { getAuthSession } from "@/lib/auth";

import { buttonVariants } from "../ui/Button";
import { ModeToggle } from "../ui/ModeToggle";

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className="fixed inset-x-0 top-0 z-[10] h-fit border-b border-zinc-300 bg-zinc-100 py-3">
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between gap-2">
        {/* logo */}
        <Link href="/" className="flex items-center gap-2">
          <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <p className="text-md hidden select-none font-semibold text-zinc-700 md:block">
            ConvoCrowd
          </p>
        </Link>

        {/* search bar */}

        <div className="flex items-center gap-4">
          {/* mode toggle: dark, light, system */}
          <ModeToggle />

          {session?.user ? (
            <UserAccountDropdown user={session.user} />
          ) : (
            <Link
              href="/sign-in"
              className={cn("select-none", buttonVariants())}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
