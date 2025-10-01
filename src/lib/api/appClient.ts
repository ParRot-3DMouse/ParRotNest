import { hc } from "hono/client";
import type { AppType } from "../../app/api/[[...route]]/route";

const createClient = () => hc<AppType>("/");

export type AppClient = ReturnType<typeof createClient>;

let cachedClient: AppClient | null = null;

export const getAppClient = (): AppClient => {
  if (!cachedClient) {
    cachedClient = createClient();
  }
  return cachedClient;
};
