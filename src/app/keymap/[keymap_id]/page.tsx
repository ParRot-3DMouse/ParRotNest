"use client";

import { useEffect, useState } from "react";
import { KeymapCollection } from "../../../lib/device/types";
import { initialState } from "../../../lib/device/reducer";
// import { css } from "../../../../styled-system/css";
import { KeymapComponent } from "../../../components/KeymapComponent";
import { clientApi } from "../../../lib/api/clientApi";
import { useRouter } from "next/navigation";

export default function KeymapPage({
  params,
}: {
  params: Promise<{ keymap_id: string }>;
}) {
  const [keymapCollection, setKeymapCollection] = useState<KeymapCollection>({
    appName: "",
    layer1: initialState,
    layer2: initialState,
    layer3: initialState,
  });
  const [activeLayer, setActiveLayer] = useState<1 | 2 | 3>(1);
  const [keymap_id, setKeymap_id] = useState<string>("");
  const router = useRouter();
  const api = clientApi();

  const fetchKeymap = async () => {
    try {
      const { keymap_id } = await params;
      setKeymap_id(keymap_id);
      const res = await api.keymaps.getKeymapById({
        keymap_id: keymap_id,
      });
      if (res) {
        const receivedKeymap = res.keymap_json;
        setKeymapCollection(receivedKeymap);
      }
    } catch (error) {
      router.push("/");
      console.error("Failed to fetch keymap:", error);
    }
  };

  useEffect(() => {
    fetchKeymap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
export const runtime = "edge";
