"use client";
import { type Post, type User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { type CSSProperties } from "react";
import Avatar from "./Avatar";
import formatDate from "~/utils/formatDate";

export default function PostCompactView({
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
      <div className="flex h-full w-full rounded-lg bg-gray-800 px-4 py-2">
        <div className="mb-1 flex">
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="mr-4 flex items-center"
          >
            <Link href={`/${profile.username}`}>
              <Avatar user={profile} className="mr-2 h-8 w-8 rounded-full" />
            </Link>
          </div>
        </div>
        <div className="mb-1 flex grow flex-col overflow-hidden">
          <div className="flex">
            <div className="text-xs">
              <Link href={`/${profile.username}`}>
                <span className="font-bold">{profile.name}</span>
                <span> @{profile.username}</span>
              </Link>
            </div>
            <div className="ml-auto text-xs text-gray-400">
              {formatDate(post.createdAt)}
            </div>
          </div>

          <div className="mb-2 whitespace-pre-wrap break-words">
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
