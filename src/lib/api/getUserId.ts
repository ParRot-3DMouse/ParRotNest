import { Context } from "hono";

export const getUserId = (c: Context): string | null => {
  return c.get("jwtPayload")?.user?.id ?? null;
};
