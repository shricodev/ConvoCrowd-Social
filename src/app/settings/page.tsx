import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { authOptions, getAuthSession } from "@/lib/auth";

import UsernameForm from "@/components/UsernameForm/UsernameForm";

export const metadata: Metadata = {
  title: "Settings",
  description: "Settings page for user to be able to change their info",
};

const page = async ({}) => {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(authOptions.pages?.signIn || "/sign-in");
  }

  return (
    <div className="mx-auto max-w-3xl py-12">
      <div className="grid items-start">
        <h1 className="mb-4 text-2xl font-bold md:text-3xl">Settings</h1>
      </div>
      <div className="grid gap-10 rounded-md shadow-md">
        <UsernameForm
          user={{
            id: session.user.id,
            username: session.user.username || "",
          }}
        />
      </div>
    </div>
  );
};

export default page;
