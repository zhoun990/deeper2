import { createClient, createRouter } from "./_functions/createRouter";
import post from "./_functions/post";
import register from "./_functions/register";

export const { POST, GET, PUT, DELETE,client } = createRouter({
  post: {
    ...post,
  },
  register,
});
// export const client=createClient<>()