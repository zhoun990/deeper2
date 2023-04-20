"use client";

import { useSupabase } from "../supabase-provider";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function Login() {
  const { supabase } = useSupabase();

  return (
    <div>
      <div className="flex justify-center">
        <div className="w-4/5">
          <Auth
            //https://supabase.com/docs/guides/auth/auth-helpers/auth-ui
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    // brand: 'red',
                    brandAccent: "darkred",
                  },
                },
              },
            }}
            theme="dark"
          />
        </div>
      </div>
    </div>
  );
}
