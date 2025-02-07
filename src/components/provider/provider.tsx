"use client";

import SyncUser from "../SyncUser";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { HIDProvider } from "./HIDContext";
import { UserProvider } from "./UserContext";
import { KeymapProvider } from "./KeymapContext";

type ProviderProps = {
  children: ReactNode;
};

function Provider({ children }: ProviderProps) {
  return (
    <SessionProvider>
      <HIDProvider>
        <UserProvider>
          <KeymapProvider>
            <SyncUser />
            {children}
          </KeymapProvider>
        </UserProvider>
      </HIDProvider>
    </SessionProvider>
  );
}

export default Provider;
