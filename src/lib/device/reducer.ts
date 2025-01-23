import { KeymapType } from "./types";

export const initialState: KeymapType = {
  column1: {
    key1: { type: "standard", character: "", modifiers: [] },
    key2: { type: "standard", character: "", modifiers: [] },
    key3: { type: "standard", character: "", modifiers: [] },
  },
  column2: {
    key1: { type: "standard", character: "", modifiers: [] },
    key2: { type: "standard", character: "", modifiers: [] },
    key3: { type: "standard", character: "", modifiers: [] },
  },
  column3: {
    key1: { type: "standard", character: "", modifiers: [] },
    key2: { type: "standard", character: "", modifiers: [] },
    key3: { type: "standard", character: "", modifiers: [] },
  },
  column4: {
    key1: { type: "standard", character: "", modifiers: [] },
    key2: { type: "standard", character: "", modifiers: [] },
    key3: { type: "standard", character: "", modifiers: [] },
  },
  thumbKey1: { type: "standard", character: "", modifiers: [] },
  thumbKey2: { type: "standard", character: "", modifiers: [] },
  monitorKey: { type: "standard", character: "", modifiers: [] },
};

export const ActionType = {
  reset: "keyRemap/reset",
  update: "keyRemap/update",
} as const;

export type Action =
  | { type: typeof ActionType.reset }
  | { type: typeof ActionType.update; payload: Partial<KeymapType> };

export const reset = (): Action => ({ type: ActionType.reset });
