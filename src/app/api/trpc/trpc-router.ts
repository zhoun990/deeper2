import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import { type Database } from "~/lib/database.types";
import { newFunction } from "~/server/newFunction";
import { headers, cookies } from "next/dist/client/components/headers";

const t = initTRPC.create({
  transformer: superjson,
});
export const getUsers = async () => {
  const p = new Promise((resolve) => {
    resolve("");
  });
  return await p.then(() => []);
};
export const appRouter = t.router({
  // getUsers: t.procedure.query(({ ctx }) => {
  //   return userList;
  // }),
  userList: newFunction(),
  userById: t.procedure.input(z.string()).query(async (opts) => {
    const { input } = opts;
    // Retrieve the user with the given ID
    const user = await getUsers();
    return user;
  }),
  userCreate: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts;
      // Create a new user in the database
      const user = await getUsers();
      return user;
    }),
  getUsers: t.procedure.query(async (opts) => {
    const supabase = createRouteHandlerSupabaseClient<Database>({
      headers,
      cookies,
    });
    const { data } = await supabase.from("User").select("*");
    return ["JSON.stringify(data)"];
  }),
});

export type AppRouter = typeof appRouter;

// The code below is kept here to keep things simple

interface User {
  id: string;
  name: string;
  email: string;
}

const userList: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "johndoe@gmail.com",
  },
  {
    id: "2",
    name: "Abraham Smith",
    email: "abrahamsmith@gmail.com",
  },
  {
    id: "3",
    name: "Barbie Tracy",
    email: "barbietracy@gmail.com",
  },
  {
    id: "4",
    name: "John Payday",
    email: "johnpayday@gmail.com",
  },
  {
    id: "5",
    name: "Remember My Name",
    email: "remembermyname@gmail.com",
  },
  {
    id: "6",
    name: "Go to School",
    email: "gotoschool@gmail.com",
  },
  {
    id: "7",
    name: "Fish Fruit",
    email: "fishfruit@gmail.com",
  },
  {
    id: "8",
    name: "Don't try",
    email: "donttry@gmail.com",
  },
  {
    id: "9",
    name: "Producer Feed",
    email: "producerfeed@gmail.com",
  },
  {
    id: "10",
    name: "Panic So",
    email: "panicso@gmail.com",
  },
];
