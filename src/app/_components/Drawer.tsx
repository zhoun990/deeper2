import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { type ReactNode } from "react";
import LogoutItem from "./LogoutItem";
import { type Database } from "~/lib/database.types";
import { prisma } from "~/lib/prisma";

export const Drawer = async () => {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
  const user = await supabase.auth.getUser().then((res) => res.data.user);
  const profile =
    user &&
    (await prisma.user.findUnique({
      where: { id: user.id },
    }));
  return (
    <div className="flex w-64 flex-col">
      <div className="flex grow flex-col overflow-y-auto bg-neutral-800 pt-5">
        <div className="flex shrink-0 flex-col items-center px-4">
          <Link href="/" className="px-8 text-left focus:outline-none">
            <h2 className="block cursor-pointer p-2 text-xl font-medium tracking-tighter text-neutral-200 transition duration-500 ease-in-out hover:text-neutral-200">
              Default_is_Private
            </h2>
          </Link>
        </div>
        <div className="mt-5 flex grow flex-col px-4">
          <nav className="flex-1 space-y-1 bg-neutral-800">
            <ul>
              <Item href="/" active>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
                <span className="ml-4"> タイムライン</span>
              </Item>

              {/* <Item href="/">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          ></path>
        </svg>
        <span className="ml-4">Chat</span>
      </Item> */}
              {profile && (
                <Item href={`/${profile.username}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  <span className="ml-4">プロフィール</span>
                </Item>
              )}
            </ul>
            {/* <p className="px-4 pt-4 font-medium uppercase text-neutral-200">
        Shortcuts
      </p> */}
            <ul>{user && <LogoutItem />}</ul>
          </nav>
        </div>
        <div className="flex shrink-0 bg-neutral-900 p-4">
          {user && profile ? (
            <Link
              href={`/${profile.username}`}
              className="group block w-full shrink-0"
            >
              <div className="flex items-center ">
                <div className="inline-block h-9 w-9 rounded-full bg-gray-600"></div>
                <div className="ml-3 flex flex-col justify-center">
                  {/* <p className="text-sm font-medium text-neutral-200">
                {profile?.name}
              </p> */}
                  <p className="text-sm font-semibold">{profile.name}</p>
                  <p className="text-xs text-gray-400">{profile.username}</p>
                </div>
              </div>
            </Link>
          ) : (
            <div className=" flex w-full shrink-0 list-none items-center justify-around gap-2 lg:ml-auto">
              <Link
                href={"/register"}
                className="block items-center rounded-xl border-2 border-white px-8 py-2.5 text-center text-base font-medium text-blue-600 shadow-md transition duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                SignIn
              </Link>
              <Link
                href={"/register"}
                className="block items-center rounded-xl bg-blue-600 px-8 py-3 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                SignUp
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const Item = ({
  active,
  children,
  href,
}: {
  active?: boolean;
  children: ReactNode;
  href: string;
}) => {
  // if (active)
  //   return (
  //     <li>
  //       <Link
  //         href={href}
  //         className="mt-1 inline-flex w-full items-center rounded-lg border border-neutral-900 bg-neutral-900 px-4 py-2 text-base text-neutral-200 transition duration-500 ease-in-out focus:shadow"
  //       >
  //         {children}
  //       </Link>
  //     </li>
  //   );
  return (
    <li>
      <Link
        className="mt-1 inline-flex w-full items-center rounded-lg border border-neutral-800 px-4 py-2 text-base text-neutral-200 transition duration-500 ease-in-out hover:border-neutral-800 hover:bg-neutral-900 focus:border-neutral-900 focus:bg-neutral-900 focus:shadow"
        href={href}
      >
        {children}
      </Link>
    </li>
  );
};
