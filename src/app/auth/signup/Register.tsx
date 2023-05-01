"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import StyledInput from "../../_styled_components/StyledInput";
import StyledTextarea from "../../_styled_components/StyledTextarea";
import Spin from "~/app/_styled_components/Spin";
import client from "~/utils/client";
export default function Register() {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isUsernameInvalid, setIsUsernameInvalid] = useState(false);
  const [displayname, setDisplayname] = useState("");
  const [bio, setBio] = useState("");
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      username &&
      displayname &&
      validate(username) &&
      !isUsernameInvalid &&
      !processing
    ) {
      setProcessing(true);
      await client(
        "register",
        "post"
      )({
        username,
        displayname,
        bio,
      })
        .then((res) => {
          console.log("^_^ Log \n file: register.tsx:35 \n res:", res);
          setIsUsernameAvailable(res.isUsernameAvailable);
          if (res.succeeded) {
            router.refresh();
            router.replace("/");

            // setStep(1);
          }
        })
        .finally(() => {
          setProcessing(false);
        });
    }
  };
  const validate = (str: string) => /^[A-Za-z0-9][A-Za-z0-9_]{2,29}$/.test(str);

  // switch (step) {
  //   case 0:
  return (
    <div className="p-2">
      <div className="mx-auto my-14 flex max-w-2xl flex-col items-center rounded-lg bg-gray-800 px-4 py-12">
        <div className="my-8">
          <h1 className="text-3xl font-bold">プロフィールの登録</h1>
        </div>
        <form className="w-full max-w-lg" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-white"
            >
              ユーザーネーム
            </label>
            <div className="mt-1 flex items-center">
              <div className="mr-1 block rounded-l-lg rounded-r-sm border border-transparent bg-gray-600 p-2 text-base text-white">
                @
              </div>
              <StyledInput
                id="username"
                name="username"
                required={true}
                className="rounded-l-sm rounded-r-lg"
                onChangeText={(text) => {
                  setIsUsernameInvalid(!validate(text));
                  setUsername(text);
                  setIsUsernameAvailable(true);
                }}
              />
            </div>
            <div
              className={`my-3 min-h-[40px] text-left text-sm font-semibold text-red-500 transition`}
            >
              {isUsernameInvalid
                ? "ユーザーネームは3文字以上30文字以下で、半角英数字とアンダースコアのみが利用可能です。"
                : !isUsernameAvailable &&
                  "このユーザーネームは既に利用されています。"}
            </div>
          </div>
          <div className="pb-5">
            <label
              htmlFor="displayname"
              className="block text-sm font-medium text-white"
            >
              表示する名前
            </label>
            <StyledInput
              id="displayname"
              name="displayname"
              required={true}
              onChangeText={setDisplayname}
              className="mt-1"
            />
          </div>
          <div className="pb-5">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-white"
            >
              自己紹介
            </label>
            <div className="mt-1">
              <StyledTextarea
                rows={3}
                id="bio"
                name="bio"
                onChangeText={setBio}
              />
            </div>
          </div>

          <div>
            <button
              className="my-8 flex w-full items-center justify-center rounded-xl bg-blue-600 px-10 py-4 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              style={{
                opacity:
                  username &&
                  displayname &&
                  validate(username) &&
                  !isUsernameInvalid &&
                  !processing &&
                  isUsernameAvailable
                    ? 1
                    : 0.5,
              }}
            >
              {processing ? (
                <Spin style={{ height: 24, width: 24 }} />
              ) : (
                "プロフィールを作成"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  //   default:
  //     break;
  // }
  // return <></>;
}
