import { useCallback, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { normalizeKeymapCollection } from "../device/normalize";
import type { KeymapCollection } from "../device/types";

export const useKeymapCollectionState = (
  keymapCollection: KeymapCollection,
  setKeymapCollection: Dispatch<SetStateAction<KeymapCollection>>
) => {
  const collection = useMemo(
    () => normalizeKeymapCollection(keymapCollection),
    [keymapCollection]
  );

  const updateCollection = useCallback(
    (value: SetStateAction<KeymapCollection>) => {
      setKeymapCollection((prev) => {
        const normalizedPrev = normalizeKeymapCollection(prev);
        if (typeof value === "function") {
          const next = value(normalizedPrev);
          return normalizeKeymapCollection(next);
        }
        return normalizeKeymapCollection(value);
      });
    },
    [setKeymapCollection]
  );

  const resetCollection = useCallback(() => {
    updateCollection(() => normalizeKeymapCollection({}));
  }, [updateCollection]);

  return {
    collection,
    updateCollection,
    resetCollection,
  } as const;
};
