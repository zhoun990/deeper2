"use client";
import { type User } from "@prisma/client";
import { useEffect, useState } from "react";
import IconButton from "~/app/_styled_components/IconButton";
import client from "~/utils/client";
export const BellButton = ({
  // isBellMarked,
  profile,
}: {
  // isBellMarked: boolean;
  profile: User;
}) => {
  const [bellMarked, setBellMarked] = useState(-1);
  useEffect(() => {
    if (profile) {
      // Get the user's bell settings
      //      client("group", "get")(null, { uid: profile.id });

      client("favorite", "get")(null, { uid: profile.id })
        .then((res) => {
          if (res?.data?.permissionLevel) {
            // Set the bell state based on the user's bell settings
            setBellMarked(res.data.permissionLevel);
          } else setBellMarked(0);
        })
        .catch((err) => {
          setBellMarked(0);
        });
    } else {
      setBellMarked(0);
    }
  }, []);
  if (bellMarked === -1) {
    return null;
  }
  return (
    <IconButton
      onClick={() => {
        (bellMarked > 0
          ? client("favorite", "delete")(null, { uid: profile.id })
          : client("favorite", "post")({ uid: profile.id, notification: 1 })
        ).then((res) => {
          console.log("^_^ Log \n file: BellButton.tsx:22 \n res:", res);
          if (res.succeeded) {
            setBellMarked(bellMarked > 0 ? 0 : 1);
          }
        });
      }}
      suppressHydrationWarning={true}
    >
      {bellMarked > 0 ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
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
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      )}
    </IconButton>
  );
};
