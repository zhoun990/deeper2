"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSupabase } from "~/app/_components/supabase-provider";
import { type Profile } from "~/utils/types";

export default function Avatar({
  uid,
  url,
  size,
}: //   onUpload,
{
  uid: string;
  url: Profile["profilePhotoURL"];
  size: number;
  //   onUpload: (url: string) => void;
}) {
  const { supabase } = useSupabase();
  const [avatarUrl, setAvatarUrl] = useState<Profile["profilePhotoURL"]>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("profilePhotos")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error);
    }
  }

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
      const fileName = `${uid}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }
      console.log("^_^ Log \n file: Avatar.tsx:72 \n filePath:", filePath);

      //   onUpload(filePath);
    } catch (error) {
      alert("Error uploading avatar!");
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="Avatar"
          className="rounded-full border-2 border-white object-cover"
          style={{ height: size, width: size }}
        />
      ) : (
        <div
          className="rounded-full border-2 border-gray-300 bg-gray-600"
          style={{ height: size, width: size }}
        />
      )}
      <div style={{ width: size }}>
        <label
          className="rounded-full border-2 border-white p-2"
          htmlFor="single"
        >
          {uploading ? "Uploading ..." : "Upload"}
        </label>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
