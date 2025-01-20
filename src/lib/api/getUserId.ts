import type { Context } from "hono";

export const getUserId = (c: Context) => {
  const authUserId = c.get("jwtPayload").user.id;
  if (!authUserId) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  return authUserId;
};
