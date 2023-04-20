import { initTRPC } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import type * as trpc from "@trpc/server";

import { z } from "zod";
import { newFunction } from "../../../server/newFunction";
import { prisma } from "~/lib/prisma";
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/dist/client/components/headers";
import { type Database } from "~/lib/database.types";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();

/**
 * Export reusable router and procedure helpers
 * that cane be used throughout the router
 */
const router = t.router;
export const publicProcedure = t.procedure;

export const getUsers = async () => {
  const p = new Promise((resolve) => {
    resolve("");
  });
  return await p.then(() => []);
};
const appRouter = router({
  userList: newFunction(),
  userById: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts;
    // Retrieve the user with the given ID
    const user = await getUsers();
    return user;
  }),
  userCreate: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts;
      // Create a new user in the database
      const user = await getUsers();
      return user;
    }),
  getUsers: publicProcedure.query(async (opts) => {
    const supabase = createRouteHandlerSupabaseClient<Database>({
      headers,
      cookies,
    });
    const { data } = await supabase.from("User").select("*");
    return ["JSON.stringify(data)"];
  }),
});
export type AppRouter = typeof appRouter;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CreateContextOptions {
  // session: Session | null
}
/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
// eslint-disable-next-line @typescript-eslint/require-await
export async function createContextInner(_opts: CreateContextOptions) {
  return {};
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  opts: trpcNext.CreateNextContextOptions
): Promise<Context> {
  // for API-response caching see https://trpc.io/docs/caching

  return await createContextInner({});
}

export default trpcNext.createNextApiHandler({
  router: appRouter,
  /**
   * @link https://trpc.io/docs/context
   */
  createContext
  /**
   * @link https://trpc.io/docs/error-handling
   */,
  onError({ error }) {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      // send to bug reporting
      console.error("Something went wrong", error);
    }
  },
  /**
   * Enable query batching
   */
  batching: {
    enabled: true,
  },
});
