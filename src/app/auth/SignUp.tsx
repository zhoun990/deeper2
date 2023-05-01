"use client";
import { useEffect, useState } from "react";
import { useSupabase } from "../_components/supabase-provider";
import Spin from "../_styled_components/Spin";
import StyledInput from "../_styled_components/StyledInput";

export function SignUp({
  email,
  setEmail,
  password,
  setPassword,
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { supabase } = useSupabase();
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [flow, setFlow] = useState(0);
  useEffect(() => {
    setMessage("");
  }, [email, password]);
  if (flow === 1)
    return (
      <div className="my-14 flex flex-col items-center">
        <h1 className="text-3xl font-bold">確認メールを送信しました</h1>
        <p className="mt-12 text-sm text-gray-300">
          ご登録いただいたメールアドレスに確認メールを送信しました。
        </p>
        <p className="mt-2 text-sm text-gray-300">
          メールに記載されたリンクをクリックして、登録を完了してください。
        </p>
      </div>
    );
  return (
    <div className="flex flex-col items-center">
      <div className="my-8">
        <h1 className="text-3xl font-bold">サインアップ</h1>
      </div>
      <form
        className="w-full max-w-lg"
        onSubmit={(e) => {
          e.preventDefault();
          if (email && password && !processing && !message) {
            setProcessing(true);
            supabase.auth
              .signUp({ email, password })
              .then((res) => {
                if (res.error) {
                  setMessage(res.error.message);
                } else if (res.data.user?.identities?.length) {
                  setFlow(1);
                } else {
                  setMessage("このメールアドレスは既に使用されています。");
                }
                console.log("^_^ Log \n file: SignUp.tsx:32 \n res:", {
                  ...res,
                });
              })
              .finally(() => setProcessing(false));
          }
        }}
      >
        <div className="pb-5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white"
          >
            メールアドレス
          </label>
          <StyledInput
            id="email"
            name="email"
            type="email"
            required={true}
            value={email}
            onChangeText={setEmail}
            className="mt-1"
          />
        </div>
        <div className="pb-5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-white"
          >
            パスワード
          </label>
          <StyledInput
            id="password"
            name="password"
            type="password"
            required={true}
            value={password}
            onChangeText={setPassword}
            className="mt-1"
          />
        </div>
        <div
          className={`my-3 min-h-[40px] text-center text-sm font-semibold text-red-500 transition`}
        >
          {message}
        </div>
        <div>
          <button
            className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-10 py-4 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            style={{
              opacity: email && password && !processing && !message ? 1 : 0.5,
            }}
          >
            {processing ? (
              <Spin style={{ height: 24, width: 24 }} />
            ) : (
              "サインアップ"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
