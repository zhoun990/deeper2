import { Post, type User } from "@prisma/client";
import Image from "next/image";
import Avatar from "./Avatar";
import PostView from "~/app/_components/PostView";
import { type Profile } from "~/utils/types";

export const ProfileView = ({
  profile,
  isMyPage,
}: {
  profile: User;
  isMyPage: boolean;
}) => {
  const {
    bio,
    createdAt,
    id,
    name,
    profilePhotoURL,
    role,
    updatedAt,
    username,
  } = profile;

  return (
    <div className="text-white">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="flex items-center space-x-6">
          {/* <Avatar
            uid={id}
            url={profilePhotoURL}
            size={150}
            // onUpload={(url) => {
            //   console.log("^_^ Log \n file: ProfileView.tsx:82 \n url:", url);
            //   // setAvatarUrl(url);
            //   // updateProfile({ username, website, avatar_url: url });
            // }}
          /> */}
          {profilePhotoURL ? (
            <Image
              src={profilePhotoURL}
              className="h-28 w-28 rounded-full border-2 border-white object-cover"
              alt="プロフィール画像"
            />
          ) : (
            <div className="h-28 w-28 rounded-full border-2 border-gray-300 bg-gray-600"></div>
          )}
          <div>
            <h3 className="text-2xl font-semibold">{name}</h3>
            <div className="text-gray-400">{username}</div>
            {role === "ADMIN" && <div> 管理者</div>}
          </div>
          <div className="h-full grow border">bell</div>
        </div>
        <div className="mt-6">
          {/* <div className="mb-2 font-semibold">自己紹介:</div> */}
          <div className="text-gray-200">
            {bio || "自己紹介文がありません。"}
          </div>
          <div className="mt-6">
            <div>登録日: {new Date(createdAt).toLocaleDateString()}</div>
            <div>最終更新日: {new Date(updatedAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
