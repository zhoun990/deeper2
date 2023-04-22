"use client";

import { useRouter } from "next/navigation";
import { type FC, type ReactNode } from "react";

const ClientLink: FC<{ children: ReactNode; href: string }> = ({
  children,
  href,
}) => {
  const router = useRouter();
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        router.push(href);
        console.log("^_^ Log \n file: ClientLink.tsx:16 \n href:", href);
      }}
    >
      {children}
    </div>
  );
};
export default ClientLink;
