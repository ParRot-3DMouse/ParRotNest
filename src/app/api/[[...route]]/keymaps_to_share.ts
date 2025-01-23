import { Hono } from "hono";
import { Bindings, Variables } from "./route";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getUserID } from "../../../lib/api/getUserId";
import { v4 } from "uuid";

const postKeymapToShareSchema = z.object({
  keymap_name: z.string(),
  keymap_json: z.string(),
  author_id: z.string().uuid(),
});

const getKeymapToShareIdSchema = z.object({
  share_id: z.string().uuid(),
});

const getKeymapToShareByAuthorSchema = z.object({
  author_id: z.string().uuid(),
});

const deleteKeymapToShareSchema = z.object({
  share_id: z.string().uuid(),
  author_id: z.string().uuid(),
});

const keymaps_to_share = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>()
  // POST /keymaps_to_share
  .post("/", zValidator("json", postKeymapToShareSchema), async (c) => {
    try {
      const { keymap_name, keymap_json, author_id } =
        postKeymapToShareSchema.parse(await c.req.json());
      const share_id = v4();

      await process.env.DB.prepare(
        `INSERT INTO keymaps_to_share (share_id, keymap_name, keymap_json, author_id) VALUES (?1, ?2, ?3, ?4)`
      )
        .bind(share_id, keymap_name, keymap_json, author_id)
        .run();
      return c.json({ status: "created", share_id });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return c.json({ error: "Invalid input", details: err.errors }, 400);
      }
      return c.json({ error: err }, 500);
    }
  })
  // GET /keymaps_to_share/:share_id
  .get("/:share_id", async (c) => {
    try {
      const { share_id } = getKeymapToShareIdSchema.parse({
        share_id: c.req.param("share_id"),
      });
      const { results } = await process.env.DB.prepare(
        `SELECT * FROM keymaps_to_share WHERE share_id = ?1`
      )
        .bind(share_id)
        .all();
      return c.json(results);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return c.json({ error: "Invalid input", details: err.errors }, 400);
      }
      return c.json({ error: err }, 500);
    }
  })
  // GET /keymaps_to_share/author/:author_id
  .get("/author/:author_id", async (c) => {
    try {
      const { author_id } = getKeymapToShareByAuthorSchema.parse({
        author_id: c.req.param("author_id"),
      });

      const { results } = await process.env.DB.prepare(
        `SELECT * FROM keymaps_to_share WHERE author_id = ?1`
      )
        .bind(author_id)
        .all();

      return c.json(results);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return c.json({ error: "Invalid input", details: err.errors }, 400);
      }
      return c.json({ error: err }, 500);
    }
  })
  // DELETE /keymaps_to_share/:share_id
  .delete(
    "/:share_id",
    zValidator("json", deleteKeymapToShareSchema),
    async (c) => {
      try {
        const { share_id, author_id } = deleteKeymapToShareSchema.parse({
          share_id: c.req.param("share_id"),
        });

        const authUserId = await getUserID(c);
        if (!authUserId) {
          return c.json({ error: "Unauthorized" }, 401);
        }
        if (authUserId !== author_id) {
          return c.json({ error: "Forbidden" }, 403);
        }

        const { results } = await process.env.DB.prepare(
          `SELECT * FROM keymaps_to_share WHERE share_id = ?1 AND author_id = ?2`
        )
          .bind(share_id, authUserId)
          .all();

        if (!results || results.length === 0) {
          return c.json({ error: "Not found" }, 404);
        }

        await process.env.DB.prepare(
          `DELETE FROM keymaps_to_share WHERE share_id = ?1 AND author_id = ?2`
        )
          .bind(share_id, authUserId)
          .run();

        return c.json({ status: "deleted" });
      } catch (err) {
        if (err instanceof z.ZodError) {
          return c.json({ error: "Invalid input", details: err.errors }, 400);
        }
        return c.json({ error: err }, 500);
      }
    }
  );

export const runtime = "edge";
export default keymaps_to_share;
