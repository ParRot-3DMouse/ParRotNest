// Generated by Wrangler by running `wrangler types --env-interface CloudflareEnv env.d.ts`

interface CloudflareEnv {
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string;
  NEXTAUTH_URL_INTERNAL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  D1_DB_NAME: string;
  D1_DB_ID: string;
  APP_ENV: string;
  DB: D1Database;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB: D1Database;
    }
  }
}

export {};
