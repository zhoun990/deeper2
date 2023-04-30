import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/dist/client/components/headers";
import { Inter } from "next/font/google";
import Link from "next/link";
import { redirect } from "next/navigation";
import PostCreateView from "./_components/PostCreateView";
import { Timeline } from "./_components/Timeline";
import Logout from "./_components/logout";
import { type Database } from "~/lib/database.types";
import { prisma } from "~/lib/prisma";
const inter = Inter({ subsets: ["latin"] });
export const revalidate = 0;
export default async function Home() {
  // await prisma.post.findMany().then((res) => {
  //   console.log("^_^ Log \n file: page.tsx:10 \n res:", res);
  // });
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
  const { user } = (await supabase.auth.getUser()).data;
  if (user) {
    if (!(await prisma.user.findUnique({ where: { id: user.id } }))) {
      console.warn("redirect from '/'. no user data:", user);
      redirect("/register");
    }
    return (
      <div className="flex flex-col 2xl:flex-row-reverse">
        <div className="2xl:sticky 2xl:top-0">
          {/* @ts-expect-error Server Component */}
          <PostCreateView />
        </div>

        {/* <Logout />
        <Link href={`/${data.username}`}>Profile</Link> */}
        <div className="grow 2xl:h-screen 2xl:overflow-y-auto p-5">
          {/* @ts-expect-error Server Component */}
          <Timeline />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* <Link href={"/register"}>Login</Link> */}
      {/* @ts-expect-error Server Component */}
      <Timeline />
    </div>
  );
}
