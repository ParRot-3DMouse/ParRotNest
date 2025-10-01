"use client";

import { useEffect, useState } from "react";
import { KeymapComponent } from "../../../components/KeymapComponent";
import { useKeymap } from "../../../components/provider/KeymapContext";
import { initialConfig, initialState } from "../../../lib/device/reducer";

export default function KeymapPage() {
  const { keymapCollection, setKeymapCollection } = useKeymap();
  const [activeLayer, setActiveLayer] = useState<1 | 2 | 3>(1);

  // コンポーネントがマウントされた時に初期状態にリセット
  useEffect(() => {
    setKeymapCollection({
      appName: "",
      config: initialConfig,
      layer1: initialState,
      layer2: initialState,
      layer3: initialState,
    });
  }, [setKeymapCollection]);

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
