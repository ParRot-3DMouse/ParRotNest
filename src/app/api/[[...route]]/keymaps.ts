import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Bindings, Variables } from "./route";
import { v4 } from "uuid";
import { getUserID } from "../../../lib/api/getUserId";
import { Keymap } from "../types";

const postKeymapSchema = z.object({
  keymap_name: z.string(),
  keymap_json: z.string(),
});

const getKeymapsByUserSchema = z.object({
  user_id: z.string().uuid(),
});

const getKeymapIdSchema = z.object({
  keymap_id: z.string().uuid(),
});

const updateKeymapSchema = z.object({
  keymap_name: z.string().optional(),
  keymap_json: z.string().optional(),
});

const keymaps = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>()
  // POST /keymaps
  .post("/", zValidator("json", postKeymapSchema), async (c) => {
    try {
      const { keymap_name, keymap_json } = postKeymapSchema.parse(
        await c.req.json()
      );
      const authUserId = await getUserID(c);
      if (!authUserId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const keymap_id = v4();

      await process.env.DB.prepare(
        `INSERT INTO keymaps (keymap_id, keymap_name, keymap_json, user_id) VALUES (?1, ?2, ?3, ?4)`
      )
        .bind(keymap_id, keymap_name, keymap_json, authUserId)
        .run();

      return c.json({ status: "created", keymap_id });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return c.json({ error: "Invalid input", details: err.errors }, 400);
      }
      return c.json({ error: err }, 500);
    }
  })
  // GET /keymaps/user/:user_id
  .get("/user/:user_id", async (c) => {
    try {
      const { user_id } = getKeymapsByUserSchema.parse({
        user_id: c.req.param("user_id"),
      });

      const authUserId = await getUserID(c);
      if (!authUserId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      if (user_id !== authUserId) {
        return c.json({ error: "Forbidden" }, 403);
      }
      const { results }: { results: Keymap[] } = await process.env.DB.prepare(
        `SELECT * FROM keymaps WHERE user_id = ?1`
      )
        .bind(user_id)
        .all();

      return c.json(results);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return c.json(
          { error: "Invalid user_id format", details: err.errors },
          400
        );
      }
      return c.json({ error: err }, 500);
    }
  })
  // GET /keymaps/:keymap_id
  .get("/:keymap_id", async (c) => {
    try {
      const { keymap_id } = getKeymapIdSchema.parse({
        keymap_id: c.req.param("keymap_id"),
      });

      const authUserId = await getUserID(c);
      if (!authUserId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { results }: { results: Keymap[] } = await process.env.DB.prepare(
        `SELECT * FROM keymaps WHERE keymap_id = ?1 AND user_id = ?2`
      )
        .bind(keymap_id, authUserId)
        .all();

      return c.json(results);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return c.json({ error: "Invalid keymap_id", details: err.errors }, 400);
      }
      return c.json({ error: err }, 500);
    }
  })
  // PUT /keymaps/:keymap_id
  .put("/:keymap_id", zValidator("json", updateKeymapSchema), async (c) => {
    try {
      const { keymap_id } = getKeymapIdSchema.parse({
        keymap_id: c.req.param("keymap_id"),
      });

      const authUserId = await getUserID(c);
      if (!authUserId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const partialData = updateKeymapSchema.parse(await c.req.json());
      if (!partialData.keymap_name && !partialData.keymap_json) {
        return c.json({ error: "No fields to update" }, 400);
      }

      const { results: existing } = await process.env.DB.prepare(
        `SELECT * FROM keymaps WHERE keymap_id = ?1 AND user_id = ?2`
      )
        .bind(keymap_id, authUserId)
        .all();

      if (!existing || existing.length === 0) {
        return c.json({ error: "Keymap not found" }, 404);
      }

      const setClauses: string[] = [];
      const params: string[] = [];

      if (partialData.keymap_name) {
        setClauses.push(`keymap_name = ?${setClauses.length + 1}`);
        params.push(partialData.keymap_name);
      }
      if (partialData.keymap_json) {
        setClauses.push(`keymap_json = ?${setClauses.length + 1}`);
        params.push(partialData.keymap_json);
      }

      const updateSql = `UPDATE keymaps SET ${setClauses.join(", ")} WHERE keymap_id = ?${setClauses.length + 1} AND user_id = ?${setClauses.length + 2}`;
      params.push(keymap_id, authUserId);

      await process.env.DB.prepare(updateSql)
        .bind(...params)
        .run();

      return c.json({ status: "updated" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return c.json({ error: "Invalid input", details: err.errors }, 400);
      }
      return c.json({ error: err }, 500);
    }
  })
  // DELETE /keymaps/:keymap_id
  .delete("/:keymap_id", async (c) => {
    try {
      const { keymap_id } = getKeymapIdSchema.parse({
        keymap_id: c.req.param("keymap_id"),
      });

      const authUserId = await getUserID(c);
      if (!authUserId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { results } = await process.env.DB.prepare(
        `SELECT * FROM keymaps WHERE keymap_id = ?1 AND user_id = ?2`
      )
        .bind(keymap_id, authUserId)
        .all();

      if (!results || results.length === 0) {
        return c.json({ error: "Keymap not found" }, 404);
      }

      await process.env.DB.prepare(
        `DELETE FROM keymaps WHERE keymap_id = ?1 AND user_id = ?2`
      )
        .bind(keymap_id, authUserId)
        .run();

      return c.json({ status: "deleted" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return c.json({ error: "Invalid keymap_id", details: err.errors }, 400);
      }
      return c.json({ error: err }, 500);
    }
  });

export const runtime = "edge";
export default keymaps;
