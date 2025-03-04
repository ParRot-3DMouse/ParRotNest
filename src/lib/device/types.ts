// モディファイアキーの型定義
export type ModifierKey = "Shift" | "Ctrl" | "Meta" | "Alt";

// 英数字の型定義
export type AlphanumericKey =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z"
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9";

// ファンクションキーの型定義
export type FunctionKey =
  | "F1"
  | "F2"
  | "F3"
  | "F4"
  | "F5"
  | "F6"
  | "F7"
  | "F8"
  | "F9"
  | "F10"
  | "F11"
  | "F12";

// 特殊キーの型定義
export type SpecialKey =
  | "Enter"
  | "Backspace"
  | "Tab"
  | "Space"
  | "CapsLock"
  | "Delete"
  | "Home"
  | "End"
  | "PageUp"
  | "PageDown"
  | "Left"
  | "Right"
  | "Up"
  | "Down"
  | "Esc";

// すべてのキーを含む型定義
export type KeyboardInput =
  | ModifierKey
  | AlphanumericKey
  | FunctionKey
  | SpecialKey
  | "";

export function isValidKey(key: string): key is KeyboardInput {
  const validKeys: KeyboardInput[] = [
    // ModifierKey
    "Shift",
    "Ctrl",
    "Meta",
    "Alt",

    // AlphanumericKey
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",

    // FunctionKey
    "F1",
    "F2",
    "F3",
    "F4",
    "F5",
    "F6",
    "F7",
    "F8",
    "F9",
    "F10",
    "F11",
    "F12",

    // SpecialKey
    "Enter",
    "Backspace",
    "Tab",
    "Space",
    "CapsLock",
    "Delete",
    "Home",
    "End",
    "PageUp",
    "PageDown",
    "Left",
    "Right",
    "Up",
    "Down",
    "Esc",
  ];
  return validKeys.includes(key as KeyboardInput);
}

export interface StandardKey {
  type: "standard";
  modifiers: ModifierKey[];
  character: KeyboardInput;
}

export type SwitchMovementKey = "MOVEMENT MODE TOGGLE" | "MOVEMENT MODE HOLD";

export type DPIKey = "DPI CYCLE";

export type LayerKey =
  | "LAYER CYCLE"
  | "LAYER HOLD 1"
  | "LAYER HOLD 2"
  | "LAYER HOLD 3";

export type SlotKey = "SLOT CYCLE";

export type AxisLockKey =
  | "AXIS LOCK X"
  | "AXIS LOCK Y"
  | "AXIS LOCK Z"
  | "AXIS LOCK X HOLD"
  | "AXIS LOCK Y HOLD"
  | "AXIS LOCK Z HOLD";

export type UniqueKey =
  | "MOVEMENT MODE TOGGLE"
  | "MOVEMENT MODE HOLD"
  | "DPI CYCLE"
  | "LAYER CYCLE"
  | "LAYER HOLD 1"
  | "LAYER HOLD 2"
  | "LAYER HOLD 3"
  | "SLOT CYCLE"
  | "AXIS LOCK X"
  | "AXIS LOCK Y"
  | "AXIS LOCK Z"
  | "AXIS LOCK X HOLD"
  | "AXIS LOCK Y HOLD"
  | "AXIS LOCK Z HOLD";

export interface CustomKey {
  type: "custom";
  uniqueKey: UniqueKey;
}

export type Key = StandardKey | CustomKey;

export type KeyColumn = {
  key1: Key;
  key2: Key;
  key3: Key;
};

export type KeymapType = {
  column1: KeyColumn;
  column2: KeyColumn;
  column3: KeyColumn;
  thumbKey1: Key;
  thumbKey2: Key;
  monitorKey: Key;
};

export type KeymapCollection = {
  appName: string;
  layer1: KeymapType;
  layer2: KeymapType;
  layer3: KeymapType;
};
