"use client";
import { type Post, type User } from "@prisma/client";
import Link from "next/link";
import { type CSSProperties } from "react";

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
      className={
        "flex h-full w-full items-center rounded-lg bg-gray-800 p-2 " +
        (className || "")
      }
      style={style}
    >
      <Link href={`/${profile.username}`} className="text-sm text-blue-500">
        @{profile.username}
      </Link>
      <div className="ml-2 w-full overflow-hidden text-ellipsis whitespace-nowrap text-white">
        {post.text}
      </div>
    </div>
  );
}
