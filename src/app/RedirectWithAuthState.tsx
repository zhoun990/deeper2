"use client";

import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSupabase } from "./supabase-provider";

export const RedirectWithAuthState = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { supabase } = useSupabase();

  useEffect(() => {
    (async () => {
      const { user } = (await supabase.auth.getUser()).data;
      if (user) {
        const { data } = await supabase
          .from("User")
          .select("*")
          .eq("email", user?.email);
        if (data?.length === 0 && pathname !== "/register") {
          router.push("/register");
          console.log(
            "^_^ Log \n file: RedirectWithAuthState.tsx:26 \n push:/register"
          );
        } else if (data?.length !== 0 && pathname === "/register") {
          router.push("/");
          console.log(
            "^_^ Log \n file: RedirectWithAuthState.tsx:26 \n push:/"
          );
        }
      }
    })();
  }, [pathname]);
  return <>{children}</>;
};
