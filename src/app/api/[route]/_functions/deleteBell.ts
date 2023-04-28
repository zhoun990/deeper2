import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { type Database } from "~/lib/database.types";

const deleteBell = {
  post: async ({ uid }: { uid: string }) => {
    const res = { succeeded: false };
    const supabase = createRouteHandlerSupabaseClient<Database>({
      headers,
      cookies,
    });
    const { user } = (await supabase.auth.getUser()).data;
    if (user) {
      await supabase
        .from("Bell")
        .delete()
        .eq("fromId", user.id)
        .eq("toId", uid)
        .then((result) => {
          console.log("^_^ Log \n file: route.ts:42 \n res:", result);

          if (result.error) {
            return;
          }
          res.succeeded = true;
        });
    }
    return res;
  },
};
export default deleteBell;
