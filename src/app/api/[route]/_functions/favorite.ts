import { type Favorite } from "@prisma/client";
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { type Database } from "~/lib/database.types";
import { prisma } from "~/lib/prisma";
const favorite = {
  get: async (_: null, params: { uid: string }) => {
    const res: { succeeded: boolean; data: null | Favorite } = {
      succeeded: false,
      data: null,
    };
    const supabase = createRouteHandlerSupabaseClient<Database>({
      headers,
      cookies,
    });
    const { user } = (await supabase.auth.getUser()).data;
    if (user) {
      const data = await prisma.favorite.findFirst({
        where: { AND: [{ fromId: user.id }, { toId: params.uid }] },
      });
      if (data) {
        res.data = data;
        res.succeeded = true;
      }
      return res;
    }
    return res;
  },
  post: async ({
    uid,
    notification,
  }: {
    uid: string;
    notification: number;
  }) => {
    const res = { succeeded: false };
    const supabase = createRouteHandlerSupabaseClient<Database>({
      headers,
      cookies,
    });
    const { user } = (await supabase.auth.getUser()).data;
    if (user) {
      await prisma.favorite
        .upsert({
          create: {
            fromId: user.id,
            toId: uid,
            permissionLevel: Math.min(1, Math.max(0, notification)),
          },
          update: {
            permissionLevel: Math.min(1, Math.max(0, notification)),
          },
          where: { fromId_toId: { fromId: user.id, toId: uid } },
        })
        .then((result) => {
          console.log("^_^ Log \n file: route.ts:42 \n res:", result);
          if (result) {
            res.succeeded = true;
          }
        });
    }
    return res;
  },
  delete: async (_: null, { uid }: { uid: string }) => {
    const res = { succeeded: false };
    const supabase = createRouteHandlerSupabaseClient<Database>({
      headers,
      cookies,
    });
    const { user } = (await supabase.auth.getUser()).data;
    if (user) {
      await prisma.favorite
        .delete({
          where: { fromId_toId: { fromId: user.id, toId: uid } },
        })
        .then((result) => {
          console.log("^_^ Log \n file: route.ts:42 \n res:", result);
          res.succeeded = true;
        });
    }
    return res;
  },
};
export default favorite;
