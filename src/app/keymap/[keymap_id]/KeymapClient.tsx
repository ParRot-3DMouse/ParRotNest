"use client";

import { useState } from "react";
import { KeymapComponent } from "../../../components/KeymapComponent";
import { initialState } from "../../../lib/device/reducer";
import { KeymapCollection } from "../../../lib/device/types";

type KeymapClientProps = {
  keymap_id: string;
  initialKeymapCollection: KeymapCollection;
};

export function KeymapClient({
  keymap_id,
  initialKeymapCollection,
}: KeymapClientProps) {
  const [keymapCollection, setKeymapCollection] = useState<KeymapCollection>(
    initialKeymapCollection ?? {
      appName: "",
      layer1: initialState,
      layer2: initialState,
      layer3: initialState,
    }
  );
  const [activeLayer, setActiveLayer] = useState<1 | 2 | 3>(1);

  return (
    <div>
      <KeymapComponent
        pageKinds="edit"
        keymap_id={keymap_id}
        keymapCollection={keymapCollection}
        setKeymapCollection={setKeymapCollection}
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
      />
    </div>
  );
}
