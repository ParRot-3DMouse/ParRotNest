import { Hono } from "hono";
// import { jwt, JwtVariables } from "hono/jwt";
import users from "./users";
import { D1Database } from "@cloudflare/workers-types";
import { handle } from "hono/vercel";
import { jwt, JwtVariables } from "hono/jwt";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export interface Bindings {
  DB: D1Database;
}

export type Variables = JwtVariables;

const jwtSecret = process.env.NEXTAUTH_SECRET;
console.log("jwtSecret", jwtSecret);
console.log("nextauth_url", process.env.NEXTAUTH_URL);
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
  .get("/", async (c) => {
    if (!process.env.DB) {
      return c.json({ error: "DB is not bound" }, 500);
    }
    try {
      const result = await process.env.DB.prepare(`SELECT * FROM users`).all();
      return c.json(result);
    } catch (error) {
      return c.json({ error: error }, 500);
    }
  });

export type AppType = typeof app;

export const runtime = "edge";

export async function GET(nextReq: NextRequest) {
  const token = await getToken({ req: nextReq, raw: true, secureCookie: true });
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
  const token = await getToken({ req: nextReq, raw: true, secureCookie: true });
  console.log("token", token);
  console.log("jwtSecret", jwtSecret);
  console.log("nextauth_url", process.env.NEXTAUTH_URL);
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
