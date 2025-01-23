import { Hono } from "hono";
// import { jwt, JwtVariables } from "hono/jwt";
import users from "./users";
import { D1Database } from "@cloudflare/workers-types";
import { handle } from "hono/vercel";
import { jwt, JwtVariables } from "hono/jwt";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import keymaps from "./keymaps";
import keymaps_to_share from "./keymaps_to_share";

export interface Bindings {
  DB: D1Database;
}

export type Variables = JwtVariables;

const jwtSecret = process.env.NEXTAUTH_SECRET;
if (!jwtSecret) {
  throw new Error("NEXTAUTH_SECRET is not defined");
}
const jwtMiddleware = jwt({
  secret: jwtSecret,
});

const app = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>()
  .basePath("/api")
  .use("*", jwtMiddleware)
  .route("/users", users)
  .route("/keymaps", keymaps)
  .route("/keymaps_to_share", keymaps_to_share)
  .get("/", async (c) => {
    if (!process.env.DB) {
      return c.json({ error: "DB is not bound" }, 500);
    }
    try {
      await process.env.DB.prepare(`SELECT * FROM users`).all();
      return c.json({ status: "db connected" });
    } catch (error) {
      return c.json({ error: error }, 500);
    }
  });

export type AppType = typeof app;

export const runtime = "edge";

export async function GET(nextReq: NextRequest) {
  const token = await getToken({
    req: nextReq,
    raw: true,
    secureCookie: process.env.APP_ENV === "production",
  });
  const clonedHeaders = new Headers(nextReq.headers);
  if (token) {
    clonedHeaders.set("Authorization", `Bearer ${token}`);
  }
  const honoRequest = new Request(nextReq.url, {
    method: nextReq.method,
    headers: clonedHeaders,
    body: nextReq.body,
  });
  return handle(app)(honoRequest);
}

export async function POST(nextReq: NextRequest) {
  const token = await getToken({
    req: nextReq,
    raw: true,
    secureCookie: process.env.APP_ENV === "production",
  });
  const clonedHeaders = new Headers(nextReq.headers);
  if (token) {
    clonedHeaders.set("Authorization", `Bearer ${token}`);
  }
  const honoRequest = new Request(nextReq.url, {
    method: nextReq.method,
    headers: clonedHeaders,
    body: nextReq.body,
  });

  return handle(app)(honoRequest);
}
