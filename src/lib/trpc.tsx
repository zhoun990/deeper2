// "use client";
// import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  httpBatchLink,
  loggerLink,
  createTRPCProxyClient,
  getFetch,
} from "@trpc/client";
import superjson from "superjson";
import { type AppRouter } from "~/app/api/trpc/trpc-router";
//     👆 **type-only** import
// import { createTRPCReact } from "@trpc/react-query";
// import { useState } from "react";
// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.

const url = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000/api/trpc/";
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink({
      enabled: () => true,
    }),
    httpBatchLink({
      url,
      fetch: async (input, init?) => {
        const fetch = getFetch();
        return fetch(input, {
          ...init,
          credentials: "include",
        });
      },
    }),
  ],
  transformer: superjson,
});
// export const trpc = createTRPCProxyClient<AppRouter>({
//   links: [
//     httpBatchLink({
//       url: "http://localhost:3000/api/trcp",
//     }),
//   ],
// });
// export const trpc = createTRPCReact<AppRouter>();
// // {
// // unstable_overrides: {
// //   useMutation: {
// //     async onSuccess(opts) {
// //       await opts.originalFn();
// //       await opts.queryClient.invalidateQueries();
// //     },
// //   },
// // },
// // }

// function getBaseUrl() {
//   if (typeof window !== "undefined")
//     // browser should use relative path
//     return "";
//   if (process.env.VERCEL_URL)
//     // reference for vercel.com
//     return `https://${process.env.VERCEL_URL}`;
//   if (process.env.RENDER_INTERNAL_HOSTNAME)
//     // reference for render.com
//     return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${
//       process.env.PORT || ""
//     }`;
//   // assume localhost
//   return `http://localhost:${process.env.PORT ?? 3000}`;
// }

// export function ClientProvider(props: { children: React.ReactNode }) {
//   const [queryClient] = useState(() => new QueryClient());
//   const [trpcClient] = useState(() =>
//     trpc.createClient({
//       links: [
//         loggerLink({
//           enabled: () => true,
//         }),
//         httpBatchLink({
//           url: `${getBaseUrl()}/api/trpc`,
//         }),
//       ],
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//       transformer: superjson as any,
//     })
//   );
//   return (
//     <trpc.Provider client={trpcClient} queryClient={queryClient}>
//       <QueryClientProvider client={queryClient}>
//         {props.children}
//       </QueryClientProvider>
//     </trpc.Provider>
//   );
// }
