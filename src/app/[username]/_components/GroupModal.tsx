"use client";
import { Dialog, Transition } from "@headlessui/react";
import { type Group } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Fragment, Suspense, useState, type ReactNode } from "react";
import { GroupCreate } from "./GroupCreate";
import { GroupInfo } from "./GroupInfo";
import Spin from "~/app/_components/Spin";
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
                <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white"
                  >
                    {group ? "グループタグ" : "グループタグを作成する"}
                  </Dialog.Title>
                  {group ? (
                    <Suspense fallback={<Spin />}>
                      <GroupInfo closeModal={closeModal} group={group} />
                    </Suspense>
                  ) : (
                    <GroupCreate closeModal={closeModal} />
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
