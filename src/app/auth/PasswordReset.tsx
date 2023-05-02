"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "../_components/supabase-provider";
import Spin from "../_styled_components/Spin";
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
  const [processing, setProcessing] = useState(false);
  const [flow, setFlow] = useState(0);

  useEffect(() => {
    setMessage("");
  }, [email]);
  if (flow === 1)
    return (
      <div className="my-14 flex flex-col items-center">
        <h1 className="text-3xl font-bold">
          パスワードの再設定メールを送信しました
        </h1>
        <p className="mt-12 text-sm text-gray-300">
          ご登録いただいたメールアドレスにパスワードの再設定メールを送信しました。
        </p>
        <p className="mt-2 text-sm text-gray-300">
          メールに記載されたリンクをクリックして、パスワードの再設定を完了してください。
        </p>
      </div>
    );
  return (
    <div className="flex flex-col items-center p-5">
      <div className="my-8">
        <h1 className="text-3xl font-bold">パスワードの再設定</h1>
      </div>
      <form
        className="w-full max-w-lg"
        onSubmit={(e) => {
          //[ToDo] https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail
          e.preventDefault();
          if (email && !processing) {
            setProcessing(true);
            supabase.auth
              .resetPasswordForEmail(email)

              .then((res) => {
                if (res.error) {
                  setMessage(res.error.message);
                  setProcessing(false);
                } else {
                  setFlow(1);
                }
              });
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

        <div
          className={`my-3 min-h-[40px] text-center text-sm font-semibold text-red-500 transition`}
        >
          {message}
        </div>
        <div>
          <button
            className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-10 py-4 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            style={{
              opacity: email && !processing ? 1 : 0.5,
            }}
          >
            {processing ? (
              <Spin style={{ height: 24, width: 24 }} />
            ) : (
              "再設定用メールを送信"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
