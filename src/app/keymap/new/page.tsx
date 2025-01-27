"use client";

import { useEffect, useState } from "react";
import { KeymapCollection } from "../../../lib/device/types";
import { initialState } from "../../../lib/device/reducer";
import { KeymapComponent } from "../../../components/KeymapComponent";
import { useHID } from "../../../components/provider/HIDContext";
import { useRouter } from "next/navigation";
import { DeviceCard } from "../../../components/DeviceCard";

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
      <DeviceCard connectedDevice={connectedDevice} disconnect={disconnect} />
    </div>
  );
}
