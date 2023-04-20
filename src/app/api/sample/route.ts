import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { type Database } from "~/lib/database.types";
export const revalidate = 0
export async function POST(req: NextRequest) {
  console.log("api called");
  const supabase = createRouteHandlerSupabaseClient({
    headers,
    cookies,
  })
  // const [user, setUser] = useState<User | null>(null);
  // useEffect(() => {
  const user = await supabase.auth.getUser().then((res) => res.data.user);
  console.log("^_^ Log \n file: route.ts:17 \n user:", user);

  return NextResponse.json({ data: "sample data" });
}
