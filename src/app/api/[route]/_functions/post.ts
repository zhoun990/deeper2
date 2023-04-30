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
    const reply =
      !!body.replyId &&
      (await prisma.post.findUnique({ where: { id: body.replyId } }));
    if (body.replyId && !reply) {
      res.reason = "replyId is invalid";
      return res;
    }
    await prisma.post
      .create({
        data: {
          authorId: user.id,
          text: body.text,
          public: reply ? 0 : body.public,
          publicReply: reply
            ? reply.publicReply !== null
              ? Math.min(reply.publicReply, body.public)
              : body.public
            : null,
          replyId: body.replyId,
          rootId: reply ? reply.rootId || reply.id : null,
          permittedUsers: body.replyId
            ? {}
            : {
                create: body.permittedUsers.map((user) => ({
                  userId: user.uid,
                  level: Math.min(5, Math.max(0, user.level)),
                })),
              },
        },
        include: { author: true },
      })
      .then((result) => {
        const postId = result.id;
        if (!postId) return;
        console.log(
          "^_^ Log \n file: post.ts:24 \n result:",
          postId,
          body.permittedUsers
        );
        res.data = result;
        // for (const permittedUser of body.permittedUsers) {
        //   const result = await prisma.permission
        //     .create({
        //       data: {
        //         postId,
        //         userId: permittedUser.uid,
        //         level: Math.min(5, Math.max(0, permittedUser.level)),
        //       },
        //     })
        //     .catch((e) => {
        //       console.error("^_^ Log \n file: post.ts:63 \n e:", e);
        //     });
        //   if (!result) {
        //     console.error("^_^ Log \n file: post.ts:38 \n res:", result);
        //     res.reason = "create failed";
        //     return;
        //   }
        // }
        res.succeeded = true;
      });
    return res;
  },
};
export default post;
