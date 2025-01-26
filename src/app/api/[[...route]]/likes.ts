import { Hono } from "hono";
import { Bindings, Variables } from "./route";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getUserID } from "../../../lib/api/getUserId";
import { KeymapToShare, User } from "../types";

const postLikeSchema = z.object({
  share_id: z.string().uuid(),
});

const getLikesCheckSchema = z.object({
  share_id: z.string().uuid(),
});

const getLikesByShareSchema = z.object({
  share_id: z.string().uuid(),
});

const getLikesByUserSchema = z.object({
  user_id: z.string().uuid(),
});

const deleteLikeSchema = z.object({
  share_id: z.string().uuid(),
});

const likes = new Hono<{ Bindings: Bindings; Variables: Variables }>()
  // POST /likes
  .post("/", zValidator("json", postLikeSchema), async (c) => {
    try {
      const user_id = await getUserID(c);
      if (!user_id) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const { share_id } = postLikeSchema.parse(await c.req.json());

      await process.env.DB.prepare(
        `INSERT INTO likes (share_id, user_id) VALUES (?1, ?2) ON CONFLICT DO NOTHING`
      )
        .bind(share_id, user_id)
        .run();

      return c.json({ status: "created" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return c.json({ error: "Invalid input", details: err.errors }, 400);
      }
      return c.json({ error: err }, 500);
    }
  })
  // GET /likes/check/:share_id
  .get("/check/:share_id", async (c) => {
    try {
      const user_id = await getUserID(c);
      if (!user_id) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const { share_id } = getLikesCheckSchema.parse({
        share_id: c.req.param("share_id"),
      });
      const { results }: { results: { count: number }[] } =
        await process.env.DB.prepare(
          `SELECT COUNT(*) AS count FROM likes WHERE share_id = ?1 AND user_id = ?2`
        )
          .bind(share_id, user_id)
          .all();

      return c.json({ is_liked: results[0].count > 0 });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return c.json({ error: "Invalid input", details: err.errors }, 400);
      }
      return c.json({ error: err }, 500);
    }
  })
  // GET /likes/share/:share_id
  .get("/share/:share_id", async (c) => {
    try {
      const { share_id } = getLikesByShareSchema.parse({
        share_id: c.req.param("share_id"),
      });

      const { results }: { results: User[] } = await process.env.DB.prepare(
        `SELECT users.user_id, users.user_name, users.user_email FROM likes JOIN users ON likes.user_id = users.user_id WHERE likes.share_id = ?1`
      )
        .bind(share_id)
        .all();

      return c.json({ results });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return c.json({ error: "Invalid input", details: err.errors }, 400);
      }
      return c.json({ error: err }, 500);
    }
  })
  // GET /likes/user/:user_id
  .get("/user/:user_id", async (c) => {
    console.log("get likes by user");
    try {
      const authUserId = await getUserID(c);
      console.log(authUserId);
      if (!authUserId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { user_id } = getLikesByUserSchema.parse({
        user_id: c.req.param("user_id"),
      });
      console.log(user_id);
      if (authUserId !== user_id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { results }: { results: KeymapToShare[] } =
        await process.env.DB.prepare(
          `SELECT keymaps_to_share.share_id, keymaps_to_share.keymap_name, keymaps_to_share.keymap_json, keymaps_to_share.author_id, keymaps_to_share.created_at, keymaps_to_share.update_at FROM likes JOIN keymaps_to_share ON likes.share_id = keymaps_to_share.share_id WHERE likes.user_id = ?1`
        )
          .bind(user_id)
          .all();

      console.log(results);

      return c.json({ results });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return c.json({ error: "Invalid input", details: err.errors }, 400);
      }
      return c.json({ error: err }, 500);
    }
  })
  // DELETE /likes/
  .delete("/", zValidator("json", deleteLikeSchema), async (c) => {
    try {
      const user_id = await getUserID(c);
      if (!user_id) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const { share_id } = deleteLikeSchema.parse(await c.req.json());

      await process.env.DB.prepare(
        `DELETE FROM likes WHERE share_id = ?1 AND user_id = ?2`
      )
        .bind(share_id, user_id)
        .run();

      return c.json({ status: "deleted" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return c.json({ error: "Invalid input", details: err.errors }, 400);
      }
      return c.json({ error: err }, 500);
    }
  });

export const runtime = "edge";
export default likes;
