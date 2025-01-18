import { Hono } from "hono";
// import { jwt, JwtVariables } from "hono/jwt";
import users from "./users";
import { D1Database } from "@cloudflare/workers-types";
import { handle } from "hono/vercel";

export interface Bindings {
  DB: D1Database;
}

// export type Variables = JwtVariables;

// const jwtSecret = process.env.NEXTAUTH_SECRET;
// if (!jwtSecret) {
//   throw new Error("NEXTAUTH_SECRET is not defined");
// }
// const jwtMiddleware = jwt({
//   secret: jwtSecret,
// });

const app = new Hono<{
  Bindings: Bindings;
  // Variables: Variables;
}>()
  .basePath("/api")
  // .use("*", jwtMiddleware)
  .route("/users", users)
  .get("/", async (c) => {
    console.log("c", c);
    console.log("c.env", c.env);
    console.log("DB!!!!!!!!!!", c.env.DB);
    if (!c.env.DB) {
      return c.json({ error: "DB is not bound" }, 500);
    }
    try {
      const result = await c.env.DB.prepare(`SELECT * FROM users`).all();
      return c.json(result);
    } catch (error) {
      return c.json({ error: error }, 500);
    }
  });

export type AppType = typeof app;

export const runtime = "edge";
export const GET = handle(app);
export const POST = handle(app);
