import { FC } from "react";

import Image from "next/image";
import { User } from "next-auth";
import { AvatarProps } from "@radix-ui/react-avatar";

import { Icons } from "../Icons/Icons";

import { Avatar, AvatarFallback } from "../ui/Avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            fill
            src={user.image}
            alt="profile picture icon"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          {/* for screenreaders */}
          <span className="sr-only">{user?.name}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
