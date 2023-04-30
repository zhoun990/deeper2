import { type Post } from "@prisma/client";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import PostCreateForm from "./PostCreateForm";
import { type Database } from "~/lib/database.types";
import { prisma } from "~/lib/prisma";

export default async function PostCreateView({ post }: { post?: Post }) {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
  const { user } = (await supabase.auth.getUser()).data;
  const users = (await prisma.favorite.findMany({
    where: { from: { id: user?.id } },
    include: { to: true },
  })).map((favorite) => favorite.to);
  return (
    <div className="flex flex-col items-center p-5">
      <PostCreateForm users={users || []} />
    </div>
  );
}
