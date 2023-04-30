import { type GroupMember, type User } from "@prisma/client";
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import Avatar from "~/app/_styled_components/Avatar";
import { type Database } from "~/lib/database.types";
import { prisma } from "~/lib/prisma";

export default async function Page({
  params,
}: {
  params: { groupTagId: string };
}) {
  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  });
  const { user } = (await supabase.auth.getUser()).data;

  const group = await prisma.group.findFirst({
    where: {
      id: Number(params.groupTagId),
      OR: [
        { isPublic: true },
        { members: { some: { member: { id: user?.id } } } },
      ],
    },
    include: { members: { include: { member: true } } },
  });
  return (
    <div className="mx-auto max-w-xl">
      <div className="sticky top-0 rounded-md bg-black p-4 text-white shadow-lg">
        <h1 className="mb-2 text-2xl font-bold">{group?.title}</h1>
        <p className="mb-4">{group?.description}</p>
        <div className="text-gray-400">
          <p>ID: {group?.id}</p>
          <p>作成日: {group?.createdAt.toLocaleString()}</p>
          <p>更新日: {group?.updatedAt.toLocaleString()}</p>
        </div>
      </div>
      <div>
        {group?.members.map((user) => (
          <div key={user.memberId} className="m-4">
            <UserItem user={user} />
          </div>
        ))}
      </div>
    </div>
  );
}
const UserItem: React.FC<{
  user: GroupMember & {
    member: User;
  };
}> = ({ user }) => (
  <Link href={`/${user.member.username}`}>
    <div className="flex w-full items-center rounded-lg bg-gray-900 p-4 shadow-md">
      <div>
        {" "}
        <Avatar
          user={user.member}
          className="h-12 w-12 border-2 border-indigo-500"
        />
      </div>
      <div className="ml-4 text-left">
        <p className="text-lg font-semibold text-white">
          {user.member.username}
        </p>
        <p className="text-sm text-gray-400">{user.member.name}</p>
      </div>
    </div>
  </Link>
);
