"use client";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useEffect, FC } from "react";
import { useSupabase } from "./supabase-provider";
import client from "~/utils/client";
import { type Profile } from "~/utils/types";

export default function PostCreateForm({ users }: { users: Profile[] }) {
  const { supabase } = useSupabase();

  const [text, setText] = useState("");
  const [isPublic, setIsPublic] = useState(0);
  const [permittedUsers, setPermittedUsers] = useState<
    { uid: string; level: number }[]
  >([]);

  const router = useRouter();
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await client(
      "post",
      "post"
    )({ text, permittedUsers, public: isPublic });
    if (res.succeeded) {
      setText("");
      alert("投稿しました");
    } else {
      alert("失敗しました");
    }
  };

  return (
    <form className="w-full max-w-lg space-y-6" onSubmit={onSubmit}>
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-white">
          {"What's happening?"}
        </label>
        <div className="mt-1">
          <textarea
            value={text}
            rows={5}
            id="bio"
            name="bio"
            className="block w-full resize-none rounded-lg border border-transparent bg-gray-300 px-5 py-2 text-base text-neutral-700 transition duration-500 ease-in-out placeholder:text-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex flex-wrap bg-black">
        <div
          className="m-1 cursor-pointer select-none rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 px-3 py-2 text-white"
          style={{
            borderWidth: 2,
            borderColor: isPublic ? "white" : "transparent",
          }}
          onClick={() => {
            setIsPublic((c) => (c === 0 ? 1 : 0));
          }}
        >
          {isPublic ? "パブリック" : "プライベート"}
        </div>
        {users.map((user) => (
          <div
            key={user.id}
            className="m-1 cursor-pointer select-none rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 px-3 py-2 text-white"
            style={{
              borderWidth: 2,
              borderColor: permittedUsers.some((v) => v.uid === user.id)
                ? "white"
                : "transparent",
            }}
            onClick={() => {
              setPermittedUsers((c) => {
                const filtered = c.filter((v) => v.uid !== user.id);
                if (filtered.length === c.length) {
                  return c.concat({ uid: user.id, level: 1 });
                }
                return filtered;
              });
            }}
          >
            @{user.username}
          </div>
        ))}
      </div>
      <div>
        <button className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-10 py-4 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          投稿
        </button>
      </div>
    </form>
  );
}
