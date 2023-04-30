"use client";

import { useState, type ReactNode } from "react";
import IconButton from "./IconButton";

export default function MobileDrawer({
  children,
  drawer,
}: {
  drawer: ReactNode;
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="h-full rounded-lg md:flex">
      <div className="sticky top-0 hidden h-screen md:flex md:shrink-0">
        {drawer}
      </div>
      <div
        className={`${
          visible ? "z-[50] opacity-50" : "z-[-1] opacity-0"
        } fixed top-0 h-screen w-full bg-black transition duration-500 md:hidden`}
        onClick={() => {
          setVisible(false);
        }}
      ></div>
      <div
        className={`${
          visible ? "translate-x-0" : "translate-x-[-600px]"
        } fixed top-0 z-50 flex h-screen shrink-0 transition md:hidden`}
        onClick={() => {
          setVisible(false);
        }}
      >
        {drawer}
      </div>
      <div className="sticky top-0 z-40 flex shrink-0 md:hidden">
        <IconButton
          onClick={() => {
            setVisible(!visible);
          }}
          className="m-3 hover:bg-gray-800"
          style={{ padding: 12 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </IconButton>
      </div>
      {/* <div className="flex w-0 flex-1 flex-col overflow-hidden"> */}
      {/* <main className="relative flex-1 overflow-y-auto focus:outline-none"> */}

      <div className="grow">{children}</div>
      {/* </main> */}
      {/* </div> */}
    </div>

    // <>
    //   <div className="sticky top-0 hidden h-screen md:flex md:shrink-0">
    //     {children}
    //   </div>
    //   <div className="sticky top-0 flex md:hidden">|||</div>
    // </>
  );
}
