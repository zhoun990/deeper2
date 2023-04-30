"use client";
import { type User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Avatar from "~/app/_components/Avatar";
import StyledInput from "~/app/_components/StyledInput";
import StyledTextarea from "~/app/_components/StyledTextarea";
import { useSupabase } from "~/app/_components/supabase-provider";
import client from "~/utils/client";
import { compressImage } from "~/utils/compress";

export default function EditProfileForm({
  onClose,
  user,
}: {
  user: User;
  onClose(): void;
}) {
  const [name, setName] = useState(user.name || undefined);
  const [bio, setBio] = useState(user.bio || undefined);
  const [profilePhotoURL, setProfilePhotoURL] = useState(
    user.profilePhotoURL || undefined
  );
  const { supabase } = useSupabase();
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const save = () => {
    client(
      "editProfile",
      "post"
    )({ bio, name, profilePhotoURL })
      .then((res) => {
        if (res.succeeded) {
          if (res.data?.name) setName(res.data.name);
          if (res.data?.bio) setBio(res.data.bio);
          if (res.data?.profilePhotoURL)
            setProfilePhotoURL(res.data.profilePhotoURL);
        }
      })
      .then(() => {
        router.refresh();
        onClose();
      });
  };
  function downloadImage(path: string) {
    try {
      const { publicUrl } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(path).data;
      // if (error) {
      //   throw error;
      // }
      // const url = URL.createObjectURL(data);
      setProfilePhotoURL(publicUrl);
    } catch (error) {
      console.log("Error downloading image: ", error);
    }
  }
  // const onUpload = (path: string) => {
  //   downloadImage(path);
  // };
  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file?.name.split(".").pop();
      if (!file || !fileExt) throw new Error("Could not get the file.");
      const { user } = (await supabase.auth.getUser()).data;
      if (!user) throw new Error("Could not get user.");

      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(filePath, await compressImage(file), { upsert: true });

      if (uploadError) {
        throw uploadError;
      }
      console.log("^_^ Log \n file: Avatar.tsx:72 \n filePath:", filePath);

      downloadImage(filePath);
    } catch (error) {
      // alert("Error uploading avatar!");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-gray-800 px-4 py-6">
      <h1 className="mb-6 text-2xl font-semibold">プロフィール編集</h1>
      <div className="mb-4 flex">
        <input
          className="hidden w-full rounded-md bg-gray-700 p-2 text-white"
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          id="avatar-image"
        />
        <label htmlFor="avatar-image" className="ml-2 rounded-full">
          <Avatar
            user={{
              ...user,
              name: name || null,
              bio: bio || null,
              profilePhotoURL: profilePhotoURL || null,
            }}
            className="h-20 w-20"
          />
        </label>
        <div className="ml-6 grow">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-white"
          >
            表示する名前
          </label>
          <div className="mt-1 flex items-center">
            <StyledInput
              id="username"
              name="username"
              required={true}
              value={name}
              type="text"
              onChangeText={setName}
            />
          </div>
          <div className="mt-1 h-5 text-center text-red-500">
            {/* {!isUsernameAvailable && "このユーザーネームは既に利用されています"} */}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-white">
          自己紹介
        </label>
        <div className="mt-1">
          <StyledTextarea
            rows={3}
            id="bio"
            name="bio"
            placeholder="Hello"
            onChangeText={setBio}
          />
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={onClose}
        >
          キャンセル
        </button>
        <button
          className="ml-8 inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={save}
        >
          保存
        </button>
      </div>
    </div>
  );
}
