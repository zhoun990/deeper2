import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/dist/client/components/headers";
import { Inter } from "next/font/google";
import { redirect } from "next/navigation";
import { Timeline } from "./_components/Timeline";
import PostCreateView from "./_post_components/PostCreateView";
import { type Database } from "~/lib/database.types";
import { prisma } from "~/lib/prisma";
const inter = Inter({ subsets: ["latin"] });
export const revalidate = 0;
export default async function Home() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
  const { user } = (await supabase.auth.getUser()).data;
  if (user?.id) {
    if (!(await prisma.user.findFirst({ where: { id: user.id } }))) {
      console.warn("redirect from '/'. no user data:", user);
      redirect("/auth/signup");
    }
    return (
      <div className="flex flex-col 2xl:flex-row-reverse">
        <div className="2xl:sticky 2xl:top-0 2xl:w-1/3">
          {/* @ts-expect-error Server Component */}
          <PostCreateView />
        </div>

        {/* <Logout />
        <Link href={`/${data.username}`}>Profile</Link> */}
        <div className="grow border p-5 2xl:h-screen 2xl:overflow-y-auto">
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
