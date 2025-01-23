"use client";

import { useState } from "react";
import { KeymapCollection } from "../../../lib/device/types";
import { initialState } from "../../../lib/device/reducer";
import { KeymapComponent } from "../../../components/KeymapComponent";
// import { css } from "../../../../styled-system/css";

export default function KeymapPage() {
  const [keymapCollection, setKeymapCollection] = useState<KeymapCollection>({
    appName: "",
    rayer1: initialState,
    rayer2: initialState,
    rayer3: initialState,
  });
  const [activeLayer, setActiveLayer] = useState<1 | 2 | 3>(1);
  return (
    <div>
      <KeymapComponent
        keymapCollection={keymapCollection}
        setKeymapCollection={setKeymapCollection}
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
      />
    </div>
  );
}
