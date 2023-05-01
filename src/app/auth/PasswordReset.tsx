"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "../_components/supabase-provider";
import StyledInput from "../_styled_components/StyledInput";

export function PasswordReset({
  email,
  setEmail,
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { supabase } = useSupabase();
  const [message, setMessage] = useState("");
  useEffect(() => {
    setMessage("");
  }, [email]);
  return (
    <div className="flex flex-col items-center p-5">
      <div className="my-8">
        <h1 className="text-3xl font-bold">パスワードの再設定</h1>
      </div>
      <form
        className="w-full max-w-lg"
        onSubmit={(e) => {
          //https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail
          e.preventDefault();
          supabase.auth.resetPasswordForEmail(email).then((res) => {
            if (res.error) {
              setMessage(res.error.message);
            }
            console.log("^_^ Log \n file: SignUp.tsx:32 \n res:", { ...res });
          });
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

        <div
          className={`my-3 min-h-[40px] text-center text-sm font-semibold text-red-500 transition`}
        >
          {message}
        </div>
        <div>
          <button
            className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-10 py-4 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            style={{
              opacity: email ? 1 : 0.5,
            }}
          >
            再設定用メールを送信
          </button>
        </div>
      </form>
    </div>
  );
}
