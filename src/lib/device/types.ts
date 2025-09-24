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
  | "DPI SLOT 1"
  | "DPI SLOT 2"
  | "DPI SLOT 3"
  | "LAYER CYCLE"
  | "LAYER HOLD 1"
  | "LAYER HOLD 2"
  | "LAYER HOLD 3"
  | "APP CYCLE"
  | "APP 1 SELECT"
  | "APP 2 SELECT"
  | "APP 3 SELECT"
  | "SLOT CYCLE"
  | "AXIS LOCK X"
  | "AXIS LOCK Y"
  | "AXIS LOCK Z"
  | "AXIS LOCK X HOLD"
  | "AXIS LOCK Y HOLD"
  | "AXIS LOCK Z HOLD"
  | "VIEWCUBE HOME"
  | "VIEWCUBE NEAREST FACE"
  | "VIEWCUBE UP"
  | "VIEWCUBE DOWN"
  | "VIEWCUBE LEFT"
  | "VIEWCUBE RIGHT"
  | "VIEWCUBE FRONT"
  | "VIEWCUBE BACK"
  | "VIEWCUBE ROTATE X +90"
  | "VIEWCUBE ROTATE X -90"
  | "VIEWCUBE ROTATE Y +90"
  | "VIEWCUBE ROTATE Y -90"
  | "VIEWCUBE ROTATE Z +90"
  | "VIEWCUBE ROTATE Z -90";

export type KeymapConfig = {
  xFlip: boolean;
  yFlip: boolean;
  zFlip: boolean;
  xMirror: boolean;
  yMirror: boolean;
  zMirror: boolean;
  dpiSlot1: number;
  dpiSlot2: number;
  dpiSlot3: number;
  ledConfig?: number;
};

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
  config: KeymapConfig;
  layer1: KeymapType;
  layer2: KeymapType;
  layer3: KeymapType;
};
