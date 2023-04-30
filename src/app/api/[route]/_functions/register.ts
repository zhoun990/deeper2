import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { type Database } from "~/lib/database.types";
import { prisma } from "~/lib/prisma";

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
    if (!user) return res;
    // if (
    //   await prisma.user.findUnique({ where: { id: user.id } }).catch((err) => {
    //     console.error("^_^ Log \n file: register.ts:30 \n err:", err);
    //     return undefined;
    //   })
    // )
    //   return res;
    if (
      await prisma.user.findUnique({ where: { username } }).catch((err) => {
        console.error("^_^ Log \n file: register.ts:30 \n err:", err);
        return undefined;
      })
    )
      return res;
    res.isUsernameAvailable = true;
    await prisma
      .$transaction(async (prisma) => {
        await prisma.user.create({
          data: { id: user.id, username, bio, name: displayname },
        });
        await prisma.group
          .create({
            data: {
              title: "$$primary-tag$$",
              isPublic: false,
              allowJoin: true,
              isPrimary: true,
              members: {
                create: {
                  memberId: user.id,
                  permission: ["EditGroupPermission", "Owner"],
                },
              },
            },
          })
          .then((result) => {
            console.log("^_^ Log \n file: route.ts:42 \n res:", result);
            res.succeeded = true;
          });
      })
      .catch((err) => {
        console.error("^_^ Log \n file: register.ts:30 \n err:", err);
      });

    return res;
  },
};
export default register;
