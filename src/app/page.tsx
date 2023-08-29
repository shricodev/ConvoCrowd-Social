import Link from "next/link";
import { HomeIcon, Lightbulb } from "lucide-react";

import { getAuthSession } from "@/lib/auth";

import { buttonVariants } from "@/components/ui/Button";
import CustomFeed from "@/components/CustomFeed/CustomFeed";
import GeneralFeed from "@/components/GeneralFeed/GeneralFeed";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";

export default async function Home() {
  const session = await getAuthSession();

  return (
    <>
      <Alert className="mb-8 w-fit shadow-md">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          This is my personal project, I have used all the free apis. You might
          experience some delay when requesting data.
        </AlertDescription>
      </Alert>
      <h1 className="text-3xl font-bold md:text-4xl">Your Feed</h1>
      <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
        {/* feed */}
        {session?.user ? <CustomFeed session={session} /> : <GeneralFeed />}

        {/* subconvo info */}
        <div className="order-first h-fit overflow-hidden rounded-lg border border-gray-200 shadow md:order-last">
          <div className="bg-gray-200 px-6 py-4">
            <p className="flex items-center gap-1.5 py-3 font-semibold">
              <HomeIcon className="h-4 w-4" />
              Home
            </p>
          </div>

          <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Your personal ConvoCrowd feed. Come here to check your favorite
                communities.
              </p>
            </div>

            <Link
              className={buttonVariants({
                className: "mb-6 mt-4 w-full",
              })}
              href="/cc/create"
            >
              Create Community
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
