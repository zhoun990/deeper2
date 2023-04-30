"use client";
import { type Post, type User } from "@prisma/client";
import { type CSSProperties } from "react";
import { ProfileInPost } from "./ProfileInPost";
import formatDate from "~/utils/formatDate";

const PostView: React.FC<{
  post: Post;
  profile: User;
  className?: string;
  style?: CSSProperties;
}> = ({ post, profile, className, style }) => {
  return (
    <div
      className={
        "h-full w-full rounded-lg bg-gray-800 p-4 " + (className || "")
      }
      style={style}
    >
      <ProfileInPost profile={profile} />
      <div className="mx-1 my-4 whitespace-pre-wrap text-lg text-white">
        {post.text}
      </div>
      <div className="text-xs text-gray-400">{formatDate(post.createdAt)}</div>
    </div>
  );
};
export default PostView;
