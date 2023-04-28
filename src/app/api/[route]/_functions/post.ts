import { type Post, type User } from "@prisma/client";
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { type Database } from "~/lib/database.types";
import { prisma } from "~/lib/prisma";
const post = {
  post: async (body: {
    text: string;
    permittedUsers: { uid: string; level: number }[];
    public: number;
    replyId?: number;
  }) => {
    const res = {
      succeeded: false,
      reason: "",
      data: null as
        | (Post & {
            author: User;
          })
        | null,
    };
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
    //prismaで書き換える
    await prisma.post
      .create({
        data: {
          authorId: user.id,
          text: body.text,
          public: body.public,
          replyId: body.replyId,
        },
        include: { author: true },
      })
      .then(async (result) => {
        const postId = result.id;
        if (!postId) return;
        console.log(
          "^_^ Log \n file: post.ts:24 \n result:",
          postId,
          body.permittedUsers
        );
        res.data = result;
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
