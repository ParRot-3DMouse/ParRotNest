"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeymapComponent } from "../../../components/KeymapComponent";
import { useKeymap } from "../../../components/provider/KeymapContext";
import type { KeymapCollection } from "../../../lib/device/types";
import { useKeymapLoader } from "../../../lib/hooks/useKeymapLoader";

export default function KeymapPage({
  params,
}: {
  params: Promise<{ keymap_id: string }>;
}) {
  const { keymapCollection, setKeymapCollection } = useKeymap();
  const [activeLayer, setActiveLayer] = useState<1 | 2 | 3>(1);
  const [keymapId, setKeymapId] = useState<string>();
  const router = useRouter();

  const handleLoaded = useCallback(
    (collection: KeymapCollection) => {
      setKeymapCollection(collection);
    },
    [setKeymapCollection]
  );

  const handleError = useCallback(
    (error: unknown) => {
      console.error("Failed to fetch keymap:", error);
      router.replace("/404");
    },
    [router]
  );

  useEffect(() => {
    let isSubscribed = true;

    params
      .then(({ keymap_id }) => {
        if (!isSubscribed) return;
        setKeymapId(keymap_id);
      })
      .catch((error) => {
        if (!isSubscribed) return;
        handleError(error);
      });

    return () => {
      isSubscribed = false;
    };
  }, [handleError, params]);

  useKeymapLoader({
    kind: "edit",
    id: keymapId,
    onLoaded: handleLoaded,
    onError: handleError,
    enabled: Boolean(keymapId),
  });

  if (!keymapId) {
    return null;
  }

  return (
    <div>
      <KeymapComponent
        pageKinds="edit"
        keymap_id={keymapId}
        keymapCollection={keymapCollection}
        setKeymapCollection={setKeymapCollection}
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
      />
    </div>
  );
}
