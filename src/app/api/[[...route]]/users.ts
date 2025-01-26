import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Bindings, Variables } from "./route";
import { v4 } from "uuid";
import { getUserID } from "../../../lib/api/getUserId";
import { User } from "../types";

const postUserSchema = z.object({
  user_email: z.string().email(),
  user_name: z.string(),
});

const getUserSchema = z.object({
  user_id: z.string().uuid(),
});

const updateUserSchema = z.object({
  user_name: z.string().optional(),
});

const users = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>()
  // POST /users
  .post("/", zValidator("json", postUserSchema), async (c) => {
    try {
      const { user_email, user_name } = postUserSchema.parse(
        await c.req.json()
      );

      const { results } = await process.env.DB.prepare(
        `SELECT * FROM users WHERE user_email = ?1`
      )
        .bind(user_email)
        .all();

      if (results && results.length > 0) {
        const existing_user_id = results[0].user_id;
        return c.json({ status: "existing_user", user_id: existing_user_id });
      }

      const new_user_id = v4();

      await process.env.DB.prepare(
        `INSERT INTO users (user_id, user_email, user_name) VALUES (?1, ?2, ?3)`
      )
        .bind(new_user_id, user_email, user_name)
        .run();

      return c.json({ status: "new_user", user_id: new_user_id });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return c.json({ error: "Invalid input", details: err.errors }, 400);
      }
      return c.json({ error: err }, 500);
    }
  })
  // GET /users/:user_id
  .get("/:user_id", async (c) => {
    try {
      const { user_id } = getUserSchema.parse({
        user_id: c.req.param("user_id"),
      });

      const authedUserId = await getUserID(c);
      if (!authedUserId) {
        return c.json({ error: "Unauthorized" }, 403);
      }
      if (authedUserId !== user_id) {
        return c.json({ error: "Unauthorized" }, 403);
      }

      const { results }: { results: User[] } = await process.env.DB.prepare(
        `SELECT * FROM users WHERE user_id = ?1`
      )
        .bind(user_id)
        .all();

      if (!results || results.length === 0) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json(results[0]);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return c.json({ error: "Invalid user_id format" }, 400);
      }
      return c.json({ error: err }, 500);
    }
  })
  // PUT /users/:user_id
  .put("/:user_id", zValidator("json", updateUserSchema), async (c) => {
    try {
      const { user_id } = getUserSchema.parse({
        user_id: c.req.param("user_id"),
      });
      const authedUserId = await getUserID(c);
      if (!authedUserId) {
        return c.json({ error: "Unauthorized" }, 403);
      }
      if (authedUserId !== user_id) {
        return c.json({ error: "Unauthorized" }, 403);
      }
      const { user_name } = updateUserSchema.parse(c.req.json());
      if (!user_name) {
        return c.json({ error: "No fields to update" }, 400);
      }
      const { results: existing } = await process.env.DB.prepare(
        `SELECT * FROM users WHERE user_id = ?1`
      )
        .bind(user_id)
        .all();

      if (!existing || existing.length === 0) {
        return c.json({ error: "User not found" }, 404);
      }

      await process.env.DB.prepare(
        `UPDATE users SET user_name = ?1 WHERE user_id = ?2`
      )
        .bind(user_name, user_id)
        .run();

      return c.json({ status: "updated" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return c.json({ error: "Invalid input", details: err.errors }, 400);
      }
      return c.json({ error: err }, 500);
    }
  })
  // DELETE /users/:user_id
  .delete("/:user_id", async (c) => {
    try {
      const { user_id } = getUserSchema.parse({
        user_id: c.req.param("user_id"),
      });
      const authedUserId = await getUserID(c);
      if (!authedUserId) {
        return c.json({ error: "Unauthorized" }, 403);
      }
      if (authedUserId !== user_id) {
        return c.json({ error: "Unauthorized" }, 403);
      }

      const { results } = await process.env.DB.prepare(
        `SELECT * FROM users WHERE user_id = ?1`
      )
        .bind(user_id)
        .all();
      if (!results || results.length === 0) {
        return c.json({ error: "User not found" }, 404);
      }

      await process.env.DB.prepare(`DELETE FROM users WHERE user_id = ?1`)
        .bind(user_id)
        .run();

      return c.json({ status: "deleted" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return c.json({ error: "Invalid user_id format" }, 400);
      }
      return c.json({ error: err }, 500);
    }
  });

export const runtime = "edge";
export default users;
