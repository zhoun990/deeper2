import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "./lib/database.types";
// export const runtime = 'edge'; // 'nodejs' is the default
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient<Database>({ req, res });
  await supabase.auth.getSession();
  console.log("^_^ Log \n file: _middleware.ts:13 \n res:", res);

  return res;
}
// export const config = {
//   matcher: '/about/:path*',
// }
