"use client";
import { useState } from "react";
import { useSupabase } from "../_components/supabase-provider";
import { PasswordReset } from "./PasswordReset";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";

export function AuthSwitcher({
  type: defaultType,
}: {
  type?: "signin" | "signup" | "reset";
}) {
  const [type, setType] = useState(defaultType || "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="p-2">
      <div className="mx-auto my-14 max-w-2xl rounded-lg bg-gray-800 px-4 py-12">
        {type === "signin" ? (
          <SignIn
            {...{
              email,
              setEmail,
              password,
              setPassword,
            }}
          />
        ) : type === "signup" ? (
          <SignUp
            {...{
              email,
              setEmail,
              password,
              setPassword,
            }}
          />
        ) : (
          <PasswordReset
            {...{
              email,
              setEmail,
            }}
          />
        )}
        <div className="flex flex-col items-center p-5">
          <a
            className="text-blue-400 underline hover:text-blue-500"
            onClick={() => {
              setType(type === "signin" ? "signup" : "signin");
            }}
          >
            {type === "signin"
              ? "アカウントをお持ちでない方はこちら"
              : "既にアカウントをお持ちの方はこちら"}
          </a>
        </div>
        {type === "signin" && (
          <div className="flex flex-col items-center">
            <a
              className="text-blue-400 underline hover:text-blue-500"
              onClick={() => {
                setType("reset");
              }}
            >
              パスワードをお忘れの方はこちら
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
