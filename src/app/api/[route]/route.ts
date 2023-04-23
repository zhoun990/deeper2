import bell from "./_functions/bell";
import { createRouter } from "./_functions/createRouter";
import post from "./_functions/post";
import register from "./_functions/register";
const router = {
  post,
  register,
  bell,
};
export type Router = typeof router;
export const { POST, GET, PUT, DELETE } = createRouter(router);
