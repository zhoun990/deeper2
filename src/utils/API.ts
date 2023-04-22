import { type NextRequest, NextResponse } from "next/server";
import { POST } from "~/app/api/[route]/route";

// export const API = <Req, Res>(callback: (body: Req) => Promise<Res>) => {
//   return async (req: NextRequest) => {
//     const body = (await req.json()) as Req;
//     return NextResponse.json(await callback(body));
//   };
// };
export const Post = <Req, Res>(
  path: string,
  callback: (body: Req, req: NextRequest) => Promise<Res>
) => {
  return {
    POST: async (req: NextRequest) => {
      const body = (await req.json()) as Req;
      return NextResponse.json(await callback(body, req));
    },
    post: (arg: Req) =>
      fetcher<Req, Res>(path, "POST", arg, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
  };
};
export const Get = <Res>(
  path: string,
  callback: (req: NextRequest) => Promise<Res>
) => {
  return {
    GET: async (req: NextRequest) => {
      return NextResponse.json(await callback(req));
    },
    // eslint-disable-next-line @typescript-eslint/ban-types
    get: () => fetcher<{}, Res>(path, "GET"),
  };
};

const fetcher = async <T, U>(
  input: RequestInfo | URL,
  method?: "POST" | "GET",
  body?: T,
  others?: RequestInit | undefined
): Promise<U> =>
  await fetch(input, {
    ...others,
    method: method,
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (res) => (await res.json()) as U);
