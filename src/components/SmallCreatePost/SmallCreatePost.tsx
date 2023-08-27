"use client";

import { FC } from "react";

import { Session } from "next-auth";
import { Image, Link2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import UserAvatar from "../UserAvatar/UserAvatar";

import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface SmallCreatePostProps {
  session: Session | null;
}

const SmallCreatePost: FC<SmallCreatePostProps> = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <li className="list-none overflow-hidden rounded-md bg-white shadow">
        <div className="flex h-full justify-between gap-6 px-6 py-4">
          <div className="relative ">
            <UserAvatar
              user={{
                name: session?.user?.name || null,
                image: session?.user?.image || null,
              }}
            />

            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 outline outline-2 outline-white" />
          </div>

          <Input
            readOnly
            onClick={() => router.push(pathname + "/submit")}
            placeholder="Create a Post.."
          />
          <Button
            variant="ghost"
            onClick={() => router.push(pathname + "/submit")}
          >
            {/* Because this is not an actual Image tag of next.js, this is an icon */}
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image className="text-zinc-600" />
          </Button>

          <Button
            variant="ghost"
            onClick={() => router.push(pathname + "/submit")}
          >
            <Link2 className="text-zinc-600" />
          </Button>
        </div>
      </li>
    </>
  );
};

export default SmallCreatePost;
