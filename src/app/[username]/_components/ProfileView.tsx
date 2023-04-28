import { type GroupMember, type Group, type User } from "@prisma/client";
import { type User as AuthUser } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { Suspense } from "react";
import { BellButton } from "./BellButton";

export const ProfileView = ({
  user,
  profile,
  isMyPage,
}: {
  user: AuthUser | null;
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
            <div className="h-20 w-20 flex-none rounded-full border-2 border-gray-300 bg-gray-600 lg:h-28 lg:w-28"></div>
          )}
          <div>
            <h3 className="text-xl font-semibold lg:text-2xl">{name}</h3>
            <div className="text-gray-400">{username}</div>
            {role === "ADMIN" && <div>管理者</div>}
          </div>

          {
            // <div className="flex h-full grow justify-around bg-black p-4">
            //   <div className="flex w-1/2 flex-col items-center border-r-2 border-white">
            //     <div className="mb-2 text-lg font-bold text-white">
            //       ベル登録中
            //     </div>
            //     <div className="text-4xl font-semibold text-white">
            //       {bellMarked.length}
            //     </div>
            //   </div>
            //   <div className="flex w-1/2 flex-col items-center">
            //     <div className="mb-2 text-lg font-bold text-white">
            //       ベル登録者
            //     </div>
            //     <div className="text-4xl font-semibold text-white">
            //       {bellMarker.length}
            //     </div>
            //   </div>
            // </div>
          }

          {!!user && !isMyPage && (
            <div className="flex h-full grow justify-around bg-black p-4">
              <div className="flex w-full flex-col items-center">
                <Suspense fallback={<p>Loading feed...</p>}>
                  <BellButton profile={profile} />
                </Suspense>
              </div>
            </div>
          )}
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
