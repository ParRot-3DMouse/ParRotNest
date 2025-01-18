"use client";

import { clientApi } from "../lib/api/clientApi";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function SyncUser() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    } else {
      if (status === "authenticated" && session?.user) {
        console.log("user", session.user);
        console.log("access_token", session.id_token);
        const api = clientApi(session.id_token);
        api.users.postUser({
          user_id: session.user.id ?? session.user.email!,
          user_email: session.user.email!,
          user_name: session.user.name ?? "",
        });
      }
    }
  }, [session, status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please log in to access this page.</div>;
  }

  return null;
}
