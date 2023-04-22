import Image from "next/image";
import { Inter } from "next/font/google";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/dist/client/components/headers";
import { type Database } from "~/lib/database.types";
import Login from "./login";
import { RedirectWithAuthState } from "../_components/RedirectWithAuthState";
import Register from "./register";
import { redirect } from "next/navigation";
const inter = Inter({ subsets: ["latin"] });
export const revalidate = 0;
export default async function Home() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
  const user = await supabase.auth.getUser().then((res) => res.data.user);
  if (user) {
    const { data } = await supabase.from("User").select().eq("id", user.id);
    if (data && data?.length > 0) {
      console.log("^_^ Log \n file: RedirectWithAuthState.tsx:26 \n push:/");
      redirect("/");
    }
  }
  return user ? <Register /> : <Login />;
}
