import { type HTMLAttributes } from "react";

export default function IconButton({
  children,
  className,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={
        "rounded-xl bg-gray-800 p-4 text-center text-base font-medium text-white transition duration-300 ease-in-out hover:bg-gray-500 focus:outline-none active:scale-125 " +
        (className || "")
      }
      {...props}
    >
      {children}
    </div>
  );
}
