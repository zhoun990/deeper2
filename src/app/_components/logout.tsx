"use client";

import { useSupabase } from "./supabase-provider";

// import { Inter } from "next/font/google";
// import { PrismaClient } from "@prisma/client";
// import { trpc } from "~/utils/trpc";
// import { prisma } from "~/utils/prisma";
// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { supabase } = useSupabase();

  return (
    <button
      onClick={() => {
        supabase.auth.signOut();
      }}
      className="rounded border p-2"
    >
      Logout
    </button>
  );
}
