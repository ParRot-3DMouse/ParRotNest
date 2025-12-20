import type { Context } from "hono";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const getUserID = async (c: Context): Promise<string> => {
  const user_email = c.get("jwtPayload").email;
  const { env } = getCloudflareContext<{ env: CloudflareEnv }>();
  const { results } = await env.DB.prepare(
    `SELECT user_id FROM users WHERE user_email = ?1`
  )
    .bind(user_email)
    .all();

  if (!results || results.length === 0) {
    throw new Error("User not found");
  }

  return results[0].user_id as string;
};
