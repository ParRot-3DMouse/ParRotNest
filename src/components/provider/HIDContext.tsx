"use client";

import { createContext, useContext, useState } from "react";

interface HIDContextProps {
  connectedDevice: HIDDevice | null;
  error: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  setError: (error: string) => void;
}

const HIDContext = createContext<HIDContextProps | undefined>(undefined);

export const HIDProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [connectedDevice, setConnectedDevice] = useState<HIDDevice | null>(
    null
  );
  const [error, setError] = useState<string>("");

  const connect = async () => {
    try {
      const devices = await navigator.hid.requestDevice({
        filters: [{ usagePage: 0x01 }],
      });
      if (devices.length === 0) throw new Error("No devices selected");
      const device = devices[0];

      if (!device.opened) await device.open();
      setConnectedDevice(device);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect device");
    }
  };

  const disconnect = async () => {
    if (connectedDevice) {
      await connectedDevice.close();
      setConnectedDevice(null);
    }
  };

  return (
    <HIDContext.Provider
      value={{ connectedDevice, error, connect, disconnect, setError }}
    >
      {children}
    </HIDContext.Provider>
  );
};

export const useHID = (): HIDContextProps => {
  const context = useContext(HIDContext);
  if (!context) throw new Error("useHID must be used within a HIDProvider");
  return context;
};
