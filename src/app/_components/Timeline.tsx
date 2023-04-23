import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import ClientLink from "./ClientLink";
import PostView from "./PostView";
import { type Database } from "~/lib/database.types";
import { prisma } from "~/lib/prisma";

export const Timeline = async () => {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
  const user = await supabase.auth.getUser().then((res) => res.data.user);
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { public: { gte: 1 } },
        ...(user
          ? [
              // {
              //   follower: { gte: 1 },
              //   author: { follower: { some: { fromId: user.id } } },
              // },
              {
                permittedUsers: {
                  some: { userId: user.id, level: { gte: 1 } },
                },
              },
            ]
          : []),
      ],
    },
    include: { author: true },
  });
  console.log("^_^ Log \n file: page.tsx:79 \n posts:", posts.length);
  return (
    <>
      {posts
        .sort((a, b) => {
          return b.createdAt.getTime() - a.createdAt.getTime();
        })
        .map((post) => (
          <ClientLink
            key={post.id}
            href={`/${post.author.username}/${post.id}`}
          >
            <PostView post={post} profile={post.author}  />
          </ClientLink>
        ))}
    </>
  );
};
