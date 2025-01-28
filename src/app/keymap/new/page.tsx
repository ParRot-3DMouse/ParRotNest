"use client";

import { useState } from "react";
import { KeymapCollection } from "../../../lib/device/types";
import { initialState } from "../../../lib/device/reducer";
import { KeymapComponent } from "../../../components/KeymapComponent";

export default function KeymapPage() {
  const [keymapCollection, setKeymapCollection] = useState<KeymapCollection>({
    appName: "",
    layer1: initialState,
    layer2: initialState,
    layer3: initialState,
  });
  const [activeLayer, setActiveLayer] = useState<1 | 2 | 3>(1);

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
    </div>
  );
}
