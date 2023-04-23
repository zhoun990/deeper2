"use client";
import { type User } from "@prisma/client";
import { useSupabase } from "~/app/_components/supabase-provider";
import client from "~/utils/client";
// let isBellMarked = -1;
export const BellButton = ({
  isBellMarked,
  profile,
}: {
  isBellMarked: boolean;
  profile: User;
  }) => {
  //べるを動的に取得
  // if (isBellMarked === -1) {
  //   throw
  // }
  return (
    <button
      className={`rounded-xl bg-gray-800 px-5 py-4 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 lg:px-10 ${
        isBellMarked ? "text-red-500" : "text-white"
      }`}
      onClick={() => {
        client(
          "bell",
          isBellMarked ? "delete" : "put"
        )({ uid: profile.id, notification: 1 }).then((res) => {
          console.log("^_^ Log \n file: BellButton.tsx:22 \n res:", res);
        });
      }}
    >
      {isBellMarked ? "ベル解除" : "ベル登録"}
    </button>
  );
};
