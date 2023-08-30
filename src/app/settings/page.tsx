import { FC } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Settings page for user to be able to change their info",
};

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return <div>page</div>;
};

export default page;
