"use client";
import { type Post, type User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { type CSSProperties } from "react";

const PostView: React.FC<{
  post: Post;
  profile: User;
  className?: string;
  style?: CSSProperties;
}> = ({ post, profile, className, style }) => {
  const formatDate = (newDate: Date) => {
    // const newDate = new Date(date);
    return `${newDate.getFullYear()}/${
      newDate.getMonth() + 1
    }/${newDate.getDate()} ${newDate.getHours()}:${newDate.getMinutes()}`;
  };

  return (
    <div
      className={"mx-auto max-w-xl p-4 text-white " + (className || "")}
      style={style}
    >
      <div className="h-full w-full rounded-lg bg-gray-800 p-4">
        <ProfileInPost profile={profile} />
        <div className="mb-2 whitespace-pre-wrap">{post.text}</div>
        <div className="text-xs text-gray-400">
          {formatDate(post.createdAt)}
        </div>
      </div>
    </div>
  );
};
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
export default PostView;
