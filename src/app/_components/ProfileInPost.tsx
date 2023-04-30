"use client";
import { type User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import Avatar from "./Avatar";

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
        className="flex items-center"
      >
        <Link href={`/${profile.username}`}>
          <Avatar user={profile} className="mr-4 h-10 w-10" />
        </Link>
        <div>
          <Link href={`/${profile.username}`}>
            <span className="font-bold">{profile.name}</span>
          </Link>
          <Link href={`/${profile.username}`}>
            <p className="text-xs">@{profile.username}</p>
          </Link>
        </div>
      </div>
    </div>
    // </ClientLink>
  );
};
