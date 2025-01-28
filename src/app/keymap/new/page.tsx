"use client";

import { useState } from "react";
import { KeymapCollection } from "../../../lib/device/types";
import { initialState } from "../../../lib/device/reducer";
import { KeymapComponent } from "../../../components/KeymapComponent";
import { useHID } from "../../../components/provider/HIDContext";
import { DeviceCard } from "../../../components/DeviceCard";

export default function KeymapPage() {
  const [keymapCollection, setKeymapCollection] = useState<KeymapCollection>({
    appName: "",
    layer1: initialState,
    layer2: initialState,
    layer3: initialState,
  });
  const [activeLayer, setActiveLayer] = useState<1 | 2 | 3>(1);
  const { connectedDevice, connect, disconnect } = useHID();

  return (
    <div>
      <div>
        <DeviceCard
          connectedDevice={connectedDevice}
          connect={connect}
          disconnect={disconnect}
        />
        <KeymapComponent
          pageKinds="new"
          keymapCollection={keymapCollection}
          setKeymapCollection={setKeymapCollection}
          activeLayer={activeLayer}
          setActiveLayer={setActiveLayer}
        />
      </div>
    </div>
  );
}
