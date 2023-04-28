import { type User } from "@prisma/client";
import Image from "next/image";
import { type CSSProperties } from "react";

export default function Avatar({
  user,
  className,
  style,
}: {
  user: User;
  className?: string;
  style?: CSSProperties;
}) {
  if (!user.profilePhotoURL) {
    return (
      <div
        className={
          "inline-flex min-h-[1.8rem] min-w-[1.8rem] items-center justify-center overflow-hidden rounded-full bg-indigo-200 text-xl text-gray-800 " +
          (className || "")
        }
        style={style}
      >
        {user.name?.[0]}
      </div>
    );
  }
  return (
    <Image
      src={user.profilePhotoURL}
      alt="プロフィール写真"
      className={
        "min-h-[1.8rem] min-w-[1.8rem] rounded-full border-2 border-indigo-500 object-cover " +
        (className || "")
      }
      style={style}
    />
  );
}
