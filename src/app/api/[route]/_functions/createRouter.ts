import { NextResponse, type NextRequest } from "next/server";
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type RouterActions = "post" | "get" | "put" | "delete";
type APIMethods = "POST" | "GET" | "PUT" | "DELETE";
type PFunc = (body: any, params: any, req: NextRequest) => any | Promise<any>;
type Producer = {
  [key: string]: {
    [key in RouterActions]?: PFunc;
  };
};
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
type ClientMethod<T extends PFunc> = (
  ...params: Parameters<T>
) => // body?: T extends (body?: infer P, params?: any) => any ? P : null,
// params?: T extends (_?: any, params?: infer P) => any ? P : never
//T extends (args: any) => infer R ? Promise<UnwrapPromise<R>> : any;
Promise<UnwrapPromise<ReturnType<T>>>;
type Client<T extends Producer> = <
  Path extends keyof T,
  Method extends keyof T[Path]
>(
  path: Path,
  method: Method,
  options?: RequestInit
  // params?: Record<string, string | number>
) => T[Path][Method] extends PFunc ? ClientMethod<T[Path][Method]> : never;

export const createClient = <T extends Producer>(): Client<T> => {
  //@ts-expect-error しらんわ
  return (path, method, options) => {
    return (args, params) => {
      console.log("^_^ Log \n file: createRouter.ts:42 \n params:", params);
      let url = `/api/${String(path)}`;
      for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const element = params[key];
          url += `?${encodeURIComponent(key)}=${encodeURIComponent(
            String(element)
          )}`;
          console.log("^_^ Log \n file: createRouter.ts:50 \n url:", url);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return fetch(url, {
        method: String(method).toUpperCase() as APIMethods,
        body: args ? JSON.stringify(args) : undefined,
        ...options,
      })
        .then((res) => res.json())
        .catch((err) => {
          console.log("^_^ Log \n file: createRouter.ts:43 \n err:", err);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return err;
        }) as any;
    };
  };
};

export const createRouter = <T extends Producer>(
  procedures: T
): {
  [key in APIMethods]: (
    req: NextRequest,
    params: {
      params: { route: keyof T };
    }
  ) => Promise<NextResponse | Response>;
} =>
  // & {
  // client: <Path extends keyof T, Method extends keyof T[Path]>(
  //   path: Path,
  //   method: Method
  // ) => ClientMethod<T[Path][Method]>;
  // }
  {
    const procedure = async (
      req: NextRequest,
      params: { route: keyof T },
      type: RouterActions
    ) => {
      const p = procedures[params.route]?.[type];
      if (!p) {
        console.warn("^_^ Log \n file: createRouter.ts:59 \n p:", p);
        return NextResponse.error();
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const body = await req.json().catch((err) => undefined);
      return NextResponse.json(
        await p(
          body,
          Object.fromEntries(
            Array.from(req.nextUrl.searchParams.entries()).map(([k, v]) => [
              decodeURIComponent(k),
              decodeURIComponent(v),
            ])
          ),
          req
        )
      );
    };
    // const client: Client<T> = {} as Client<T>;
    // for (const path in procedures) {
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //   client[path as keyof T] = {} as any;
    //   for (const method in procedures[path]) {
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //     client[path as keyof T][method as keyof T[keyof T]] = ((args: any) => {
    //       console.log("^_^ Log \n file: route.ts:70 \n path:", path);

    //       return fetch(`/api/${String(path)}`, {
    //         method: method.toUpperCase() as APIMethods,
    //         body: args ? JSON.stringify(args) : undefined,
    //       }).then((res) => res.json());
    //     }) as any;
    //   }
    // }
    return {
      POST: async (req, { params }) => procedure(req, params, "post"),
      GET: async (req, { params }) => procedure(req, params, "get"),
      PUT: async (req, { params }) => procedure(req, params, "put"),
      DELETE: async (req, { params }) => procedure(req, params, "delete"),
      // client: (path, method) => (args) =>
      //   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      //   fetch(`/api/${String(path)}`, {
      //     method: String(method).toUpperCase() as APIMethods,
      //     body: args ? JSON.stringify(args) : undefined,
      //   }).then((res) => res.json()) as any,
    };
  };
