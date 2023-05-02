import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthSwitcher } from "../AuthSwitcher";
import Register from "./Register";
import { type Database } from "~/lib/database.types";
import { prisma } from "~/lib/prisma";

export default async function Home() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
  const user = await supabase.auth.getUser().then((res) => res.data.user);
  if (user) {
    if (await prisma.user.findFirst({ where: { id: user.id } })) {
      redirect("/");
    }
    return <Register />;
  }
  return <AuthSwitcher type="signup" />;
}
