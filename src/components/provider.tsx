"use client";

import SyncUser from "./SyncUser";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { HIDProvider } from "./HIDContext";

type ProviderProps = {
  children: ReactNode;
};

function Provider({ children }: ProviderProps) {
  return (
    <SessionProvider>
      <HIDProvider>
        <SyncUser />
        {children}
      </HIDProvider>
    </SessionProvider>
  );
}

export default Provider;
