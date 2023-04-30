import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/dist/client/components/headers";
import { Inter } from "next/font/google";
import { redirect } from "next/navigation";
import Login from "./login";
import Register from "./register";
import { type Database } from "~/lib/database.types";
import { prisma } from "~/lib/prisma";
const inter = Inter({ subsets: ["latin"] });
export const revalidate = 0;
export default async function Home() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
  const user = await supabase.auth.getUser().then((res) => res.data.user);
  if (user) {
    if (await prisma.user.findUnique({ where: { id: user.id } })) {
      redirect("/");
    }
    return <Register />;
  }
  return <Login />;
}
