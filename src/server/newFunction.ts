import { publicProcedure, getUsers } from "../app/api/trpc/_trpc]";

export function newFunction() {
  return publicProcedure.query(async () => {
    // Retrieve users from a datasource, this is an imaginary database
    const users: string[] = await getUsers();
    return users;
  });
}
