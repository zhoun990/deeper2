import { createClient, createRouter } from "./_functions/createRouter";
import post from "./_functions/post";
import register from "./_functions/register";
const router={
  post: {
    ...post,
  },
  register,
}
export const { POST, GET, PUT, DELETE } = createRouter(router);
export const client=createClient<typeof router>()