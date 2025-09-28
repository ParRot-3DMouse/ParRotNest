import type { KeymapCollection } from "./types";
import { initialConfig, initialState } from "./reducer";

export const normalizeKeymapCollection = (
  collection: Partial<KeymapCollection>
): KeymapCollection => {
  return {
    appName: collection.appName ?? "",
    config: { ...initialConfig, ...(collection.config ?? {}) },
    layer1: collection.layer1 ?? initialState,
    layer2: collection.layer2 ?? initialState,
    layer3: collection.layer3 ?? initialState,
  };
};
