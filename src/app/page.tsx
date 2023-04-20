import Image from "next/image";
import { Inter } from "next/font/google";
import Some from "./some";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/dist/client/components/headers";
import { type Database } from "~/lib/database.types";
import { trpc } from "~/lib/trpc";
import Login from "./login";
// import { PrismaClient } from "@prisma/client";
// import { trpc } from "~/utils/trpc";
// import { prisma } from "~/utils/prisma";
const inter = Inter({ subsets: ["latin"] });
export const revalidate = 0;
export default async function Home() {
  // await prisma.post.findMany().then((res) => {
  //   console.log("^_^ Log \n file: page.tsx:10 \n res:", res);
  // });
  // await prisma.user.findMany().then((res) => {
  //   console.log("^_^ Log \n file: page.tsx:10 \n res:", res);
  // });

  // const supabase = createServerComponentSupabaseClient<Database>({
  //   headers,
  //   cookies,
  // });
  // const { data } = await supabase.from('Post').select("*");
  // console.log("^_^ Log \n file: page.tsx:25 \n data:", data);
  await trpc.userById.query('').then((res) => {
    console.log("^_^ Log \n file: page.tsx:28 \n res:", res);
  });
  return (
    <div>
      <Some />
      <Login />
    </div>
  );
}
