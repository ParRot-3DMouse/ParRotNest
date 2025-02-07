"use client";

import { css } from "../../styled-system/css";
import { DeviceCard } from "./DeviceCard";
import { useHID } from "./provider/HIDContext";
import { useKeymap } from "./provider/KeymapContext";

type ClientLayoutProps = {
  children: React.ReactNode;
};

export const ClientLayout = ({ children }: ClientLayoutProps) => {
  const { connectedDevice, connect, disconnect } = useHID();
  const { keymapCollection } = useKeymap();
  return (
    <div className={css({ display: "flex", flexDirection: "row" })}>
      <div
        className={css({
          width: "350px",
          minWidth: "350px",
          padding: "20px",
          borderRight: "1px solid #606060",
          height: "calc(100dvh - 70px)",
          backgroundColor: "#2b2727",
          zIndex: 10,
        })}
      >
        <DeviceCard
          keymapCollection={keymapCollection}
          connectedDevice={connectedDevice}
          connect={connect}
          disconnect={disconnect}
        />
      </div>
      <div className={css({ flex: 1 })}>{children}</div>
    </div>
  );
};
