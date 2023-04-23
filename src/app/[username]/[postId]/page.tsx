import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/dist/client/components/headers";
import { type Database } from "~/lib/database.types";
import { prisma } from "~/lib/prisma";
import PostView from "../../_components/PostView";
import { UserPageNotFound } from "../_components/UserPageNotFound";
// export const revalidate = 0;
export default async function Home({
  params,
}: {
  params: { username: string; postId: string };
}) {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
  const user = await supabase.auth.getUser().then((res) => res.data.user);
  const post = await prisma.post.findFirst({
    where: {
      id: Number(params.postId),
      OR: [
        { authorId: user?.id },
        ...(user
          ? [
              {
                permittedUsers: {
                  some: { userId: user.id, level: { gte: 1 } },
                },
              },
              // {
              //   follower: { gte: 1 },
              //   author: { follower: { some: { fromId: user.id } } },
              // },
            ]
          : []),
        { public: { gte: 1 } },
      ],
    },
    include: { author: true },
  });
  if (!post) {
    return <UserPageNotFound />;
  }

  return (
    <div className="min-h-screen bg-black">
      <PostView
        post={post}
        profile={post.author}
        key={post.id}
        className="mt-2"
      />
    </div>
  );
}
