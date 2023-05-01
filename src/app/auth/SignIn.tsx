"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "../_components/supabase-provider";
import Spin from "../_styled_components/Spin";
import StyledInput from "../_styled_components/StyledInput";

export function SignIn({
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

  useEffect(() => {
    setMessage("");
  }, [email, password]);
  return (
    <div className="flex flex-col items-center">
      <div className="my-8">
        <h1 className="text-3xl font-bold">ログイン</h1>
      </div>
      <form
        className="w-full max-w-lg"
        onSubmit={(e) => {
          e.preventDefault();
          if (email && password && !processing && !message) {
            setProcessing(true);
            supabase.auth
              .signInWithPassword({ email, password })
              .then((res) => {
                if (res.error) {
                  setMessage(res.error.message);
                  setProcessing(false);
                }
                console.log("^_^ Log \n file: SignUp.tsx:32 \n res:", {
                  ...res,
                });
              })
              .catch(() => setProcessing(false));
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
              "ログイン"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
