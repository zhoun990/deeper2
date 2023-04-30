"use client";
import { group } from "console";
import { Transition, Dialog } from "@headlessui/react";
import { type User } from "@prisma/client";
import { Fragment, Suspense, useState } from "react";
import EditProfileForm from "./EditProfileForm";
import IconButton from "~/app/_styled_components/IconButton";
import Spin from "~/app/_styled_components/Spin";

export default function EditProfileModal({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }
  return (
    <>
      <IconButton
        onClick={() => {
          setIsOpen((c) => !c);
        }}
        className="flex-none"
      >
        プロフィール
        <br />
        を編集
      </IconButton>

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
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md overflow-hidden shadow-xl transition-all">
                  <EditProfileForm {...{ user }} onClose={closeModal} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
