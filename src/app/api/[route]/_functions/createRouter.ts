import { NextResponse, type NextRequest } from "next/server";
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type RouterActions = "post" | "get" | "put" | "delete";
type APIMethods = "POST" | "GET" | "PUT" | "DELETE";
type PFunc = (body: any, req: NextRequest) => any | Promise<any>;
type Producer = {
  [key: string]: {
    [key in RouterActions]?: PFunc;
  };
};
type ClientMethod<T> = (
  body?: T extends (body: infer P) => any ? P : never
) => T extends (...args: any) => infer R ? Promise<UnwrapPromise<R>> : any;
type Client<T extends Producer> = {
  [Path in keyof T]: {
    [Method in keyof T[Path]]: ClientMethod<T[Path][Method]>;
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
} & {
  client: Client<T>;
} => {
  const procedure = async (
    req: NextRequest,
    path: keyof T,
    type: RouterActions
  ) => {
    const p = procedures[path]?.[type];
    if (!p) {
      return NextResponse.error();
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await req.json();
    return NextResponse.json(await p(body, req));
  };

  const client: Client<T> = {} as Client<T>;
  for (const path in procedures) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    client[path as keyof T] = {} as any;
    for (const method in procedures[path]) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      client[path as keyof T][method as keyof T[keyof T]] = ((args: any) => {
        console.log("^_^ Log \n file: route.ts:70 \n path:", path);

        return fetch(`/api/${String(path)}`, {
          method: method.toUpperCase() as APIMethods,
          body: args ? JSON.stringify(args) : undefined,
        }).then((res) => res.json());
      }) as any;
    }
  }
  return {
    POST: async (req, { params }) => procedure(req, params.route, "post"),
    GET: async (req, { params }) => procedure(req, params.route, "get"),
    PUT: async (req, { params }) => procedure(req, params.route, "put"),
    DELETE: async (req, { params }) => procedure(req, params.route, "delete"),
    client,
  };
};
