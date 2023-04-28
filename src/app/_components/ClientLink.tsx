"use client";

import { useRouter } from "next/navigation";
import { type CSSProperties, type FC, type ReactNode } from "react";

const ClientLink: FC<{
  children: ReactNode;
  href: string;
  className?: string;
  style?: CSSProperties;
}> = ({ children, href, className, style }) => {
  const router = useRouter();
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        router.push(href);
        console.log("^_^ Log \n file: ClientLink.tsx:16 \n href:", href);
      }}
      className={className}
      style={style}
    >
      {children}
    </div>
  );
};
export default ClientLink;
