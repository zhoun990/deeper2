"use client";
import { type Post, type User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { type CSSProperties } from "react";
import Avatar from "./Avatar";
import formatDate from "~/utils/formatDate";

export default function PostLineView({
  post,
  profile,
  className,
  style,
}: {
  post: Post;
  profile: User;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={"mx-auto max-w-xl text-white " + (className || "")}
      style={style}
    >
      <div className="flex h-full w-full items-center rounded-lg bg-gray-800 p-2">
        <Link href={`/${profile.username}`} className="text-sm">
          @{profile.username}
        </Link>
        <div className="ml-2 w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {post.text}
          {post.text}
          {post.text}
          {post.text}
          {post.text}
          {post.text}
          {post.text}
          {post.text}
          {post.text}
          {post.text}
          {post.text}
          {post.text}
          {post.text}
          {post.text}
          {post.text}
          {post.text}
          {post.text}
          {post.text}
          {post.text}
          {post.text}
          {post.text}
        </div>
      </div>
    </div>
  );
}
const ProfileInPost: React.FC<{
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
          {profile.profilePhotoURL ? (
            <Image
              src={profile.profilePhotoURL}
              alt={profile.username}
              className="mr-4 h-10 w-10 rounded-full"
            />
          ) : (
            <div className="mr-4 h-10 w-10 rounded-full bg-gray-600"></div>
          )}
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
