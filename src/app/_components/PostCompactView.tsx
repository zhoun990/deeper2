"use client";
import { type Post, type User } from "@prisma/client";
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
      className={
        "flex h-full w-full rounded-lg bg-gray-800 px-4 py-2 " +
        (className || "")
      }
      style={style}
    >
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

        <div className="my-2 whitespace-pre-wrap break-words text-white">{post.text}</div>
      </div>
    </div>
  );
}
