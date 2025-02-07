"use client";

import { useState } from "react";
import { KeymapComponent } from "../../../components/KeymapComponent";
import { useKeymap } from "../../../components/provider/KeymapContext";

export default function KeymapPage() {
  const { keymapCollection, setKeymapCollection } = useKeymap();
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
