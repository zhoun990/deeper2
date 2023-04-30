"use client";
import { type User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import PostCreateInput from "./PostCreateInput";
import client from "~/utils/client";

export default function PostCreateForm({ users = [] }: { users?: User[] }) {
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
    if (res.succeeded && res.data) {
      setText("");
      router.push(`/${res.data.author.username}/${res.data.id}`);
    } else {
      console.log("^_^ Log \n file: PostCreateForm.tsx:21 \n res:", res);

      alert("失敗しました");
    }
  };

  return (
    <form
      className="mx-auto max-w-2xl rounded-lg bg-gray-800 px-4 py-6"
      onSubmit={onSubmit}
    >
      <label htmlFor="bio" className="mb-3 block text-xl font-bold text-white">
        投稿を作成
      </label>
      <PostCreateInput
        text={text}
        setText={setText}
        // title="What's happening?"
      />
      <div className="my-4 flex flex-wrap">
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
          <button
            type="button"
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
          </button>
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
