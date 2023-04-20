import Image from "next/image";
import { Inter } from "next/font/google";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/dist/client/components/headers";
import { type Database } from "~/lib/database.types";
import Login from "./login";
import { RedirectWithAuthState } from "../RedirectWithAuthState";
import Register from "./register";
const inter = Inter({ subsets: ["latin"] });
export const revalidate = 0;
export default async function Home() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
  // const [user, setUser] = useState<User | null>(null);
  // useEffect(() => {
  const user = await supabase.auth.getUser().then((res) => res.data.user);
  // await fetch("http://localhost:3000/api/posts", {
  //   body: JSON.stringify({
  //     title: "abccd",
  //   }),
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   method: "POST",
  //   cache: "no-store",
  // })
  //   .then(async (res) => {
  //     console.log("^_^ Log \n file: register.tsx:37 \n res:", res);
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //     return await res.json();
  //   })
  //   .then((res) => {
  //     console.log("^_^ Log \n file: page.tsx:32 \n res:", res);
  //   })
  //   .catch((err) => {
  //     console.log("^_^ Log \n file: page.tsx:30 \n err:", err);
  //   });
  // }, []);
  // const { data } = await supabase.from("Post").select("*");
  // console.log("^_^ Log \n file: page.tsx:26 \n data:", data);
  // const { data: auth } = await supabase.auth.getUser();
  // if (auth) {
  //   const data = await supabase
  //     .from("User")
  //     .select("*")
  //     .eq("email", auth.user?.email);
  //   console.log("^_^ Log \n file: page.tsx:23 \n  data.count:", data.count);
  //   return <div>{data.count}</div>;
  // }
  return (
    <RedirectWithAuthState>
      {user ? <Register /> : <Login />}
    </RedirectWithAuthState>
  );
}
