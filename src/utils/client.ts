import { createClient } from "~/app/api/[route]/_functions/createRouter";
import { type Router } from "~/app/api/[route]/route";

const client = createClient<Router>();
export default client;
