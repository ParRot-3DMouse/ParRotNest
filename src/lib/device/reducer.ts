import { KeyMapType } from "./types";

export const initialState: KeyMapType = {
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
  | { type: typeof ActionType.update; payload: Partial<KeyMapType> };

export const reducer = (state: KeyMapType, action: Action): KeyMapType => {
  switch (action.type) {
    case ActionType.reset:
      return initialState;
    case ActionType.update:
      return { ...state, ...action.payload };
    default: {
      return state;
    }
  }
};

export const reset = (): Action => ({ type: ActionType.reset });

export const update = (payload: Partial<KeyMapType>): Action => ({
  type: ActionType.update,
  payload,
});
