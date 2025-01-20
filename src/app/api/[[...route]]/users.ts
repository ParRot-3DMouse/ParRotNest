import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Bindings } from "./route";

const postUserSchema = z.object({
  user_id: z.string(),
  user_email: z.string().email(),
  user_name: z.string(),
});

const users = new Hono<{
  Bindings: Bindings;
  //  Variables: Variables
}>()
  .post("/", zValidator("json", postUserSchema), async (c) => {
    try {
      const { user_id, user_email, user_name } = postUserSchema.parse(
        await c.req.json()
      );

      console.log("POST /users: Received data", {
        user_id,
        user_email,
        user_name,
      });

      const { results } = await process.env.DB.prepare(
        `SELECT * FROM users WHERE user_id = ?1`
      )
        .bind(user_id)
        .all();

      if (results && results.length > 0) {
        console.log("POST /users: Existing user found");
        return c.json({ status: "existing_user" });
      } else {
        console.log("POST /users: Inserting new user");
        await process.env.DB.prepare(
          `INSERT INTO users (user_id, user_email, user_name) VALUES (?1, ?2, ?3)`
        )
          .bind(user_id, user_email, user_name)
          .run();

        return c.json({ status: "new_user" });
      }
    } catch (err) {
      console.error("POST /users: Error", err);
      if (err instanceof z.ZodError) {
        return c.json({ error: "Invalid input", details: err.errors }, 400);
      }
      return c.json({ error: err }, 500);
    }
  })
  // GET /users/:user_id: ユーザー情報取得
  .get("/:user_id", async (c) => {
    const user_id = c.req.param("user_id");

    const { results } = await process.env.DB.prepare(
      `SELECT * FROM users WHERE user_id = ?1`
    )
      .bind(user_id)
      .all();

    if (!results || results.length === 0) {
      return c.json({ error: "Not found" }, 404);
    }

    return c.json(results[0]);
  })
  // GET /users: ユーザー一覧取得
  .get("/", async (c) => {
    const { results } =
      await process.env.DB.prepare(`SELECT * FROM users`).all();

    return c.json(results);
  });

export const runtime = "edge";
export default users;
