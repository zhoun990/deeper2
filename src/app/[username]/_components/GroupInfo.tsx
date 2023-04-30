"use client";
import { type Group } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import client from "~/utils/client";

const _isMember: Record<number, number> = {};
export const GroupInfo = ({
  closeModal,
  group,
}: {
  closeModal: () => void;
  group: Group;
}) => {
  const router = useRouter();
  if (!_isMember[group.id])
    throw client("groupMember", "get")(null, { groupId: group.id })
      .then((res) => {
        if (res.succeeded && res.isGroupMember) {
          _isMember[group.id] = 2;
          console.log(
            "^_^ Log \n file: GroupModal.tsx:106 \n isMember:",
            _isMember
          );
        }
      })
      .finally(() => {
        if (!_isMember[group.id]) _isMember[group.id] = 1;
      });
  const [isMember, setIsMember] = useState(_isMember[group.id] === 2);

  if (isMember)
    return (
      <>
        <div className="mt-2">
          <p className="text-sm text-white">
            あなたは#{group.title}#のメンバーです。
          </p>
        </div>
        <div className="flex">
          <Link
            href={`/gt/${group.id}`}
            className="mr-3 mt-3 flex w-full items-center justify-center rounded-lg border border-transparent bg-blue-600 px-5 py-3 text-base font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2  focus:ring-offset-gray-300 sm:px-10"
          >
            グループタグの詳細
          </Link>
          <button
            type="button"
            className="mr-3 mt-3 flex-none justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={() => {
              client("group", "delete")(null, { groupId: group.id }).then(
                (res) => {
                  if (res.succeeded) {
                    setIsMember(false);
                    _isMember[group.id] = 1;
                  } else {
                    alert("グループタグの削除に失敗しました。");
                  }
                  console.log(res);
                }
              );
            }}
          >
            削除
          </button>
          <button
            type="button"
            className="mt-3 flex-none justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={closeModal}
          >
            キャンセル
          </button>
        </div>
      </>
    );
  return (
    <>
      <div className="mt-2">
        <p className="text-sm text-gray-500">
          {group.allowJoin
            ? "プロフィールにグループタグを追加することで、グループタグを持つ投稿を作成することができます。"
            : "リクエストを送信し承認されると、プロフィールにグループタグを追加することができます。"}
        </p>
      </div>
      <div className="flex">
        <button
          className="mr-3 mt-3 block w-full rounded-lg border border-transparent bg-blue-600 px-5 py-3 text-base font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 sm:px-10"
          onClick={() => {
            console.log("submit");
            client(
              "group",
              "post"
            )({ id: group.id }).then((res) => {
              if (res.succeeded && res.data?.id) {
                // router.push(`/gt/${res.data.id}`);
                alert("グループタグを追加しました。");
                setIsMember(true);
                _isMember[res.data.id] = 2;
              } else {
                alert("グループタグの追加に失敗しました。");
              }
              console.log(res);
            });
          }}
        >
          {group.allowJoin ? "追加" : "リクエスト"}
        </button>
        <button
          type="button"
          className="mt-3 flex-none justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={closeModal}
        >
          キャンセル
        </button>
      </div>
    </>
  );
};
