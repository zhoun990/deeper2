"use client";
import { Dialog, Transition } from "@headlessui/react";
import { type GroupMember, type Group } from "@prisma/client";
import { User } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, type ReactNode, Fragment, useEffect, Suspense } from "react";
import { GroupInfo } from "./GroupInfo";
import Spin from "~/app/_components/Spin";
import { useSupabase } from "~/app/_components/supabase-provider";
import client from "~/utils/client";
export function GroupModal({
  children,
  group,
  disabled,
}: {
  children: ReactNode;
  group?: Group;
  disabled?: boolean;
}) {
  console.log("^_^ Log \n file: GroupModal.tsx:18 \n disabled:", disabled);
  const { supabase } = useSupabase();

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const router = useRouter();
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        onClick={() => {
          if (!disabled) {
            setIsOpen((c) => !c);
          }
        }}
      >
        {children}
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {group ? "グループタグ" : "グループタグを作成する"}
                  </Dialog.Title>
                  {group ? (
                    <Suspense fallback={<Spin />}>
                      <GroupInfo closeModal={closeModal} group={group} />
                    </Suspense>
                  ) : (
                    <CreateGroup closeModal={closeModal} />
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
const CreateGroup = ({ closeModal }: { closeModal: () => void }) => {
  const [title, setTitle] = useState("");
  const router = useRouter();

  return (
    <>
      <div className="mt-2">
        <p className="text-sm text-gray-500">
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
