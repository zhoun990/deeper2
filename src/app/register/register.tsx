"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { client } from "../api/[route]/route";
export default function Register() {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [displayname, setDisplayname] = useState("");
  const [bio, setBio] = useState("");
  const router = useRouter();
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username && displayname) {
      await client.register
        .post({
          username,
          displayname,
          bio,
        })
        .then((res) => {
          console.log("^_^ Log \n file: register.tsx:35 \n res:", res);
          setIsUsernameAvailable(res.isUsernameAvailable);
          if (res.succeeded) {
            router.push("/");
            // setStep(1);
          }
        });
    }
  };
  // switch (step) {
  //   case 0:
  return (
    // <RedirectWithAuthState>
    <div className="flex flex-col items-center p-5">
      <form className="w-full max-w-lg space-y-6" onSubmit={onSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white"
          >
            ユーザーネーム
          </label>
          <div className="mt-1 flex items-center">
            <div className="mr-1 block rounded-l-lg rounded-r-sm border border-transparent bg-gray-300 p-2 text-base text-neutral-700">
              @
            </div>
            <input
              id="username"
              name="username"
              required={true}
              className="block w-full rounded-l-sm rounded-r-lg border border-transparent bg-gray-300 px-5 py-2 text-base text-neutral-700 transition duration-500 ease-in-out placeholder:text-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
              onChange={(e) => {
                setUsername(e.target.value);
                setIsUsernameAvailable(true);
              }}
            />
          </div>
          <div className="mt-1 h-5 text-center text-red-500">
            {!isUsernameAvailable && "このユーザーネームは既に利用されています"}
          </div>
        </div>
        <div>
          <label
            htmlFor="displayname"
            className="block text-sm font-medium text-white"
          >
            表示する名前
          </label>
          <div className="mt-1">
            <input
              id="displayname"
              name="displayname"
              required={true}
              className="block w-full rounded-lg border border-transparent bg-gray-300 px-5 py-2 text-base text-neutral-700 transition duration-500 ease-in-out placeholder:text-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
              onChange={(e) => {
                setDisplayname(e.target.value);
              }}
            />
          </div>
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-white">
            自己紹介
          </label>
          <div className="mt-1">
            <textarea
              rows={3}
              id="bio"
              name="bio"
              className="block w-full rounded-lg border border-transparent bg-gray-300 px-5 py-2 text-base text-neutral-700 transition duration-500 ease-in-out placeholder:text-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
              onChange={(e) => {
                setBio(e.target.value);
              }}
            />
          </div>
        </div>

        <div>
          <button className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-10 py-4 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            プロフィールを作成
          </button>
        </div>
      </form>
    </div>
    // </RedirectWithAuthState>
  );

  //   default:
  //     break;
  // }
  // return <></>;
}
