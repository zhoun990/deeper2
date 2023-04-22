import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { type Database } from "~/lib/database.types";

const register = {
  post: async ({
    username,
    bio,
    displayname,
  }: {
    username: string;
    displayname: string;
    bio: string;
  }) => {
    const res = { isUsernameAvailable: false, succeeded: false };
    const supabase = createRouteHandlerSupabaseClient<Database>({
      headers,
      cookies,
    });
    const { user } = (await supabase.auth.getUser()).data;
    if (user) {
      if (
        (await supabase.from("User").select().eq("id", user.id)).data
          ?.length === 0
      ) {
        if (
          (await supabase.from("User").select().eq("username", username)).data
            ?.length === 0
        ) {
          res.isUsernameAvailable = true;
          await supabase
            .from("User")
            .insert({ id: user.id, username, bio, name: displayname })
            .then((result) => {
              res.succeeded = true;
              console.log("^_^ Log \n file: route.ts:42 \n res:", result);
            });
        }
      }
    }
    return res;
  },
};
export default register;
