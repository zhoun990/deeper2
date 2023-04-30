"use client";
import { type User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import Avatar from "../_styled_components/Avatar";

export const ProfileInPost: React.FC<{
  profile: User;
}> = ({ profile }) => {
  return (
    // <ClientLink href={`/${profile.username}`}>
    <div className="mb-4 flex">
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="flex items-center overflow-hidden"
      >
        <Link href={`/${profile.username}`} className="flex-none">
          <Avatar user={profile} className="mr-4 h-10 w-10" />
        </Link>
        <div className="overflow-hidden">
          <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap font-bold">
            <Link href={`/${profile.username}`}>{profile.name}</Link>
          </div>
          <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs">
            <Link href={`/${profile.username}`}>@{profile.username}</Link>
          </div>
        </div>
      </div>
    </div>
    // </ClientLink>
  );
};
