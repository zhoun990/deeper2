import { type Group, type Favorite, type User } from "@prisma/client";
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { type Database } from "~/lib/database.types";
import { prisma } from "~/lib/prisma";
const editProfile = {
  post: async ({
    name,
    bio,
    profilePhotoURL,
  }: {
    name?: string;
    bio?: string;
    profilePhotoURL?: string;
  }) => {
    const res = { succeeded: false, data: null as User | null };
    const supabase = createRouteHandlerSupabaseClient<Database>({
      headers,
      cookies,
    });
    const { user } = (await supabase.auth.getUser()).data;
    if (user) {
      //プロフをアップデートする
      const data = await prisma.user.update({
        where: { id: user.id },
        data: {
          name,
          bio,
          profilePhotoURL,
        },
      });
      if (data) {
        res.data = data;
        res.succeeded = true;
      }
    }
    return res;
  },
};
export default editProfile;
