import { type NextApiRequest, type NextApiResponse } from "next";
export type Req = { username: string; displayname: string; bio: string };
export type Res = { isUsernameAvailable: boolean; succeeded: boolean };
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // if (req.method !== "POST")
  // return res.status(404).send("Not Found");
  res.send("");
  const body = JSON.parse(req.body as string) as Req;
  console.log("^_^ Log \n file: route.ts:6 \n body:", body);

  // NextResponse.json({ isUsernameAvailable: true, succeeded: true });
  res.send(JSON.stringify({ isUsernameAvailable: true, succeeded: true }));
}
