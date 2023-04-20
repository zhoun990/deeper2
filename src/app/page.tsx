import Image from "next/image";
import { Inter } from "next/font/google";
import Some from "./some";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/dist/client/components/headers";
import { type Database } from "~/lib/database.types";
import Login from "./register/login";
import { redirect } from "next/navigation";
// import { PrismaClient } from "@prisma/client";
// import { trpc } from "~/utils/trpc";
// import { prisma } from "~/utils/prisma";
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
  const { data } = await supabase.from("Post").select("*");
  console.log("^_^ Log \n file: page.tsx:26 \n data:", data);
  const { data: auth } = await supabase.auth.getUser();
  // if (auth) {
  //   const data = await supabase
  //     .from("User")
  //     .select("*")
  //     .eq("email", auth.user?.email);
  //   if (data.data?.length === 0) redirect("/register");
  // }

  return (
    <div>
      {JSON.stringify(auth)}
      <Some />
      <Login />
    </div>
  );
}
