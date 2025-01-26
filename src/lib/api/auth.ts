import NextAuth, { NextAuthConfig, Session } from "next-auth";
import Google from "next-auth/providers/google";
import { Provider } from "next-auth/providers";
import { JWT, JWTDecodeParams, JWTEncodeParams } from "next-auth/jwt";
import { JWTPayload, SignJWT, jwtVerify } from "jose";

const providers: Provider[] = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    authorization: {
      params: {
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
      },
    },
  }),
];

export const config: NextAuthConfig = {
  providers: providers,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
    async encode({ token, secret, maxAge }: JWTEncodeParams): Promise<string> {
      if (!token) {
        throw new Error("Token is undefined");
      }

      const payload = token as JWTPayload;

      if (!maxAge) {
        throw new Error("maxAge is undefined");
      }

      const derivedSecret = Array.isArray(secret) ? secret[0] : secret;
      if (!derivedSecret) {
        throw new Error("Secret is undefined or invalid");
      }

      const encodedToken = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(Math.floor(Date.now() / 1000) + maxAge)
        .sign(new TextEncoder().encode(derivedSecret));

      return encodedToken;
    },
    async decode({ token, secret }: JWTDecodeParams): Promise<JWT | null> {
      if (!token) {
        console.error("Token is undefined");
        return null;
      }

      const derivedSecret = Array.isArray(secret) ? secret[0] : secret;
      if (!derivedSecret) {
        console.error("Secret is undefined or invalid");
        return null;
      }

      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(derivedSecret),
          { algorithms: ["HS256"] }
        );
        return payload as JWT;
      } catch (err) {
        console.error("JWT decode error:", err);
        return null;
      }
    },
  },
  debug: process.env.APP_ENV !== "production",
  trustHost: true,
  callbacks: {
    async redirect({ url }) {
      return url;
    },
    async jwt({ token }: { token: JWT }) {
      return token;
    },

    async session({ session }: { session: Session }) {
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
