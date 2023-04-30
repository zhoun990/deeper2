import { type GroupMember, type Group } from "@prisma/client";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/dist/client/components/headers";
import Link from "next/link";
import ClientLink from "../_components/ClientLink";
import PostView from "../_post_components/PostView";
import { GroupModal } from "./_components/GroupModal";
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
  const profile = await prisma.user.findUnique({
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
      groups: {
        include: { group: true, member: { select: { username: true } } },
        where: {
          OR: [
            {
              AND: [
                { group: { isPrimary: true } },
                { permission: { has: "Owner" } },
              ],
            },
            {
              AND: [
                { group: { isPrimary: false } },
                { OR: [{ member: { id: user?.id } }, { hidden: false }] },
              ],
            },
          ],
        },
      },
    },
  });
  if (!profile) {
    return <UserPageNotFound />;
  }
  const { groups } = profile;
  // if (profile.id !== user?.id) {
  //   profile.groups = profile.groups.filter((member) => !member.hidden);
  // }
  return (
    <div className="mx-auto flex max-w-2xl flex-col">
        <div className="sticky top-0  bg-black">
          <ProfileView
            user={user}
            profile={profile}
            isMyPage={!!user && profile.id === user.id}
          />
          <div className="mx-auto flex max-w-2xl flex-wrap p-2 px-4 text-gray-200">
            {groups.map((member) => (
              <GroupModal
                group={member.group}
                key={member.group.id}
                disabled={!user}
              >
                <div className="m-1 cursor-pointer select-none rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 px-3 py-2 text-white">
                  {member.group.isPrimary
                    ? `#@${member.member.username}#`
                    : `#${member.group.title}#`}
                </div>
              </GroupModal>
            ))}
            {profile.id === user?.id && (
              <GroupModal>
                <div className="m-1 cursor-pointer select-none rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 px-3 py-2 text-white">
                  ✚
                </div>
              </GroupModal>
            )}
          </div>
        </div>
        {profile.posts
          .sort((a, b) => {
            return b.createdAt.getTime() - a.createdAt.getTime();
          })
          .map((post) => (
            <div key={post.id} className="m-4">
              <ClientLink href={`/${profile.username}/${post.id}`}>
                <PostView post={post} profile={profile} />
              </ClientLink>
            </div>
          ))}
    </div>
  );
}
const GroupView = ({
  groups,
}: {
  groups: (GroupMember & {
    group: Group;
    member: {
      username: string;
    };
  })[];
}) => {
  return (
    <div className="mx-auto flex max-w-2xl flex-wrap p-2 px-4 text-gray-200">
      {groups.map((member) => (
        <GroupModal group={member.group} key={member.group.id}>
          <div className="m-1 cursor-pointer select-none rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 px-3 py-2 text-white">
            {member.group.isPrimary
              ? `#@${member.member.username}#`
              : `#${member.group.title}#`}
          </div>
        </GroupModal>
      ))}
      <GroupModal>
        <div className="m-1 cursor-pointer select-none rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 px-3 py-2 text-white">
          ✚
        </div>
      </GroupModal>
    </div>
  );
};
