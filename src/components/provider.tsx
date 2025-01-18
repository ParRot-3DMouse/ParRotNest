"use client";

import SyncUser from "./SyncUser";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

type ProviderProps = {
  children: ReactNode;
};

function Provider({ children }: ProviderProps) {
  return (
    <SessionProvider>
      <SyncUser />
      {children}
    </SessionProvider>
  );
}

export default Provider;
