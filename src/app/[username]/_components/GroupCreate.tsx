"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import client from "~/utils/client";

export const GroupCreate = ({ closeModal }: { closeModal: () => void }) => {
  const [title, setTitle] = useState("");
  const router = useRouter();

  return (
    <>
      <div className="mt-2">
        <p className="text-sm text-white">
          グループタグを作成することで、グループタグを持つ投稿を作成することができます。
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (title.length > 1) {
            console.log("submit");
            client(
              "group",
              "post"
            )({ title }).then((res) => {
              if (res.succeeded && res.data?.id) {
                router.push(`/gt/${res.data.id}`);
              } else {
                alert("グループタグの作成に失敗しました。");
              }
              console.log(res);
            });
          }
        }}
        className="mt-8 rounded-xl border-2 bg-gray-50 p-2 transition duration-500 ease-in-out sm:flex sm:max-w-lg md:mx-auto"
      >
        <div className="min-w-0 flex-1">
          <label htmlFor="group_title" className="sr-only">
            グループタグのタイトル
          </label>
          <input
            id="group_title"
            name="group_title"
            type="text"
            className="block w-full rounded-md border border-transparent bg-transparent px-5 py-3 text-base text-neutral-600 transition duration-500 ease-in-out placeholder:text-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
            placeholder="グループタグのタイトル"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            minLength={2}
            required
          />
        </div>
        <div className="mt-4 sm:ml-3 sm:mt-0">
          <button
            className="block w-full rounded-lg border border-transparent bg-blue-600 px-5 py-3 text-base font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 sm:px-10"
            style={{
              opacity: title.length > 1 ? 1 : 0.7,
            }}
          >
            作成
          </button>
        </div>
      </form>
      <div className="mt-4">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={closeModal}
        >
          キャンセル
        </button>
      </div>
    </>
  );
};
