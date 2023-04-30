"use client";
import { type Post, type User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useEffect, FC } from "react";
import PostCreateInput from "~/app/_components/PostCreateInput";
import { ProfileInPost } from "~/app/_components/ProfileInPost";
import Switch from "~/app/_components/Switch";
import client from "~/utils/client";

export default function ReplyCreateForm({
  users = [],
  post,
  user,
}: {
  users?: User[];
  post: Post;
  user: User;
}) {
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
    )({ text, permittedUsers, public: isPublic, replyId: post.id });
    if (res.succeeded && res.data) {
      setText("");
      router.push(`/${res.data.author.username}/${res.data.id}`);
    } else {
      alert("失敗しました");
    }
  };
  return (
    <>
      <div className="flex h-6">
        <div className="flex w-[10%] flex-col">
          <div className="flex grow">
            <div className="grow"></div>
            <div className="grow border-l-4"></div>
          </div>
        </div>
      </div>
      <form
        className="w-full rounded-lg bg-gray-800 px-4 py-6"
        onSubmit={onSubmit}
      >
        <label
          htmlFor="bio"
          className="mb-3 block text-lg font-bold text-white"
        >
          返信を作成
        </label>
        <ProfileInPost profile={user} />
        <PostCreateInput text={text} setText={setText} title="" />
        <div className="flex flex-wrap">
          {/* <div
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
        </div> */}
          <Switch
            className="my-7"
            checked={isPublic === 1}
            onChange={() => {
              setIsPublic((c) => (c === 0 ? 1 : 0));
            }}
            text="返信先を閲覧可能なユーザーに公開する" //(返信先がパブリックの場合のみ)
          />
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
    </>
  );
}
