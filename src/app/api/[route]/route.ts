import post from "./_functions/post";
import { createRouter } from "./_functions/createRouter";
import register from "./_functions/register";

export const { POST, GET, PUT, DELETE, client } = createRouter({
  post: {
    ...post,
  },
  register,
});
