import { ReactNode } from "react";

import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";

import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

import { buttonVariants } from "@/components/ui/Button";
import SubscribeLeaveSubconvoToggle from "@/components/SubscribeLeaveSubconvoToggle/SubscribeLeaveSubconvoToggle";

interface LayoutProps {
  children: ReactNode;
  params: {
    slug: string;
  };
}

const Layout = async ({ children, params: { slug } }: LayoutProps) => {
  const session = await getAuthSession();
  const subconvo = await db.subconvo.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  });

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subconvo: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscribed = !!subscription;

  if (!subconvo) return notFound();

  const memberCount = await db.subscription.count({
    where: {
      subconvo: {
        name: slug,
      },
    },
  });

  const postCount = await db.post.count({
    where: {
      subconvo: {
        name: slug,
      },
    },
  });

  return (
    <div className="mx-auto h-full max-w-7xl pt-10 sm:container">
      <div>
        <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
          <div className="col-span-2 flex flex-col space-y-6">{children}</div>

          {/* info sidebar */}
          <div className="order-first hidden h-fit overflow-hidden rounded-lg border border-gray-200 dark:border-zinc-800  md:order-last md:block">
            <div className="px-6 py-4 dark:bg-zinc-800">
              <p className="py-3 font-semibold">About cc/{subconvo.name}</p>
            </div>
            <dl className="divide-y divide-gray-100 bg-white px-6 py-4 text-sm leading-6 dark:divide-gray-700 dark:bg-zinc-900">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500 dark:text-slate-200">Created</dt>
                <dd className="text-gray-700 dark:text-slate-100">
                  <time dateTime={subconvo.createdAt.toDateString()}>
                    {format(subconvo.createdAt, "MMMM d, yyyy")}
                  </time>
                </dd>
              </div>

              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500 dark:text-slate-200">Members</dt>
                <dd className="text-gray-700 dark:text-slate-50">
                  <div className="text-gray-900 dark:text-slate-100">
                    {memberCount}
                  </div>
                </dd>
              </div>

              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500 dark:text-slate-200">Posts</dt>
                <dd className="text-gray-700 dark:text-slate-50">
                  <div className="text-gray-900 dark:text-slate-100">
                    {postCount}
                  </div>
                </dd>
              </div>

              {subconvo.creatorId === session?.user.id ? (
                <div className="flex justify-between gap-x-4 py-3">
                  <p className="text-gray-500 dark:text-slate-300">
                    You created this community
                  </p>
                </div>
              ) : null}

              {subconvo.creatorId !== session?.user.id ? (
                <SubscribeLeaveSubconvoToggle
                  subconvoId={subconvo.id}
                  subconvoName={subconvo.name}
                  isSubscribed={isSubscribed}
                />
              ) : null}

              <Link
                className={buttonVariants({
                  variant: "subtle",
                  className:
                    "mb-6 w-full dark:border-none dark:bg-zinc-800 dark:text-slate-50",
                })}
                href={`/cc/${subconvo.name}/submit`}
              >
                Create Post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
