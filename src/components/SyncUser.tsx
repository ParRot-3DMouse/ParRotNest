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
        const api = clientApi();
        api.users.postUser({
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
