import { type Bell } from "@prisma/client";
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { type Database } from "~/lib/database.types";
import { prisma } from "~/lib/prisma";

const getBell = {
  post: async (_: undefined, { uid }: { uid: string }) => {
    console.log("^_^ Log \n file: bell.ts:7 \n uid:", uid);
    const res: { succeeded: boolean; data: null | Bell } = {
      succeeded: false,
      data: null,
    };
    const supabase = createRouteHandlerSupabaseClient<Database>({
      headers,
      cookies,
    });
    const { user } = (await supabase.auth.getUser()).data;
    // if (user) {
    //   const data = await prisma.bell.findFirst({
    //     where: { fromId: user.id, toId: uid },
    //   });
    //   res.data = data;
    //   res.succeeded=true
    //   return res;
    // }
    return res;
  },
};
export default getBell;
