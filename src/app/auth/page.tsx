import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/dist/client/components/headers";
import { redirect } from "next/navigation";
import { type Database } from "~/lib/database.types";
import { prisma } from "~/lib/prisma";
import { AuthSwitcher } from "./AuthSwitcher";

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
    redirect("/auth/signup");
  }
  return <AuthSwitcher />
}
