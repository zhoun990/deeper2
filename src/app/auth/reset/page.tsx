// const newPassword = prompt(
//   "What would you like your new password to be?"
// );
// if (!newPassword) return;
// const { data, error } = await supabase.auth.updateUser({
//   password: newPassword,
// });

import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { type Database } from "~/lib/database.types";
import NewPassword from "./NewPassword";

// if (data) alert("Password updated successfully!");
// if (error) alert("There was an error updating your password.");
export default async function Home() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
  const user = await supabase.auth.getUser().then((res) => res.data.user);
  if (!user) {
    redirect("/");
  }
  return <NewPassword />;
}
