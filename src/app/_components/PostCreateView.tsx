import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import PostCreateForm from "./PostCreateForm";
import { type Database } from "~/lib/database.types";

export default async function PostCreateView() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
  const { user } = (await supabase.auth.getUser()).data;
  const users = (await supabase.from("User").select().neq("id", user?.id)).data;
  return (
    <div className="flex flex-col items-center p-5">
      <PostCreateForm users={users || []} />
    </div>
  );
}
