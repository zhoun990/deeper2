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
    if (user) {
      const { data } = await supabase.from("User").select().eq("id", user.id);
      if (!data || data?.length === 0) {
        console.log(
          "^_^ Log \n f:",
          (await supabase.from("User").select().eq("username", username)).data
        );
        const { data } = await supabase
          .from("User")
          .select()
          .eq("username", username);
        if (!data || data?.length === 0) {
          res.isUsernameAvailable = true;

          if (
            !(await prisma.user.create({
              data: { id: user.id, username, bio, name: displayname },
            }))
          ) {
            return res;
          }
          const data = await prisma.group.create({
            data: {
              title: "$$primary-tag$$",
              isPublic: false,
              allowJoin: true,
              isPrimary: true,
            },
          });
          if (data)
            await prisma.groupMember
              .create({
                data: {
                  groupId: data.id,
                  memberId: user.id,
                  permission: ["EditGroupPermission", "Owner"],
                },
              })
              .then((result) => {
                console.log("^_^ Log \n file: route.ts:42 \n res:", result);
                res.succeeded = true;
              });
        }
      }
    }
    return res;
  },
};
export default register;
