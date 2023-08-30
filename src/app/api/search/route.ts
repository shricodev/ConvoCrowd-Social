import { db } from "@/lib/db";
import { StatusCodes } from "http-status-codes";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("q");

  if (!query)
    return new Response("Invalid query", { status: StatusCodes.BAD_REQUEST });

  const results = await db.subconvo.findMany({
    where: {
      name: {
        startsWith: query,
      },
    },
    include: {
      _count: true,
    },
    // this should not be hardcoded like this in production.
    take: 10,
  });

  return new Response(JSON.stringify(results), { status: StatusCodes.OK });
}
