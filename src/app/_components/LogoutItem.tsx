"use client";
import { useSupabase } from "./supabase-provider";

export default function LogoutItem() {
  const { supabase } = useSupabase();

  return (
    <button
      className="mt-1 inline-flex w-full items-center rounded-lg border border-neutral-800 px-4 py-2 text-base text-neutral-200 transition duration-500 ease-in-out hover:border-neutral-800 hover:bg-neutral-900 focus:shadow"
      onClick={() => {
        supabase.auth.signOut();
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
        ></path>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
        ></path>
      </svg>
      <span className="ml-4">ログアウト</span>
    </button>
  );
}
