import axios from "axios";
import { StatusCodes } from "http-status-codes";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const href = url.searchParams.get("url");

  if (!href) {
    return new Response("Invalid href", { status: StatusCodes.BAD_REQUEST });
  }

  const response = await axios.get(href);

  const titleMatch = response.data.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : "";

  const descriptionMatch = response.data.match(
    /<meta name="description" content="(.*?)"/,
  );
  const description = descriptionMatch ? descriptionMatch[1] : "";

  const imageMatch = response.data.match(
    /<meta property="og:image" content="(.*?)"/,
  );
  const imageUrl = imageMatch ? imageMatch[1] : "";

  return new Response(
    JSON.stringify({
      success: 1,
      meta: {
        title,
        description,
        image: {
          url: imageUrl,
        },
      },
    }),
  );
}
