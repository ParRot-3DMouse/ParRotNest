import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    token?: JWT;
    access_token?: string; // トークンを追加
    refresh_token?: string;
    id_token?: string;
    user?: User;
  }

  interface User extends DefaultUser {
    access_token?: string; // トークンを追加
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string; // トークンを追加
    refresh_token?: string;
    id_token?: string;
    user?: User;
  }
}
