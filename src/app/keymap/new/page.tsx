"use client";

import { useEffect, useState } from "react";
import { KeymapCollection } from "../../../lib/device/types";
import { initialState } from "../../../lib/device/reducer";
import { KeymapComponent } from "../../../components/KeymapComponent";
import { css } from "../../../../styled-system/css";
import { useHID } from "../../../components/HIDContext";
import { useRouter } from "next/navigation";

const card = css({
  border: "1px solid",
  borderColor: "gray.700",
  padding: "1rem",
  borderRadius: "0.5rem",
  backgroundColor: "gray.800",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  height: "fit-content",
  margin: "20px",
});

const normal = css({
  fontSize: "0.875rem",
  color: "gray.200",
});

const small = css({
  fontSize: "0.75rem",
  color: "gray.400",
  fontFamily: "monospace",
});

const buttonGroup = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "4",
});

const dangerButton = css({
  backgroundColor: "red.600",
  color: "white",
  paddingLeft: "0.75rem",
  paddingRight: "0.75rem",
  paddingTop: "0.375rem",
  paddingBottom: "0.375rem",
  borderRadius: "0.375rem",
  fontSize: "0.875rem",
  fontWeight: "500",
  _hover: {
    backgroundColor: "red.700",
  },
  _active: {
    backgroundColor: "red.800",
  },
  width: "fit-content",
  cursor: "pointer",
});

export default function KeymapPage() {
  const [keymapCollection, setKeymapCollection] = useState<KeymapCollection>({
    appName: "",
    layer1: initialState,
    layer2: initialState,
    layer3: initialState,
  });
  const [activeLayer, setActiveLayer] = useState<1 | 2 | 3>(1);
  const { connectedDevice, disconnect } = useHID();
  const router = useRouter();

  useEffect(() => {
    if (connectedDevice === null) {
      router.push("/");
    }
  }, [connectedDevice, router]);

  if (connectedDevice === null) {
    return null;
  }

  return (
    <div>
      <div>
        <KeymapComponent
          pageKinds="new"
          keymapCollection={keymapCollection}
          setKeymapCollection={setKeymapCollection}
          activeLayer={activeLayer}
          setActiveLayer={setActiveLayer}
        />
      </div>
      <div className={card}>
        <p className={normal}>
          接続中のデバイス: {connectedDevice.productName}
        </p>
        <p className={small}>
          VendorID: 0x{connectedDevice.vendorId.toString(16)}, ProductID: 0x
          {connectedDevice.productId.toString(16)}
        </p>
        <div className={buttonGroup}>
          <div>
            <button onClick={disconnect} className={dangerButton}>
              切断
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
