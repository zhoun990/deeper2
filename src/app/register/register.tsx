"use client";

import { useSupabase } from "../supabase-provider";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useState, type FormEvent, useEffect } from "react";
import type { Res, Req } from "../../pages/api/test";
const fetcher = async <T, U>(
  input: RequestInfo | URL,
  method?: "POST" | "GET",
  body?: T,
  others?: RequestInit | undefined
): Promise<U> =>
  await fetch(input, {
    ...others,
    method: method,
    body: JSON.stringify(body),
  }).then(async (res) => (await res.json()) as U);
export default function Register() {
  const { supabase } = useSupabase();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  console.log("^_^ Log \n file: register.tsx:23 \n username:", username);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [displayname, setDisplayname] = useState("");
  const [bio, setBio] = useState("");
  useEffect(() => {
    console.log("api call");

    fetcher(
      "/api/sample",
      "POST",
      {
        title: "abccd",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      console.log("^_^ Log \n file: register.tsx:37 \n res:", res);
    });
  }, []);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = await supabase.from("User").select();
    console.log("^_^ Log \n file: register.tsx:19 \n data:", data);
    // await fetcher<Req, Res>("/api/regster", "POST", {
    //   username,
    //   displayname,
    //   bio,
    // }).then((res) => {
    //   console.log("^_^ Log \n file: register.tsx:35 \n res:", res);
    //   setIsUsernameAvailable(res.isUsernameAvailable);
    //   if (!res.succeeded) {
    //     alert("失敗しました。");
    //   } else {
    //     setStep(1);
    //   }
    // });
    await fetch("/api/test", {
      method: "POST",
      body: JSON.stringify({
        username,
        displayname,
        bio,
      }),
    }).then((res) => {
      console.log("^_^ Log \n file: register.tsx:52 \n res:", res);
    });
    // .eq("email", user?.email);
    // setStep(1);
  };
  switch (step) {
    case 0:
      return (
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
                <div className="mr-1 block transform rounded-l-lg rounded-r-sm border border-transparent bg-gray-300 px-2 py-2 text-base text-neutral-700">
                  @
                </div>
                <input
                  id="username"
                  name="username"
                  required={true}
                  className="block w-full transform rounded-l-sm rounded-r-lg border border-transparent bg-gray-300 px-5 py-2 text-base text-neutral-700 placeholder-gray-300 transition duration-500 ease-in-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
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
                  className="block w-full transform rounded-lg border border-transparent bg-gray-300 px-5 py-2 text-base text-neutral-700 placeholder-gray-300 transition duration-500 ease-in-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                  onChange={(e) => {
                    setDisplayname(e.target.value);
                  }}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-white"
              >
                自己紹介
              </label>
              <div className="mt-1">
                <textarea
                  rows={3}
                  id="bio"
                  name="bio"
                  required={true}
                  className="block w-full transform rounded-lg border border-transparent bg-gray-300 px-5 py-2 text-base text-neutral-700 placeholder-gray-300 transition duration-500 ease-in-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                  onChange={(e) => {
                    setBio(e.target.value);
                  }}
                />
              </div>
            </div>

            <div>
              <button className="flex w-full transform items-center justify-center rounded-xl bg-blue-600 px-10 py-4 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                プロフィールを作成
              </button>
            </div>
          </form>
        </div>
      );

    default:
      break;
  }
  return <></>;
}
