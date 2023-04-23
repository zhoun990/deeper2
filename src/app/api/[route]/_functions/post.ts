import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { type Database } from "~/lib/database.types";
const post = {
  post: async (body: {
    text: string;
    permittedUsers: { uid: string; level: number }[];
    public: number;
  }) => {
    const res = { succeeded: false, reason: "" };
    const supabase = createRouteHandlerSupabaseClient<Database>({
      headers,
      cookies,
    });
    if (!body.text) {
      res.reason = "text is null";
      return res;
    }
    const { user } = (await supabase.auth.getUser()).data;
    if (!user) {
      res.reason = "not logged in";
      return res;
    }
    await supabase
      .from("Post")
      .insert({ authorId: user.id, text: body.text, public: body.public })
      .select()
      .single()
      .then(async (result) => {
        const postId = result.data?.id;
        if (!postId) return;
        console.log(
          "^_^ Log \n file: post.ts:24 \n result:",
          result.data?.id,
          body.permittedUsers
        );
        for (const permittedUser of body.permittedUsers) {
          const result = await supabase.from("Permission").insert({
            postId,
            userId: permittedUser.uid,
            level: Math.min(5, Math.max(0, permittedUser.level)),
          });
          if (result.error) {
            console.error("^_^ Log \n file: post.ts:38 \n res:", result);
            res.reason = result.error.message;
            return;
          }
        }
        res.succeeded = true;
      });
    return res;
  },
  get: async () => {
    const res = { succeeded: false };
    // const supabase = createRouteHandlerSupabaseClient<Database>({
    //   headers,
    //   cookies,
    // });
    // const { user } = (await supabase.auth.getUser()).data;
    // if (!user) {
    //   return res;
    // }
    // await supabase.from("Post").insert({ authorId: user.id, text: body.text });
    return res;
  },
};
export default post;
