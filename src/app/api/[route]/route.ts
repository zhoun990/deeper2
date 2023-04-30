import { createRouter } from "./_functions/createRouter";
import editProfile from "./_functions/editProfile";
import favorite from "./_functions/favorite";
import group from "./_functions/group";
import groupMember from "./_functions/groupMember";
import post from "./_functions/post";
import register from "./_functions/register";
const router = {
  post,
  register,
  favorite,
  group,
  groupMember,
  editProfile,
};
export type Router = typeof router;
export const { POST, GET, PUT, DELETE } = createRouter(router);
