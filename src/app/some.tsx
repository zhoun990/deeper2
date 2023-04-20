"use client";

import { useState } from "react";
import { useSupabase } from "./supabase-provider";

// import Image from "next/image";
// import { Inter } from "next/font/google";
// import { PrismaClient } from "@prisma/client";
// import { trpc } from "~/utils/trpc";
// import { prisma } from "~/utils/prisma";
// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // await prisma.post.findMany().then((res) => {
  //   console.log("^_^ Log \n file: page.tsx:10 \n res:", res);
  // });
  // await prisma.user.findMany().then((res) => {
  //   console.log("^_^ Log \n file: page.tsx:10 \n res:", res);
  // });
  const [content, setContent] = useState("");
  const { supabase } = useSupabase();

  const handleSave = async () => {
    const { data } = await supabase
      .from("Post")
      .insert({ authorId: 0, title: "testing supabase client" })
      .select();
    console.log("^_^ Log \n file: some.tsx:28 \n data:", data);
  };
  return (
    <>
      <input
        onChange={(e) => setContent(e.target.value)}
        value={content}
        className="bg-slate-600"
      />
      <button onClick={handleSave}>Save</button>
    </>
  );
}
