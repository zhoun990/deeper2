"use client";

import { useSupabase } from "./supabase-provider";

export default function Login() {
  const { supabase } = useSupabase();

  const handleSignUp = async () => {
    await supabase.auth.signUp({
      email: "zhoun990@gmail.com",
      password: "sup3rs3cur3",
    });
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithPassword({
      email: "zhoun990@gmail.com",
        password: "sup3rs3cur3",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  const getAuthState = async () => {
    console.log(
      "^_^ Log \n file: login.tsx:27 \n   await supabase.auth.getUser():",
      await supabase.auth.getUser()
    );
  };

  return (
    <div>
      <button className="m-2 border p-2" onClick={handleSignUp}>
        Sign Up
      </button>
      <button className="m-2 border p-2" onClick={handleLogin}>
        Login
      </button>
      <button className="m-2 border p-2" onClick={handleLogout}>
        Logout
      </button>
      <button className="m-2 border p-2" onClick={getAuthState}>
        getAuthState
      </button>
    </div>
  );
}
