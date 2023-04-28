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
   
    const { data } = await supabase
      .from("User")
      .select()
      .eq("id", user.id)
      .single();
    if (!data) {
      redirect("/register");
    }
    return (
      <div>
        {/* @ts-expect-error Server Component */}
        <PostCreateView />
        {/* <Logout />
        <Link href={`/${data.username}`}>Profile</Link> */}
        {/* @ts-expect-error Server Component */}
        <Timeline />
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
