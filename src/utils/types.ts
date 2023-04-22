import { type Database } from "~/lib/database.types";
export type Tables = Database["public"]["Tables"];
export type Profile = Tables["User"]["Row"];
export type Post = Tables["Post"]["Row"];
