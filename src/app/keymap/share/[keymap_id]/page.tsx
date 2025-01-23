"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeymapComponent } from "../../../../components/KeymapComponent";
import { clientApi } from "../../../../lib/api/clientApi";
import { initialState } from "../../../../lib/device/reducer";
import { KeymapCollection } from "../../../../lib/device/types";

export default function KeymapPage({
  params,
}: {
  params: Promise<{ keymap_id: string }>;
}) {
  const [keymapCollection, setKeymapCollection] = useState<KeymapCollection>({
    appName: "",
    rayer1: initialState,
    rayer2: initialState,
    rayer3: initialState,
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
        console.log("res.keymap_json", res.keymap_json);
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
        pageKinds="share"
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
