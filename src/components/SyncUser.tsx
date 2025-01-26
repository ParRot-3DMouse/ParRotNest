"use client";

import { clientApi } from "../lib/api/clientApi";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useUser } from "./provider/UserContext";
export default function SyncUser() {
  const { data: session, status } = useSession();
  const { setUserId } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (status === "loading") {
        return;
      }

      if (status === "unauthenticated") {
        signIn();
        return;
      }

      if (status === "authenticated" && session?.user) {
        try {
          const res = await clientApi().users.postUser({
            user_email: session.user.email!,
            user_name: session.user.name ?? "",
          });

          if (res.user_id) {
            setUserId(res.user_id);
          } else {
            signOut();
          }
        } catch (error) {
          console.error("sync error", error);
          signOut();
        }
      }
    };

    syncUser();
  }, [session, setUserId, status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please log in to access this page.</div>;
  }

  return null;
}
