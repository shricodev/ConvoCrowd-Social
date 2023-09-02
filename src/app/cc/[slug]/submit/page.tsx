import { notFound } from "next/navigation";

import { db } from "@/lib/db";

import Editor from "@/components/Editor/Editor";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: PageProps) => {
  const subconvo = await db.subconvo.findFirst({
    where: { name: params.slug },
  });

  if (!subconvo) return notFound();

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900 dark:text-slate-50">
            Create a Post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
            in cc/{params.slug}
          </p>
        </div>
      </div>

      {/* post form */}
      <Editor subconvoId={subconvo.id} />

      <div className="flex w-full justify-end">
        <Button
          type="submit"
          className="w-full active:bg-zinc-500 dark:bg-slate-600"
          form="subconvo-post-form"
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default page;
