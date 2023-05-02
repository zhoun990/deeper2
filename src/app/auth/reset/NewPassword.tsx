"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import StyledInput from "../../_styled_components/StyledInput";
import { useSupabase } from "~/app/_components/supabase-provider";
import Spin from "~/app/_styled_components/Spin";

export default function NewPassword() {
  const { supabase } = useSupabase();
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [flow, setFlow] = useState(0);
  useEffect(() => {
    setMessage("");
  }, [password]);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password && !processing) {
      setProcessing(true);
      await supabase.auth
        .updateUser({
          password: password,
        })
        .then((res) => {
          if (res.error) {
            setProcessing(false);
            setMessage(res.error.message);
          } else {
            setFlow(1);
          }
        })
        .catch(() => {
          setProcessing(false);
        });
    }
  };
  if (flow === 1)
    return (
      <div className="p-2">
        <div className="mx-auto my-14 flex max-w-2xl flex-col items-center rounded-lg bg-gray-800 px-4 py-12">
          <div className="my-8">
            <h1 className="text-3xl font-bold">新しいパスワードを設定</h1>
          </div>
          <p className="mt-2 text-sm text-gray-300">
            パスワードの再設定が完了しました
          </p>
          <Link href="/" className="text-blue-500 hover:text-blue-300">
            トップに戻る
          </Link>
        </div>
      </div>
    );
  return (
    <div className="p-2">
      <div className="mx-auto my-14 flex max-w-2xl flex-col items-center rounded-lg bg-gray-800 px-4 py-12">
        <div className="my-8">
          <h1 className="text-3xl font-bold">新しいパスワードを設定</h1>
        </div>
        <form className="w-full max-w-lg" onSubmit={onSubmit}>
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
              className="my-8 flex w-full items-center justify-center rounded-xl bg-blue-600 px-10 py-4 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              style={{
                opacity: !processing && password && !message ? 1 : 0.5,
              }}
            >
              {processing ? (
                <Spin style={{ height: 24, width: 24 }} />
              ) : (
                "パスワードを変更"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
