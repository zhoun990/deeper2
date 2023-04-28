import { type Group, type Favorite } from "@prisma/client";
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { type Database } from "~/lib/database.types";
import { prisma } from "~/lib/prisma";
const group = {
  get: async (_: null, { uid }: { uid?: string }) => {
    const res: { succeeded: boolean; data: Group[] } = {
      succeeded: false,
      data: [],
    };
    if (uid) {
      const data = await prisma.group.findMany({
        where: { members: { some: { member: { id: uid } } }, isPublic: true },
      });
      if (data) {
        res.data = data;
        res.succeeded = true;
      }
      return res;
    }
    const supabase = createRouteHandlerSupabaseClient<Database>({
      headers,
      cookies,
    });
    const { user } = (await supabase.auth.getUser()).data;
    if (user) {
      const data = await prisma.group.findMany({
        where: { members: { some: { member: { id: user.id } } } },
      });
      if (data) {
        res.data = data;
        res.succeeded = true;
      }
      return res;
    }
    return res;
  },
  post: async ({ id, title }: { id?: number; title?: string }) => {
    const res = { succeeded: false, data: null as Group | null };
    const supabase = createRouteHandlerSupabaseClient<Database>({
      headers,
      cookies,
    });
    const { user } = (await supabase.auth.getUser()).data;
    if (user) {
      const data =
        !id && title
          ? await prisma.group.create({ data: { title: title } })
          : id &&
            (await prisma.group.findFirst({
              where: {
                id,
                allowJoin: true,
              },
            }));
      if (data) {
        res.data = data;
        await prisma.groupMember
          .create({
            data: {
              groupId: data.id,
              memberId: user.id,
              permission: [
                "EditGroupPermission",
                "EditDescription",
                "EditMembersPermission",
              ],
            },
          })
          .then((result) => {
            console.log("^_^ Log \n file: route.ts:42 \n res:", result);
            res.succeeded = true;
          })
          .catch((err) => {
            console.log("T_T Log \n file: route.ts:45 \n err:", err);
          });
      }
    }
    return res;
  },
  put: async (group: Group) => {
    //Groupのtitleを変更する
    const res = { succeeded: false };
    const supabase = createRouteHandlerSupabaseClient<Database>({
      headers,
      cookies,
    });
    const { user } = (await supabase.auth.getUser()).data;
    if (user) {
      const data = await prisma.group.update({
        where: { id: group.id },
        data: { title: group.title },
      });
      if (data) {
        res.succeeded = true;
      }
      return res;
    }
    return res;
  },
  delete: async (_: null, { groupId }: { groupId: number }) => {
    console.log("^_^ Log \n file: group.ts:120 \n groupId:", groupId);

    const res = { succeeded: false };
    const supabase = createRouteHandlerSupabaseClient<Database>({
      headers,
      cookies,
    });
    const { user } = (await supabase.auth.getUser()).data;
    if (user) {
      const data = await prisma.groupMember.delete({
        where: {
          groupId_memberId: { groupId: Number(groupId), memberId: user.id },
        },
      });
      if (data) {
        res.succeeded = true;
      }
      return res;
    }
    return res;
  },
};
export default group;
