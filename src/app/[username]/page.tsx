import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/dist/client/components/headers";
import ClientLink from "../_components/ClientLink";
import PostView from "../_components/PostView";
import { ProfileView } from "./_components/ProfileView";
import { UserPageNotFound } from "./_components/UserPageNotFound";
import { type Database } from "~/lib/database.types";
import { prisma } from "~/lib/prisma";
export const revalidate = 0;
export default async function Home({
  params,
}: {
  params: { username: string };
}) {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
  const user = await supabase.auth.getUser().then((res) => res.data.user);
  const profile = await prisma.user.findFirst({
    where: { username: params.username },
    include: {
      posts: {
        where: {
          OR: [
            { authorId: user?.id },
            { public: { gte: 1 } },
            // user
            //   ? {
            //       follower: { gte: 1 },
            //       author: { follower: { some: { fromId: user.id } } },
            //     }
            //   : {},
            user
              ? {
                  permittedUsers: {
                    some: { userId: user.id, level: { gte: 1 } },
                  },
                }
              : {},
          ],
        },
      },
      bellMarked: { select: { toId: true } },
      bellMarker: { select: { fromId: true } },
    },
  });
  if (!profile) {
    return <UserPageNotFound />;
  }
  let isBellMarked = false;
  if (!user || profile.id !== user.id) {
    isBellMarked = profile.bellMarker.some((v) => v.fromId === user?.id);

    profile.bellMarker = [];
    profile.bellMarked = [];
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="overflow-y-auto">
        <div className="sticky top-0  bg-black">
          <ProfileView
            profile={profile}
            isBellMarked={isBellMarked}
            isMyPage={!!user && profile.id === user.id}
            bellMarked={profile.bellMarked.map((v) => v.toId)}
            bellMarker={profile.bellMarker.map((v) => v.fromId)}
          />
        </div>
        {profile.posts
          .sort((a, b) => {
            return b.createdAt.getTime() - a.createdAt.getTime();
          })
          .map((post) => (
            <ClientLink key={post.id} href={`/${profile.username}/${post.id}`}>
              <PostView post={post} profile={profile} />
            </ClientLink>
          ))}
      </div>
    </div>
  );
}
