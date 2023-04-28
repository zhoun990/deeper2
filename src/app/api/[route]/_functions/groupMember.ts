import { type Group, type Favorite } from "@prisma/client";
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { type Database } from "~/lib/database.types";
import { prisma } from "~/lib/prisma";
const groupMember = {
  get: async (_: null, { groupId }: { groupId?: number }) => {
    const res = {
      succeeded: false,
      isGroupMember: false,
    };
    if (groupId) {
      const supabase = createRouteHandlerSupabaseClient<Database>({
        headers,
        cookies,
      });
      const { user } = (await supabase.auth.getUser()).data;
      if (!user) return res;
      const data = await prisma.group.findFirst({
        where: {
          AND: [
            { id: Number(groupId) },
            { members: { some: { member: { id: user.id } } } },
          ],
        },
      });
      if (data) {
        res.isGroupMember = true;
      }
      res.succeeded = true;

      return res;
    }

    return res;
  },
};
export default groupMember;
