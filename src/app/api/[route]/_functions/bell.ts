import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { type Database } from "~/lib/database.types";

const bell = {
  post: async ({ uid }: { uid: string }) => {
    const supabase = createRouteHandlerSupabaseClient<Database>({
      headers,
      cookies,
    });
    const { user } = (await supabase.auth.getUser()).data;
    if (user) {
      return await supabase
        .from("Bell")
        .select()
        .eq("fromId", user.id)
        .eq("toId", uid)
        .single();
    }
    return undefined
  },
  put: async ({ uid, notification }: { uid: string; notification: number }) => {
    const res = { succeeded: false };
    const supabase = createRouteHandlerSupabaseClient<Database>({
      headers,
      cookies,
    });
    const { user } = (await supabase.auth.getUser()).data;
    if (user) {
      await supabase
        .from("Bell")
        .upsert({
          fromId: user.id,
          toId: uid,
          notification: Math.min(1, Math.max(0, notification)),
        })
        .then((result) => {
          if (result.error) {
            console.log("^_^ Log \n file: route.ts:42 \n res:", result);

            return;
          }
          res.succeeded = true;
        });
    }
    return res;
  },
  delete: async ({ uid }: { uid: string }) => {
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
export default bell;
